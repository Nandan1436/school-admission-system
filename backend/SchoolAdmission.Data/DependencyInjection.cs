using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SchoolAdmission.Data.Repositories;
using SchoolAdmission.Data.Repositories.Interfaces;

namespace SchoolAdmission.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddData(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options => options
            .UseNpgsql(ConnectionStringParser.Normalize(connectionString))
            .UseSnakeCaseNamingConvention());

        services.AddScoped<IClassRepository, ClassRepository>();
        services.AddScoped<IHoldRepository, HoldRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
