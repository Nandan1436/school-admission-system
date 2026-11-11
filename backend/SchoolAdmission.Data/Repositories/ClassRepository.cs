using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data.Models;
using SchoolAdmission.Data.Repositories.Interfaces;
using SchoolAdmission.Domain.Entities;
using SchoolAdmission.Domain.Enums;

namespace SchoolAdmission.Data.Repositories;

public class ClassRepository(AppDbContext db) : IClassRepository
{
    public async Task AddAsync(Class entity, CancellationToken ct = default) =>
        await db.Classes.AddAsync(entity, ct);

    public Task<bool> NameExistsAsync(string name, CancellationToken ct = default) =>
        db.Classes.AnyAsync(c => c.Name == name, ct);

    public Task<Class?> GetByIdForUpdateAsync(Guid id, CancellationToken ct = default) =>
        db.Classes
            .FromSql($"SELECT * FROM class WHERE id = {id} FOR UPDATE")
            .SingleOrDefaultAsync(ct);

    public async Task<IReadOnlyList<ClassWithSeats>> GetAllWithSeatsAsync(DateTime utcNow, CancellationToken ct = default) =>
        await WithSeats(db.Classes.AsNoTracking(), utcNow)
            .OrderBy(c => c.Name)
            .ToListAsync(ct);

    public Task<ClassWithSeats?> GetWithSeatsAsync(Guid id, DateTime utcNow, CancellationToken ct = default) =>
        WithSeats(db.Classes.AsNoTracking().Where(c => c.Id == id), utcNow)
            .SingleOrDefaultAsync(ct);

    private static IQueryable<ClassWithSeats> WithSeats(IQueryable<Class> classes, DateTime utcNow) =>
        classes.Select(c => new ClassWithSeats(
            c.Id,
            c.Name,
            c.TotalSeats,
            c.Holds.Count(h => h.Status == HoldStatus.Held && h.ExpiresAt > utcNow),
            c.Holds.Count(h => h.Status == HoldStatus.Confirmed)));
}
