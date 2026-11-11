using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Api.Extensions;
using SchoolAdmission.Api.Middleware;
using SchoolAdmission.Api.Workers;
using SchoolAdmission.Data;
using SchoolAdmission.Services;
using SchoolAdmission.Services.Exceptions;
using SchoolAdmission.Services.Options;

var builder = WebApplication.CreateBuilder(args);

var holdDurationSeconds = builder.Configuration.GetValue("HOLD_DURATION_SECONDS", HoldOptions.DefaultDurationSeconds);
var corsOrigins = (builder.Configuration["CORS_ORIGINS"] ?? "http://localhost:5173,http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddData(builder.Configuration.GetDatabaseConnectionString());
builder.Services.AddServices(holdDurationSeconds);

builder.Services.AddControllers();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var problem = new ValidationProblemDetails(context.ModelState)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Invalid request",
            Detail = "The request body is missing or has invalid values."
        };
        problem.Extensions["code"] = ErrorCodes.InvalidRequest;
        return new BadRequestObjectResult(problem);
    };
});

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<AppExceptionHandler>();
builder.Services.AddHostedService<HoldExpiryWorker>();
builder.Services.AddOpenApi();

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins(corsOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

await app.MigrateDatabaseAsync();
app.Run();

public partial class Program;
