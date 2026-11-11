using SchoolAdmission.Services.Dtos;

namespace SchoolAdmission.Services.Interfaces;

public interface IClassService
{
    Task<CreateClassResponse> CreateAsync(CreateClassRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<ClassResponse>> GetAllAsync(CancellationToken ct = default);
    Task<ClassResponse> GetByIdAsync(Guid classId, CancellationToken ct = default);
}
