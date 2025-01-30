using CarRental.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Data
{
    public class CarService
    {
        private readonly AppDbContext _context;

        public CarService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Car>> GetAllCarsAsync()
        {
            return await _context.Cars.ToListAsync();
        }

        public async Task<Car?> GetCarByIdAsync(int id)
        {
            return await _context.Cars.FindAsync(id);

        }

        public async Task<Car> CreateCarAsync(Car car)
        {

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return car;
        }

        public async Task<bool> UpdateCarAsync(int id,Car carToUpdate)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
                return false;

            car.Price = carToUpdate.Price;
            car.Category = carToUpdate.Category;
            car.Description = carToUpdate.Description;
            car.Name = carToUpdate.Name;
            car.Url = carToUpdate.Url;

            _context.Cars.Update(car);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<string> DeleteCarAsync(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
                return "Car does not exist.";

            var currentDate = DateOnly.FromDateTime(DateTime.UtcNow);

            bool hasActiveReservations = await _context.Reservations
                .AnyAsync(r => r.CarId == id &&
                               r.StartDate <= currentDate &&
                               r.EndDate >= currentDate);

            if (hasActiveReservations)
                return "Cannot delete the car because it has active reservations.";

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return "Car deleted successfully.";
        }

    }
}
