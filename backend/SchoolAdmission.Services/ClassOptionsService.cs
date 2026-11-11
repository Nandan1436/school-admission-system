using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Services;

public class ClassOptionsService : IClassOptionsService
{
    private static readonly IReadOnlyList<string> Grades =
        Enumerable.Range(1, 10).Select(n => $"Class {n}").ToList();

    private static readonly IReadOnlyList<string> Shifts = ["Morning Shift", "Day Shift"];

    public ClassOptionsResponse Get() => new(Grades, Shifts);
}
