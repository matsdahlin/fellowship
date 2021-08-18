using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AngleSharp.Dom;
using AngleSharp.Html.Parser;
using Fellowship.Models;

namespace Fellowship.Services
{
  public class ScrapingService : IScrapingService
  {
    private HtmlParser parser = new HtmlParser();
    private IHttpClientFactory _httpClientFactory;
    public ScrapingService(IHttpClientFactory httpClientFactory)
    {
      _httpClientFactory = httpClientFactory;
    }

    public async Task<IEnumerable<Consultant>> ScrapeSite(string scrapeTargetUrl)
    {

      var client = _httpClientFactory.CreateClient();
      var response = await client.GetAsync(scrapeTargetUrl);

      if (!response.IsSuccessStatusCode)
      {
        throw new Exception("Could not scrape target site");
      }

      var responseText = await response.Content.ReadAsStringAsync();

      var parsed = parser.ParseDocument(responseText);
      var ninjas = parsed.QuerySelectorAll(".ninja-summary");
      var output = ninjas.Select(MapToConsultant).ToArray();

      return output;
    }

    static Consultant MapToConsultant(IElement consultantElement)
    {
      var slug = consultantElement.QuerySelector("h1 > a").Attributes["href"].Value;
      var name = consultantElement.QuerySelector("h1 > a").FirstChild.TextContent;
      var location = consultantElement.QuerySelector("h1 > a > span").TextContent;
      var imageUrl = consultantElement.QuerySelector("a > img").Attributes["src"].Value;

      return new Consultant
      {
        Slug = slug,
        Name = name,
        Location = location,
        ImageUrl = imageUrl
      };
    }
  }
}
