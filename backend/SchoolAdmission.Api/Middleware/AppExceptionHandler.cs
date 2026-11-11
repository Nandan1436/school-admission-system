using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Services.Exceptions;

namespace SchoolAdmission.Api.Middleware;

public class AppExceptionHandler(IProblemDetailsService problemDetailsService, ILogger<AppExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken ct)
    {
        var (status, code, title, detail) = exception switch
        {
            ValidationException e => (StatusCodes.Status400BadRequest, e.Code, "Invalid request", e.Message),
            NotFoundException e => (StatusCodes.Status404NotFound, e.Code, "Not found", e.Message),
            ForbiddenException e => (StatusCodes.Status403Forbidden, e.Code, "Forbidden", e.Message),
            ConflictException e => (StatusCodes.Status409Conflict, e.Code, "Conflict", e.Message),
            _ => (StatusCodes.Status500InternalServerError, "SERVER_ERROR", "Server error",
                "Something went wrong on the server. Please try again.")
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Unhandled exception");
        }

        httpContext.Response.StatusCode = status;

        var problem = new ProblemDetails { Status = status, Title = title, Detail = detail };
        problem.Extensions["code"] = code;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problem,
            Exception = exception
        });
    }
}
