using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Api.Extensions;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("me")]
public class MeController(IHoldService holdService) : ControllerBase
{
    [HttpGet("holds")]
    [ProducesResponseType<IReadOnlyList<MyHoldResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyHolds(
        [FromHeader(Name = StudentHeader.Name)] string? studentId,
        CancellationToken ct) =>
        Ok(await holdService.GetByStudentAsync(studentId, ct));
}
