using SchoolAdmission.Data.Models;
using SchoolAdmission.Domain.Entities;

namespace SchoolAdmission.Data.Repositories.Interfaces;

public interface IClassRepository
{
    Task AddAsync(Class entity, CancellationToken ct = default);
    Task<bool> NameExistsAsync(string name, CancellationToken ct = default);

    Task<Class?> GetByIdForUpdateAsync(Guid id, CancellationToken ct = default);

    Task<IReadOnlyList<ClassWithSeats>> GetAllWithSeatsAsync(DateTime utcNow, CancellationToken ct = default);
    Task<ClassWithSeats?> GetWithSeatsAsync(Guid id, DateTime utcNow, CancellationToken ct = default);
}
