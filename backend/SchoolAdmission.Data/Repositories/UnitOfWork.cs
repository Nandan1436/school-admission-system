using Microsoft.EntityFrameworkCore.Storage;
using SchoolAdmission.Data.Repositories.Interfaces;

namespace SchoolAdmission.Data.Repositories;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default) =>
        db.Database.BeginTransactionAsync(ct);

    public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        db.SaveChangesAsync(ct);
}
