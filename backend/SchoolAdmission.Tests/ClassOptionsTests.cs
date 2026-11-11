using System.Net.Http.Json;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Tests.TestFixtures;

namespace SchoolAdmission.Tests;

public class ClassOptionsTests(DatabaseFixture fixture) : ApiTestBase(fixture)
{
    [Fact]
    public async Task GetClassOptions_ReturnsGradesAndShifts()
    {
        var options = await Client.GetFromJsonAsync<ClassOptionsResponse>("/class-options");

        Assert.Equal(10, options!.Grades.Count);
        Assert.Equal("Class 1", options.Grades[0]);
        Assert.Equal("Class 10", options.Grades[^1]);
        Assert.Equal(["Morning Shift", "Day Shift"], options.Shifts);
    }
}
