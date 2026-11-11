using SchoolAdmission.Domain.Entities;

namespace SchoolAdmission.Data.Repositories.Interfaces;

public interface IHoldRepository
{
    Task AddAsync(Hold hold, CancellationToken ct = default);
    Task<Hold?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Hold>> GetByStudentAsync(string studentId, CancellationToken ct = default);

    Task<bool> HasActiveHoldAsync(Guid classId, string studentId, DateTime utcNow, CancellationToken ct = default);

    Task<int> CountTakenSeatsAsync(Guid classId, DateTime utcNow, CancellationToken ct = default);

    Task<int> ExpireStaleAsync(DateTime utcNow, Guid? classId = null, CancellationToken ct = default);

    Task<bool> TryConfirmAsync(Guid holdId, string studentId, DateTime utcNow, CancellationToken ct = default);

    Task<bool> TryCancelAsync(Guid holdId, string studentId, DateTime utcNow, CancellationToken ct = default);
}
