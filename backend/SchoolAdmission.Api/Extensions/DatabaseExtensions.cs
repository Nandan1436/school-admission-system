using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;

namespace SchoolAdmission.Api.Extensions;

public static class DatabaseExtensions
{
    public static string GetDatabaseConnectionString(this IConfiguration configuration) =>
        configuration.GetConnectionString("Default")
        ?? configuration["DATABASE_URL"]
        ?? throw new InvalidOperationException(
            "No database connection string. Set ConnectionStrings__Default or DATABASE_URL.");

    public static async Task MigrateDatabaseAsync(this WebApplication app, int maxAttempts = 10)
    {
        for (var attempt = 1; ; attempt++)
        {
            try
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                await db.Database.MigrateAsync();
                return;
            }
            catch (Exception ex) when (attempt < maxAttempts)
            {
                app.Logger.LogWarning(ex, "Database not ready (attempt {Attempt}/{Max}). Retrying in 3s...", attempt, maxAttempts);
                await Task.Delay(TimeSpan.FromSeconds(3));
            }
        }
    }
}
