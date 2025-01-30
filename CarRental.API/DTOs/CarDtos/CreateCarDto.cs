namespace CarRental.API.DTOs.CarDtos
{
    public class CreateCarDto
    {
        public required string Name { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public string? Url { get; set; }
        public required string Category { get; set; }
    }
}
