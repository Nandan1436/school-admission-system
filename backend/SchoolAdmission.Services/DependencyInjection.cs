using Microsoft.Extensions.DependencyInjection;
using SchoolAdmission.Services.Interfaces;
using SchoolAdmission.Services.Options;

namespace SchoolAdmission.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddServices(this IServiceCollection services, int holdDurationSeconds)
    {
        services.Configure<HoldOptions>(options => options.DurationSeconds = holdDurationSeconds);
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<IClassService, ClassService>();
        services.AddScoped<IHoldService, HoldService>();

        return services;
    }
}
