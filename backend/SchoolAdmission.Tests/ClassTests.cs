using System.Net;
using System.Net.Http.Json;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Tests.TestFixtures;

namespace SchoolAdmission.Tests;

public class ClassTests(DatabaseFixture fixture) : ApiTestBase(fixture)
{
    [Fact]
    public async Task CreateClass_ReturnsCreatedClass()
    {
        var response = await Client.PostAsJsonAsync("/classes", new { name = "Class 6 - Morning Shift", totalSeats = 120 });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<CreateClassResponse>();
        Assert.Equal("Class 6 - Morning Shift", body!.Name);
        Assert.Equal(120, body.TotalSeats);
        Assert.NotEqual(Guid.Empty, body.Id);
    }

    [Fact]
    public async Task DuplicateName_ReturnsConflict()
    {
        await CreateClassAsync(10, "Class 7 - Day Shift");

        var response = await Client.PostAsJsonAsync("/classes", new { name = "Class 7 - Day Shift", totalSeats = 10 });

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Theory]
    [InlineData("Class 6 - Morning Shift")]
    [InlineData("Class 6 – Morning Shift")]
    [InlineData("class 10 — day shift")]
    [InlineData("  Class 1 -  Day Shift  ")]
    public async Task ValidClassName_IsAccepted(string name)
    {
        var response = await Client.PostAsJsonAsync("/classes", new { name, totalSeats = 10 });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Theory]
    [InlineData("", 10)]
    [InlineData("67", 10)]
    [InlineData("Class 8", 10)]
    [InlineData("Class 0 - Morning Shift", 10)]
    [InlineData("Class 11 - Morning Shift", 10)]
    [InlineData("Class 6 - Evening Shift", 10)]
    [InlineData("Test Class", 10)]
    [InlineData("Class 8 - Day Shift", 0)]
    [InlineData("Class 8 - Day Shift", -5)]
    public async Task InvalidClass_ReturnsBadRequest(string name, int totalSeats)
    {
        var response = await Client.PostAsJsonAsync("/classes", new { name, totalSeats });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UnknownClass_ReturnsNotFound()
    {
        var response = await Client.GetAsync($"/classes/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetClasses_ReturnsSeatCounts()
    {
        var created = await CreateClassAsync(3);
        var holdResponse = await HoldAsync(created.Id, StudentA);
        var hold = await holdResponse.Content.ReadFromJsonAsync<CreateHoldResponse>();
        await ConfirmAsync(hold!.HoldId, StudentA);
        await HoldAsync(created.Id, StudentB);

        var classes = await Client.GetFromJsonAsync<List<ClassResponse>>("/classes");

        var result = Assert.Single(classes!);
        Assert.Equal(3, result.TotalSeats);
        Assert.Equal(1, result.HeldSeats);
        Assert.Equal(1, result.ConfirmedSeats);
        Assert.Equal(1, result.AvailableSeats);
    }
}
