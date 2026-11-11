namespace SchoolAdmission.Services.Dtos;

public record ClassOptionsResponse(IReadOnlyList<string> Grades, IReadOnlyList<string> Shifts);
