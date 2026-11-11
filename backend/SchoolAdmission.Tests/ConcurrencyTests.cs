using System.Net;
using SchoolAdmission.Tests.TestFixtures;

namespace SchoolAdmission.Tests;

public class ConcurrencyTests(DatabaseFixture fixture) : ApiTestBase(fixture)
{
    [Fact]
    public async Task ParallelHolds_NeverExceedTotalSeats()
    {
        const int seats = 10;
        const int requests = 50;
        var created = await CreateClassAsync(seats);

        var responses = await Task.WhenAll(Enumerable.Range(1, requests)
            .Select(i => HoldAsync(created.Id, StudentId(i))));

        Assert.Equal(seats, responses.Count(r => r.StatusCode == HttpStatusCode.Created));
        Assert.Equal(requests - seats, responses.Count(r => r.StatusCode == HttpStatusCode.Conflict));

        var result = await GetClassAsync(created.Id);
        Assert.Equal(seats, result.HeldSeats);
        Assert.Equal(0, result.AvailableSeats);
    }

    [Fact]
    public async Task ParallelHolds_FromTwoAppInstances_NeverExceedTotalSeats()
    {
        const int seats = 5;
        const int requests = 40;
        await using var secondInstance = Fixture.CreateSecondInstance();
        var secondClient = secondInstance.CreateClient();
        var created = await CreateClassAsync(seats);

        var responses = await Task.WhenAll(Enumerable.Range(1, requests)
            .Select(i => HoldAsync(created.Id, StudentId(i), i % 2 == 0 ? Client : secondClient)));

        Assert.Equal(seats, responses.Count(r => r.StatusCode == HttpStatusCode.Created));

        var result = await GetClassAsync(created.Id);
        Assert.Equal(seats, result.HeldSeats + result.ConfirmedSeats);
    }

    [Fact]
    public async Task ParallelHoldsBySameStudent_CreateOnlyOneHold()
    {
        var created = await CreateClassAsync(10);

        var responses = await Task.WhenAll(Enumerable.Range(1, 10)
            .Select(_ => HoldAsync(created.Id, StudentA)));

        Assert.Single(responses, r => r.StatusCode == HttpStatusCode.Created);
        Assert.Equal(1, (await GetClassAsync(created.Id)).HeldSeats);
    }
}
