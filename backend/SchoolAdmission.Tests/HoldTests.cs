using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Tests.TestFixtures;

namespace SchoolAdmission.Tests;

public class HoldTests(DatabaseFixture fixture) : ApiTestBase(fixture)
{
    [Fact]
    public async Task CreateHold_ReturnsHeldHoldWithExpiry()
    {
        var created = await CreateClassAsync(5);

        var response = await HoldAsync(created.Id, StudentA);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var hold = await response.Content.ReadFromJsonAsync<CreateHoldResponse>();
        Assert.Equal(created.Id, hold!.ClassId);
        Assert.Equal(StudentA, hold.StudentId);
        Assert.Equal("HELD", hold.Status);
        Assert.True(hold.ExpiresAt > Fixture.Clock.GetUtcNow().UtcDateTime.AddSeconds(590));
    }

    [Fact]
    public async Task SameStudentTwiceInOneClass_ReturnsConflict()
    {
        var created = await CreateClassAsync(5);
        await HoldAsync(created.Id, StudentA);

        var second = await HoldAsync(created.Id, StudentA);

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal("ALREADY_APPLIED", await ErrorCodeOf(second));
    }

    [Fact]
    public async Task FullClass_ReturnsConflict()
    {
        var created = await CreateClassAsync(1);
        await HoldAsync(created.Id, StudentA);

        var second = await HoldAsync(created.Id, StudentB);

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal("NO_SEATS_AVAILABLE", await ErrorCodeOf(second));
    }

    [Fact]
    public async Task ConfirmTwice_CountsSeatOnce()
    {
        var created = await CreateClassAsync(5);
        var hold = await CreateHoldAsync(created.Id, StudentA);

        var first = await ConfirmAsync(hold.HoldId, StudentA);
        var second = await ConfirmAsync(hold.HoldId, StudentA);

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);
        var body = await second.Content.ReadFromJsonAsync<ConfirmHoldResponse>();
        Assert.Equal("CONFIRMED", body!.Status);

        var result = await GetClassAsync(created.Id);
        Assert.Equal(1, result.ConfirmedSeats);
        Assert.Equal(0, result.HeldSeats);
        Assert.Equal(4, result.AvailableSeats);
    }

    [Fact]
    public async Task ExpiredHold_FreesSeatAndCannotBeConfirmed()
    {
        var created = await CreateClassAsync(1);
        var hold = await CreateHoldAsync(created.Id, StudentA);

        Fixture.Clock.Advance(TimeSpan.FromSeconds(601));

        var status = await Client.GetFromJsonAsync<HoldResponse>($"/holds/{hold.HoldId}");
        Assert.Equal("EXPIRED", status!.Status);
        Assert.Equal(1, (await GetClassAsync(created.Id)).AvailableSeats);

        var confirm = await ConfirmAsync(hold.HoldId, StudentA);
        Assert.Equal(HttpStatusCode.Conflict, confirm.StatusCode);
        Assert.Equal("HOLD_EXPIRED", await ErrorCodeOf(confirm));

        var reapply = await HoldAsync(created.Id, StudentA);
        Assert.Equal(HttpStatusCode.Created, reapply.StatusCode);
    }

    [Fact]
    public async Task OtherStudent_CannotConfirmOrCancel()
    {
        var created = await CreateClassAsync(5);
        var hold = await CreateHoldAsync(created.Id, StudentA);

        Assert.Equal(HttpStatusCode.Forbidden, (await ConfirmAsync(hold.HoldId, StudentB)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await CancelAsync(hold.HoldId, StudentB)).StatusCode);
    }

    [Fact]
    public async Task Cancel_FreesSeat()
    {
        var created = await CreateClassAsync(1);
        var hold = await CreateHoldAsync(created.Id, StudentA);

        var response = await CancelAsync(hold.HoldId, StudentA);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var status = await Client.GetFromJsonAsync<HoldResponse>($"/holds/{hold.HoldId}");
        Assert.Equal("CANCELLED", status!.Status);
        Assert.Equal(1, (await GetClassAsync(created.Id)).AvailableSeats);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("123")]
    [InlineData("2015269123456789A")]
    public async Task InvalidStudentId_ReturnsBadRequest(string? studentId)
    {
        var created = await CreateClassAsync(5);

        var response = await SendAsync(HttpMethod.Post, $"/classes/{created.Id}/holds", studentId);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("INVALID_STUDENT_ID", await ErrorCodeOf(response));
    }

    [Fact]
    public async Task MyHolds_ReturnsOnlyThisStudentsHolds()
    {
        var classA = await CreateClassAsync(5, "Class 6 - Morning Shift");
        var classB = await CreateClassAsync(5, "Class 6 - Day Shift");
        await HoldAsync(classA.Id, StudentA);
        await HoldAsync(classB.Id, StudentA);
        await HoldAsync(classA.Id, StudentB);

        var response = await SendAsync(HttpMethod.Get, "/me/holds", StudentA);
        var holds = await response.Content.ReadFromJsonAsync<List<MyHoldResponse>>();

        Assert.Equal(2, holds!.Count);
        Assert.Contains(holds, h => h.ClassName == "Class 6 – Morning Shift" && h.Status == "HELD");
        Assert.Contains(holds, h => h.ClassName == "Class 6 – Day Shift");
    }

    private async Task<CreateHoldResponse> CreateHoldAsync(Guid classId, string studentId)
    {
        var response = await HoldAsync(classId, studentId);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CreateHoldResponse>())!;
    }

    private static async Task<string?> ErrorCodeOf(HttpResponseMessage response)
    {
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return json.RootElement.TryGetProperty("code", out var code) ? code.GetString() : null;
    }
}
