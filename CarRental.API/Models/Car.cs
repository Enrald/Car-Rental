using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRental.API.Models
{
    public class Car
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }
        [Required]
        public double Price { get; set; }
        public string Description { get; set; }

        public string? Url { get; set; }
        [Required]
        public required string  Category { get; set; }

        public ICollection<Reservation> Reservations { get; set; }
    }
}
