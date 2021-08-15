using System.Collections.Generic;
using System.Threading.Tasks;
using Fellowship.API.Models;

namespace Fellowship.API.Services
{
  public interface IScrapingService
  {
    Task<IEnumerable<Consultant>> ScrapeSite(string url);
  }
}
