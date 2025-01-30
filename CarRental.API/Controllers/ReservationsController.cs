using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CarRental.API.Data;
using CarRental.API.Models;
using CarRental.API.DTOs.ResrvationDtos;

namespace CarRental.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationService _reservationService;

        public ReservationsController(ReservationService reservationService)
        {
            this._reservationService = reservationService;
        }

        // Metoda për të marrë të gjitha rezervimet
        [HttpGet("GetAllReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);  // Kthimi i të gjitha rezervimeve
        }

        // Metoda për të marrë një rezervim sipas ID-së
        [HttpGet("GetReservationById")]
        public async Task<IActionResult> GetReservationById(int id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);

            if (reservation == null)
                return NotFound();

            return Ok(reservation);  // Kthimi i rezervimit të kërkuar
        }

        // Metoda për të fshirë një rezervim
        [HttpDelete("DeleteReservation")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var isDeleted = await _reservationService.DeleteReservationAsync(id);

            if (!isDeleted)
                return NotFound("The reservation does not exist.");

            return Ok();  // Rezervimi është fshirë me sukses
        }

        // Metoda për të përditësuar një rezervim
        [HttpPut("UpdateReservation")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] UpdateReservationDto reservationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var isUpdated = await _reservationService.UpdateReservationAsync(id, reservationDto);

            if (!isUpdated)
                return BadRequest("The reservation conflicts with another reservation or does not exist.");

            return Ok();  // Rezervimi është përditësuar me sukses
        }

        // Metoda për të krijuar një rezervim të ri
        [HttpPost("CreateReservation")]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto reservationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var isCreated = await _reservationService.CreateReservationAsync(reservationDto);

            if (!isCreated)
                return BadRequest("The car is already reserved during the specified time.");

            return CreatedAtAction(nameof(GetReservationById), new { id = reservationDto.CarId }, reservationDto);  // Rezervimi është krijuar
        }
    }
}





//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using CarRental.API.Data;
//using CarRental.API.Models;
//using CarRental.API.DTOs.ResrvationDtos;

//namespace CarRental.API.Controllers
//{
//    public class ReservationsController : Controller
//    {

//        private ReservationService _reservationService;
//        public ReservationsController(ReservationService reservationService)
//        {
//            this._reservationService = reservationService;
//        }

//        [HttpGet("GetAllReservations", Name = "GetAllReservations")]
//        public async Task<IActionResult> GetAllReservations()
//        {
//            var reservations = await _reservationService.GetAllReservationsAsync();
//            return Ok(reservations);
//        }

//        [HttpGet("GetReservationById", Name = "GetReservationById")]
//        public async Task<IActionResult> GetReservationById(int id)
//        {
//            var reservation = await _reservationService.GetReservationByIdAsync(id);

//            if (reservation == null)
//                return NotFound();

//            return Ok(reservation);
//        }


//        [HttpDelete("DeleteReservation", Name = "DeleteReservation")]
//        public async Task<IActionResult> DeleteReservation(int id)
//        {
//            var isDeleted = await _reservationService.DeleteReservationAsync(id);

//            if (!isDeleted)
//                return NotFound("The reservation does not exist.");

//            return Ok();
//        }

//        [HttpPut("UpdateReservation", Name = "UpdateReservation")]
//        public async Task<IActionResult> UpdateReservation(int id, [FromBody] UpdateReservationDto reservationDto)
//        {

//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            var isUpdated = await _reservationService.UpdateReservationAsync(id, reservationDto);

//            if (!isUpdated)
//                return BadRequest("The reservation conflicts with another reservation or does not exist.");

//            return Ok();
//        }

//        [HttpPost("CreateReservation", Name = "CreateReservation")]
//        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto reservationDto)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);


//            var isCreated = await _reservationService.CreateReservationAsync(reservationDto);

//            if (!isCreated)
//                return BadRequest("The car is already reserved during the specified time.");

//            return Created();
//        }





//    }
//}
