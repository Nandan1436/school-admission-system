using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Services.Dtos;
using SchoolAdmission.Services.Interfaces;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("class-options")]
public class ClassOptionsController(IClassOptionsService classOptionsService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<ClassOptionsResponse>(StatusCodes.Status200OK)]
    public IActionResult Get() => Ok(classOptionsService.Get());
}
