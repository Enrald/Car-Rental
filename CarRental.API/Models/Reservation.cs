using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRental.API.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }
        [Required]
        public DateOnly EndDate { get; set; }

        [Required]
        public int CarId { get; set; }

        // Foreign key relationship
        [ForeignKey(nameof(CarId))]
        public Car Car { get; set; }
    }
}
