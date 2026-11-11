using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Api.Workers;

public class HoldExpiryWorker(IServiceScopeFactory scopeFactory, ILogger<HoldExpiryWorker> logger) : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromSeconds(30);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(Interval);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var holdService = scope.ServiceProvider.GetRequiredService<IHoldService>();
                var expired = await holdService.ExpireStaleHoldsAsync(stoppingToken);

                if (expired > 0)
                {
                    logger.LogInformation("Marked {Count} holds as expired", expired);
                }
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "Hold expiry sweep failed");
            }
        }
    }
}
