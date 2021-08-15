using System.Collections.Generic;
using System.Threading.Tasks;
using Fellowship.API.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace Fellowship.API.Services
{
  public class ConsultantsService : IConsultantsService
  {
    private IMemoryCache _cache;
    private readonly IConfiguration _configuration;
    private readonly IScrapingService _scrapingService;
    public ConsultantsService(IConfiguration configuration,
                              IScrapingService scrapingService)
    {
      _configuration = configuration;
      _scrapingService = scrapingService;
    }

    public async Task<IEnumerable<Consultant>> GetConsultants()
    {
      IEnumerable<Consultant> consultants;

      var scrapeTarget = _configuration["ConsultantScraper:TargetSite"];

      if (string.IsNullOrEmpty(scrapeTarget))
      {
        throw new System.Exception("TargetSite setting is null or empty");
      }

      consultants = await _scrapingService.ScrapeSite(scrapeTarget);

      return consultants;
    }
  }
}