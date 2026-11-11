using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SchoolAdmission.Data;
using SchoolAdmission.Data.Repositories.Interfaces;
using SchoolAdmission.Domain.Entities;
using SchoolAdmission.Domain.Enums;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Exceptions;
using SchoolAdmission.Services.Interfaces;
using SchoolAdmission.Services.Options;

namespace SchoolAdmission.Services;

public class HoldService(
    IClassRepository classRepository,
    IHoldRepository holdRepository,
    IUnitOfWork unitOfWork,
    IOptions<HoldOptions> holdOptions,
    TimeProvider timeProvider) : IHoldService
{
    public async Task<CreateHoldResponse> CreateAsync(Guid classId, string? studentId, CancellationToken ct = default)
    {
        var student = StudentIdValidator.Validate(studentId);
        var now = UtcNow();

        await using var transaction = await unitOfWork.BeginTransactionAsync(ct);

        var lockedClass = await classRepository.GetByIdForUpdateAsync(classId, ct)
            ?? throw new NotFoundException(ErrorCodes.ClassNotFound, "Class not found.");

        await holdRepository.ExpireStaleAsync(now, classId, ct);

        if (await holdRepository.HasActiveHoldAsync(classId, student, now, ct))
        {
            throw AlreadyApplied();
        }

        var takenSeats = await holdRepository.CountTakenSeatsAsync(classId, now, ct);
        if (takenSeats >= lockedClass.TotalSeats)
        {
            throw new ConflictException(ErrorCodes.NoSeatsAvailable,
                $"No seats left in {lockedClass.Name}.");
        }

        var hold = new Hold
        {
            Id = Guid.NewGuid(),
            ClassId = classId,
            StudentId = student,
            Status = HoldStatus.Held,
            CreatedAt = now,
            ExpiresAt = TruncateToSeconds(now.AddSeconds(holdOptions.Value.DurationSeconds))
        };

        await holdRepository.AddAsync(hold, ct);

        try
        {
            await unitOfWork.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }
        catch (DbUpdateException ex) when (DbErrors.IsUniqueViolation(ex))
        {
            throw AlreadyApplied();
        }

        return new CreateHoldResponse(hold.Id, hold.ClassId, hold.StudentId, ToApi(hold.Status), hold.ExpiresAt);
    }

    public async Task<HoldResponse> GetByIdAsync(Guid holdId, CancellationToken ct = default)
    {
        var hold = await FindAsync(holdId, ct);
        return new HoldResponse(hold.Id, hold.ClassId, ToApi(hold.GetEffectiveStatus(UtcNow())), hold.ExpiresAt);
    }

    public async Task<ConfirmHoldResponse> ConfirmAsync(Guid holdId, string? studentId, CancellationToken ct = default)
    {
        var student = StudentIdValidator.Validate(studentId);
        var now = UtcNow();

        if (await holdRepository.TryConfirmAsync(holdId, student, now, ct))
        {
            return new ConfirmHoldResponse(holdId, ToApi(HoldStatus.Confirmed));
        }

        var hold = await FindOwnedAsync(holdId, student, ct);

        return hold.GetEffectiveStatus(now) switch
        {
            HoldStatus.Confirmed => new ConfirmHoldResponse(hold.Id, ToApi(HoldStatus.Confirmed)),
            HoldStatus.Expired => throw new ConflictException(ErrorCodes.HoldExpired,
                "This application has expired. Please apply again if seats are available."),
            HoldStatus.Cancelled => throw new ConflictException(ErrorCodes.HoldCancelled,
                "This application was cancelled."),
            _ => throw new ConflictException(ErrorCodes.InvalidRequest, "The application could not be confirmed. Please try again.")
        };
    }

    public async Task CancelAsync(Guid holdId, string? studentId, CancellationToken ct = default)
    {
        var student = StudentIdValidator.Validate(studentId);
        var now = UtcNow();

        if (await holdRepository.TryCancelAsync(holdId, student, now, ct))
        {
            return;
        }

        var hold = await FindOwnedAsync(holdId, student, ct);

        switch (hold.GetEffectiveStatus(now))
        {
            case HoldStatus.Cancelled:
                return;
            case HoldStatus.Confirmed:
                throw new ConflictException(ErrorCodes.HoldAlreadyConfirmed,
                    "This admission is already confirmed and cannot be cancelled.");
            case HoldStatus.Expired:
                throw new ConflictException(ErrorCodes.HoldExpired, "This application has already expired.");
            default:
                throw new ConflictException(ErrorCodes.InvalidRequest, "The application could not be cancelled. Please try again.");
        }
    }

    public async Task<IReadOnlyList<MyHoldResponse>> GetByStudentAsync(string? studentId, CancellationToken ct = default)
    {
        var student = StudentIdValidator.Validate(studentId);
        var now = UtcNow();
        var holds = await holdRepository.GetByStudentAsync(student, ct);

        return holds
            .Select(h => new MyHoldResponse(h.Id, h.ClassId, h.Class.Name, ToApi(h.GetEffectiveStatus(now)), h.ExpiresAt))
            .ToList();
    }

    public Task<int> ExpireStaleHoldsAsync(CancellationToken ct = default) =>
        holdRepository.ExpireStaleAsync(UtcNow(), ct: ct);

    private async Task<Hold> FindAsync(Guid holdId, CancellationToken ct) =>
        await holdRepository.GetByIdAsync(holdId, ct)
        ?? throw new NotFoundException(ErrorCodes.HoldNotFound, "Application not found.");

    private async Task<Hold> FindOwnedAsync(Guid holdId, string studentId, CancellationToken ct)
    {
        var hold = await FindAsync(holdId, ct);
        if (hold.StudentId != studentId)
        {
            throw new ForbiddenException(ErrorCodes.NotYourHold, "This application belongs to another student.");
        }

        return hold;
    }

    private DateTime UtcNow() => timeProvider.GetUtcNow().UtcDateTime;

    private static DateTime TruncateToSeconds(DateTime value) =>
        new(value.Ticks - value.Ticks % TimeSpan.TicksPerSecond, DateTimeKind.Utc);

    private static string ToApi(HoldStatus status) => status.ToString().ToUpperInvariant();

    private static ConflictException AlreadyApplied() =>
        new(ErrorCodes.AlreadyApplied, "This student already has an active application for this class.");
}
