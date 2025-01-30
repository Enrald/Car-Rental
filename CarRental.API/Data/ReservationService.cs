using CarRental.API.DTOs.ResrvationDtos;
using CarRental.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Data
{
    public class ReservationService
    {
        private readonly AppDbContext _context;

        public ReservationService(AppDbContext context)
        {
            _context = context;
        }

        // Metoda për të marrë të gjitha rezervimet
        public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync()
        {
            return await _context.Reservations
                .Include(r => r.Car)  // Përfshijmë makinën e lidhur me rezervimin
                .Select(r => new ReservationDto
                {
                    Id = r.Id,
                    CarId = r.CarId,
                    CarName = r.Car.Name,  // Marrim emrin e makinës
                    CarCategory = r.Car.Category,  // Kategoria e makinës
                    StartDate = r.StartDate,
                    EndDate = r.EndDate
                })
                .ToListAsync();
        }

        // Metoda për të marrë një rezervim sipas ID-së
        public async Task<ReservationDto> GetReservationByIdAsync(int id)
        {
            var reservation = await _context.Reservations
                    .Include(r => r.Car)  // Përfshijmë makinën e lidhur me rezervimin
                    .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
                return null;

            return new ReservationDto
            {
                Id = reservation.Id,
                CarId = reservation.CarId,
                CarName = reservation.Car.Name,  // Marrim emrin e makinës
                CarCategory = reservation.Car.Category,  // Kategoria e makinës
                StartDate = reservation.StartDate,
                EndDate = reservation.EndDate
            };
        }

        // Metoda për të krijuar një rezervim të ri
        public async Task<bool> CreateReservationAsync(CreateReservationDto reservationDto)
        {
            var car = await _context.Cars.FindAsync(reservationDto.CarId);
            if (car == null)
            {
                throw new ArgumentException("The CarId does not exist");
            }

            // Validimi i datave
            if (reservationDto.StartDate > reservationDto.EndDate)
                throw new ArgumentException("StartDate cannot be later than EndDate");

            // Kontrollo për rezervime të mbivendosura
            bool hasConflict = await _context.Reservations
                .AnyAsync(r => r.CarId == reservationDto.CarId &&
                               r.StartDate <= reservationDto.EndDate &&
                               r.EndDate >= reservationDto.StartDate);

            if (hasConflict)
                return false;

            var reservation = new Reservation
            {
                CarId = reservationDto.CarId,
                StartDate = reservationDto.StartDate,
                EndDate = reservationDto.EndDate
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return true;
        }

        // Metoda për të përditësuar një rezervim ekzistues
        public async Task<bool> UpdateReservationAsync(int id, UpdateReservationDto reservationDto)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
                return false;

            // Validimi i datave
            if (reservationDto.StartDate > reservationDto.EndDate)
                throw new ArgumentException("StartDate cannot be later than EndDate");

            // Kontrollo për rezervime të mbivendosura (përveç rezervimit aktual)
            bool hasConflict = await _context.Reservations
                .AnyAsync(r => r.CarId == reservation.CarId &&
                               r.Id != id &&
                               r.StartDate <= reservationDto.EndDate &&
                               r.EndDate >= reservationDto.StartDate);

            if (hasConflict)
                return false;

            reservation.StartDate = reservationDto.StartDate;
            reservation.EndDate = reservationDto.EndDate;

            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }

        // Metoda për të fshirë një rezervim
        public async Task<bool> DeleteReservationAsync(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
                return false;

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}





//using CarRental.API.DTOs.ResrvationDtos;
//using CarRental.API.Models;
//using Microsoft.EntityFrameworkCore;

//namespace CarRental.API.Data
//{
//    public class ReservationService
//    {
//        private readonly AppDbContext _context;

//        public ReservationService(AppDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync()
//        {
//            return await _context.Reservations
//            .Include(r => r.Car)  // Include the related Car entity
//            .Select(r => new ReservationDto
//            {
//                Id = r.Id,
//                CarId = r.CarId,
//                CarCategory = r.Car.Category,  // Retrieve car model (name)
//                StartDate = r.StartDate,
//                EndDate = r.EndDate
//            })
//            .ToListAsync();
//        }

//        public async Task<ReservationDto> GetReservationByIdAsync(int id)
//        {
//            var reservation = await _context.Reservations
//                    .Include(r => r.Car)  // Include the related Car entity
//                    .FirstOrDefaultAsync(r => r.Id == id);

//            if (reservation == null)
//                return null;

//            return new ReservationDto
//            {
//                Id = reservation.Id,
//                CarId = reservation.CarId,
//                CarCategory = reservation.Car.Category,  // Retrieve car model (name)
//                StartDate = reservation.StartDate,
//                EndDate = reservation.EndDate
//            };
//        }

//        public async Task<bool> CreateReservationAsync(CreateReservationDto reservationDto)
//        {

//            var car = await _context.Cars.FindAsync(reservationDto.CarId);
//            if (car == null)
//            {
//                throw new ArgumentException("The CarId does not exist");
//            }
//            // Validate date ranges
//            if (reservationDto.StartDate > reservationDto.EndDate)
//                throw new ArgumentException("StartDate cannot be later than EndDate");

//            // Check for overlapping reservations
//            bool hasConflict = await _context.Reservations
//                .AnyAsync(r => r.CarId == reservationDto.CarId &&
//                               r.StartDate <= reservationDto.EndDate &&
//                               r.EndDate >= reservationDto.StartDate);

//            if (hasConflict)
//                return false;

//            var reservation = new Reservation
//            {
//                CarId = reservationDto.CarId,
//                StartDate = reservationDto.StartDate,
//                EndDate = reservationDto.EndDate
//            };

//            _context.Reservations.Add(reservation);
//            await _context.SaveChangesAsync();

//            return true;
//        }

//        public async Task<bool> UpdateReservationAsync(int id, UpdateReservationDto reservationDto)
//        {
//            var reservation = await _context.Reservations.FindAsync(id);

//            if (reservation == null)
//                return false;

//            // Validate date ranges
//            if (reservationDto.StartDate > reservationDto.EndDate)
//                throw new ArgumentException("StartDate cannot be later than EndDate");

//            // Check for overlapping reservations (excluding the current reservation)
//            bool hasConflict = await _context.Reservations
//                .AnyAsync(r => r.CarId == reservation.CarId &&
//                               r.Id != id &&
//                               r.StartDate <= reservationDto.EndDate &&
//                               r.EndDate >= reservationDto.StartDate);

//            if (hasConflict)
//                return false;

//            reservation.StartDate = reservationDto.StartDate;
//            reservation.EndDate = reservationDto.EndDate;

//            _context.Entry(reservation).State = EntityState.Modified;
//            await _context.SaveChangesAsync();

//            return true;
//        }

//        public async Task<bool> DeleteReservationAsync(int id)
//        {
//            var reservation = await _context.Reservations.FindAsync(id);

//            if (reservation == null)
//                return false;

//            _context.Reservations.Remove(reservation);
//            await _context.SaveChangesAsync();

//            return true;
//        }
//    }
//}
