using System.Collections.Generic;
using System.Threading.Tasks;
using Fellowship.API.Models;

namespace Fellowship.API.Services
{
  public interface IConsultantsService
  {
    Task<IEnumerable<Consultant>> GetConsultants();
  }
}