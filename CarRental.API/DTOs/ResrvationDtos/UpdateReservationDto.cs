namespace CarRental.API.DTOs.ResrvationDtos
{
    public class UpdateReservationDto
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
