using System.Collections.Generic;
using System.Threading.Tasks;
using Fellowship.Models;

namespace Fellowship.Services
{
  public interface IScrapingService
  {
    Task<IEnumerable<Consultant>> ScrapeSite(string url);
  }
}
