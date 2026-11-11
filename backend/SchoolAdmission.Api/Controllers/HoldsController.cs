using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Api.Extensions;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("holds")]
public class HoldsController(IHoldService holdService) : ControllerBase
{
    [HttpGet("{holdId:guid}")]
    [ProducesResponseType<HoldResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid holdId, CancellationToken ct) =>
        Ok(await holdService.GetByIdAsync(holdId, ct));

    [HttpPost("{holdId:guid}/confirm")]
    [ProducesResponseType<ConfirmHoldResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Confirm(
        Guid holdId,
        [FromHeader(Name = StudentHeader.Name)] string? studentId,
        CancellationToken ct) =>
        Ok(await holdService.ConfirmAsync(holdId, studentId, ct));

    [HttpDelete("{holdId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Cancel(
        Guid holdId,
        [FromHeader(Name = StudentHeader.Name)] string? studentId,
        CancellationToken ct)
    {
        await holdService.CancelAsync(holdId, studentId, ct);
        return NoContent();
    }
}
