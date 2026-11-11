using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data.Repositories.Interfaces;
using SchoolAdmission.Domain.Entities;
using SchoolAdmission.Domain.Enums;

namespace SchoolAdmission.Data.Repositories;

public class HoldRepository(AppDbContext db) : IHoldRepository
{
    public async Task AddAsync(Hold hold, CancellationToken ct = default) =>
        await db.Holds.AddAsync(hold, ct);

    public Task<Hold?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        db.Holds.AsNoTracking().FirstOrDefaultAsync(h => h.Id == id, ct);

    public async Task<IReadOnlyList<Hold>> GetByStudentAsync(string studentId, CancellationToken ct = default) =>
        await db.Holds.AsNoTracking()
            .Include(h => h.Class)
            .Where(h => h.StudentId == studentId)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync(ct);

    public Task<bool> HasActiveHoldAsync(Guid classId, string studentId, DateTime utcNow, CancellationToken ct = default) =>
        db.Holds.AnyAsync(h =>
            h.ClassId == classId
            && h.StudentId == studentId
            && (h.Status == HoldStatus.Confirmed || (h.Status == HoldStatus.Held && h.ExpiresAt > utcNow)), ct);

    public Task<int> CountTakenSeatsAsync(Guid classId, DateTime utcNow, CancellationToken ct = default) =>
        db.Holds.CountAsync(h =>
            h.ClassId == classId
            && (h.Status == HoldStatus.Confirmed || (h.Status == HoldStatus.Held && h.ExpiresAt > utcNow)), ct);

    public Task<int> ExpireStaleAsync(DateTime utcNow, Guid? classId = null, CancellationToken ct = default)
    {
        var query = db.Holds.Where(h => h.Status == HoldStatus.Held && h.ExpiresAt <= utcNow);
        if (classId is not null)
        {
            query = query.Where(h => h.ClassId == classId);
        }

        return query.ExecuteUpdateAsync(s => s.SetProperty(h => h.Status, HoldStatus.Expired), ct);
    }

    public async Task<bool> TryConfirmAsync(Guid holdId, string studentId, DateTime utcNow, CancellationToken ct = default)
    {
        var updated = await ActiveHoldOf(holdId, studentId, utcNow)
            .ExecuteUpdateAsync(s => s
                .SetProperty(h => h.Status, HoldStatus.Confirmed)
                .SetProperty(h => h.ConfirmedAt, utcNow), ct);
        return updated == 1;
    }

    public async Task<bool> TryCancelAsync(Guid holdId, string studentId, DateTime utcNow, CancellationToken ct = default)
    {
        var updated = await ActiveHoldOf(holdId, studentId, utcNow)
            .ExecuteUpdateAsync(s => s
                .SetProperty(h => h.Status, HoldStatus.Cancelled)
                .SetProperty(h => h.CancelledAt, utcNow), ct);
        return updated == 1;
    }

    private IQueryable<Hold> ActiveHoldOf(Guid holdId, string studentId, DateTime utcNow) =>
        db.Holds.Where(h =>
            h.Id == holdId
            && h.StudentId == studentId
            && h.Status == HoldStatus.Held
            && h.ExpiresAt > utcNow);
}
