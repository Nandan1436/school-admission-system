using Microsoft.EntityFrameworkCore.Storage;

namespace SchoolAdmission.Data.Repositories.Interfaces;

public interface IUnitOfWork
{
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
