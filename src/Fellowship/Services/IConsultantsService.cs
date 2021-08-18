using System.Collections.Generic;
using System.Threading.Tasks;
using Fellowship.Models;

namespace Fellowship.Services
{
  public interface IConsultantsService
  {
    Task<IEnumerable<Consultant>> GetConsultants();
  }
}