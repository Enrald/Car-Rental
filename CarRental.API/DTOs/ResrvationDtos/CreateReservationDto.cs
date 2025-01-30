namespace CarRental.API.DTOs.ResrvationDtos
{
    public class CreateReservationDto
    {
        public int CarId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
