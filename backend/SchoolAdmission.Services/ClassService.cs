using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;
using SchoolAdmission.Data.Models;
using SchoolAdmission.Data.Repositories.Interfaces;
using SchoolAdmission.Domain.Entities;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Exceptions;
using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Services;

public class ClassService(
    IClassRepository classRepository,
    IUnitOfWork unitOfWork,
    TimeProvider timeProvider) : IClassService
{
    public const int MaxNameLength = 100;
    public const int MaxTotalSeats = 10_000;

    public async Task<CreateClassResponse> CreateAsync(CreateClassRequest request, CancellationToken ct = default)
    {
        var name = request.Name?.Trim();

        if (string.IsNullOrEmpty(name))
        {
            throw new ValidationException(ErrorCodes.InvalidRequest, "Class name is required.");
        }

        if (name.Length > MaxNameLength)
        {
            throw new ValidationException(ErrorCodes.InvalidRequest,
                $"Class name must be at most {MaxNameLength} characters.");
        }

        if (request.TotalSeats is < 1 or > MaxTotalSeats)
        {
            throw new ValidationException(ErrorCodes.InvalidRequest,
                $"Total seats must be between 1 and {MaxTotalSeats}.");
        }

        if (await classRepository.NameExistsAsync(name, ct))
        {
            throw ClassNameTaken(name);
        }

        var entity = new Class
        {
            Id = Guid.NewGuid(),
            Name = name,
            TotalSeats = request.TotalSeats,
            CreatedAt = timeProvider.GetUtcNow().UtcDateTime
        };

        await classRepository.AddAsync(entity, ct);

        try
        {
            await unitOfWork.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (DbErrors.IsUniqueViolation(ex))
        {
            throw ClassNameTaken(name);
        }

        return new CreateClassResponse(entity.Id, entity.Name, entity.TotalSeats);
    }

    public async Task<IReadOnlyList<ClassResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var classes = await classRepository.GetAllWithSeatsAsync(timeProvider.GetUtcNow().UtcDateTime, ct);
        return classes.Select(ToResponse).ToList();
    }

    public async Task<ClassResponse> GetByIdAsync(Guid classId, CancellationToken ct = default)
    {
        var found = await classRepository.GetWithSeatsAsync(classId, timeProvider.GetUtcNow().UtcDateTime, ct)
            ?? throw new NotFoundException(ErrorCodes.ClassNotFound, "Class not found.");
        return ToResponse(found);
    }

    private static ClassResponse ToResponse(ClassWithSeats c) =>
        new(c.Id, c.Name, c.TotalSeats, c.HeldSeats, c.ConfirmedSeats, c.AvailableSeats);

    private static ConflictException ClassNameTaken(string name) =>
        new(ErrorCodes.ClassNameTaken, $"A class named \"{name}\" already exists.");
}
