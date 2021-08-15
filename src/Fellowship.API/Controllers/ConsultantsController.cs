using System.Collections.Generic;
using Fellowship.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetLab.API.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class ConsultantsController : ControllerBase
  {
    [HttpGet]
    public IEnumerable<Consultant> Get()
    {
      var consultants = new List<Consultant>();
      consultants.Add(new Consultant
      {
        Name = "Leslie Nielsen",
        ImageUrl = "https://en.wikipedia.org/wiki/Leslie_Nielsen#/media/File:Leslie_Nielsen.jpg",
        Slug = "leslie-nielsen"
      });

      return consultants;
    }
  }
}
