using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Time.Testing;
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;
using Testcontainers.PostgreSql;

namespace SchoolAdmission.Tests.TestFixtures;

public class DatabaseFixture : IAsyncLifetime
{
    public const string ConnectionStringVariable = "TEST_CONNECTION_STRING";

    private PostgreSqlContainer? _container;

    public string ConnectionString { get; private set; } = string.Empty;
    public FakeTimeProvider Clock { get; } = new(DateTimeOffset.UtcNow);
    public ApiFactory Factory { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        var external = Environment.GetEnvironmentVariable(ConnectionStringVariable);

        if (!string.IsNullOrWhiteSpace(external))
        {
            ConnectionString = external;
        }
        else
        {
            _container = new PostgreSqlBuilder("postgres:17-alpine").Build();
            await _container.StartAsync();
            ConnectionString = _container.GetConnectionString();
        }

        Factory = new ApiFactory(ConnectionString, Clock);
        _ = Factory.Server;
    }

    public ApiFactory CreateSecondInstance() => new(ConnectionString, Clock);

    public async Task ResetAsync()
    {
        using var scope = Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.ExecuteSqlRawAsync("TRUNCATE TABLE hold, class");
    }

    public async Task DisposeAsync()
    {
        await Factory.DisposeAsync();
        if (_container is not null)
        {
            await _container.DisposeAsync();
        }
    }
}

[CollectionDefinition(Name)]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
{
    public const string Name = "Database";
}
