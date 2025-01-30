namespace CarRental.API.DTOs.ResrvationDtos
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public string? CarName { get; set; }  // Emri i makinës
        public string? CarCategory { get; set; }  // Kategoria e makinës (sedan, SUV, etj)
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
