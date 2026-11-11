using SchoolAdmission.Services.Dtos;

namespace SchoolAdmission.Services.Interfaces;

public interface IHoldService
{
    Task<CreateHoldResponse> CreateAsync(Guid classId, string? studentId, CancellationToken ct = default);
    Task<HoldResponse> GetByIdAsync(Guid holdId, CancellationToken ct = default);
    Task<ConfirmHoldResponse> ConfirmAsync(Guid holdId, string? studentId, CancellationToken ct = default);
    Task CancelAsync(Guid holdId, string? studentId, CancellationToken ct = default);
    Task<IReadOnlyList<MyHoldResponse>> GetByStudentAsync(string? studentId, CancellationToken ct = default);
    Task<int> ExpireStaleHoldsAsync(CancellationToken ct = default);
}
