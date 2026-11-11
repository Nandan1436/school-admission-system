using SchoolAdmission.Services.Exceptions;

namespace SchoolAdmission.Services;

public static class StudentIdValidator
{
    public const int Length = 17;

    public static string Validate(string? studentId)
    {
        var value = studentId?.Trim();

        if (string.IsNullOrEmpty(value))
        {
            throw new ValidationException(ErrorCodes.InvalidStudentId,
                "Student birth registration number is required (X-Student-Id header).");
        }

        if (value.Length != Length || !value.All(char.IsAsciiDigit))
        {
            throw new ValidationException(ErrorCodes.InvalidStudentId,
                $"Birth registration number must be exactly {Length} digits.");
        }

        return value;
    }
}
