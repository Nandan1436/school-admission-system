using System.Net.Http.Json;
using SchoolAdmission.Services.Dtos;

namespace SchoolAdmission.Tests.TestFixtures;

[Collection(DatabaseCollection.Name)]
public abstract class ApiTestBase(DatabaseFixture fixture) : IAsyncLifetime
{
    protected const string StudentA = "20152691234567890";
    protected const string StudentB = "20152691234567891";

    protected DatabaseFixture Fixture { get; } = fixture;
    protected HttpClient Client { get; } = fixture.Factory.CreateClient();

    public Task InitializeAsync() => Fixture.ResetAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    protected static string StudentId(int n) => (20150000000000000L + n).ToString();

    protected async Task<CreateClassResponse> CreateClassAsync(int totalSeats, string? name = null, HttpClient? client = null)
    {
        var response = await (client ?? Client).PostAsJsonAsync("/classes",
            new { name = name ?? $"Class {Guid.NewGuid():N}", totalSeats });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CreateClassResponse>())!;
    }

    protected Task<HttpResponseMessage> HoldAsync(Guid classId, string studentId, HttpClient? client = null) =>
        SendAsync(HttpMethod.Post, $"/classes/{classId}/holds", studentId, client);

    protected Task<HttpResponseMessage> ConfirmAsync(Guid holdId, string studentId) =>
        SendAsync(HttpMethod.Post, $"/holds/{holdId}/confirm", studentId);

    protected Task<HttpResponseMessage> CancelAsync(Guid holdId, string studentId) =>
        SendAsync(HttpMethod.Delete, $"/holds/{holdId}", studentId);

    protected async Task<ClassResponse> GetClassAsync(Guid classId) =>
        (await Client.GetFromJsonAsync<ClassResponse>($"/classes/{classId}"))!;

    protected Task<HttpResponseMessage> SendAsync(HttpMethod method, string url, string? studentId, HttpClient? client = null)
    {
        var request = new HttpRequestMessage(method, url);
        if (studentId is not null)
        {
            request.Headers.Add("X-Student-Id", studentId);
        }

        return (client ?? Client).SendAsync(request);
    }
}
