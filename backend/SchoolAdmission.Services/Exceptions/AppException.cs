namespace SchoolAdmission.Services.Exceptions;

public abstract class AppException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}

public class ValidationException(string code, string message) : AppException(code, message);

public class NotFoundException(string code, string message) : AppException(code, message);

public class ForbiddenException(string code, string message) : AppException(code, message);

public class ConflictException(string code, string message) : AppException(code, message);
