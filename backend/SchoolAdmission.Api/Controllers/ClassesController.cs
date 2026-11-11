using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Api.Extensions;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("classes")]
public class ClassesController(IClassService classService, IHoldService holdService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<CreateClassResponse>(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(CreateClassRequest request, CancellationToken ct)
    {
        var created = await classService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { classId = created.Id }, created);
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<ClassResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await classService.GetAllAsync(ct));

    [HttpGet("{classId:guid}")]
    [ProducesResponseType<ClassResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid classId, CancellationToken ct) =>
        Ok(await classService.GetByIdAsync(classId, ct));

    [HttpPost("{classId:guid}/holds")]
    [ProducesResponseType<CreateHoldResponse>(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateHold(
        Guid classId,
        [FromHeader(Name = StudentHeader.Name)] string? studentId,
        CancellationToken ct)
    {
        var hold = await holdService.CreateAsync(classId, studentId, ct);
        return CreatedAtAction(nameof(HoldsController.GetById), "Holds", new { holdId = hold.HoldId }, hold);
    }
}
