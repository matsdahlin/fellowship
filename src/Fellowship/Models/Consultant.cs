using System.ComponentModel.DataAnnotations;

namespace Fellowship.Models
{
  public class Consultant
  {
    [Required]
    public string Name { get; set; }
    [Required]
    public string Location { get; set; }
    [Required]
    public string Slug { get; set; }
    public string ImageUrl { get; set; }

    override public string ToString()
    {
      return $"{this.Name} - {this.Location} ({this.Slug})";
    }
  }
}
