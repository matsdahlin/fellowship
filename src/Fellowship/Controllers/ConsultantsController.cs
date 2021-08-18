using System.Collections.Generic;
using System.Threading.Tasks;
using Fellowship.Services;
using Fellowship.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Fellowship.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class ConsultantsController : ControllerBase
  {

    private readonly IConfiguration _configuration;
    private readonly IConsultantsService _consultantsService;

    public ConsultantsController(IConsultantsService service)
    {
      _consultantsService = service;
    }

    [HttpGet]
    public async Task<IEnumerable<Consultant>> Get()
    {
      var consultants = await _consultantsService.GetConsultants();

      return consultants;
    }
  }
}
