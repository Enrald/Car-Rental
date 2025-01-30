using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CarRental.API.Data;
using CarRental.API.Models;
using CarRental.API.DTOs.CarDtos;

namespace CarRental.API.Controllers
{
    public class CarsController : Controller
    {

        private CarService _carService;
        public CarsController(CarService carService)
        {
            this._carService = carService;
        }

        // GET: Cars
        [HttpGet("GetCars", Name = "GetCars")]
        public async Task<IActionResult> GetCars()
        {
            var cars = await _carService.GetAllCarsAsync();
            return Ok(cars);
        }

        // GET: Cars/Details/5
        [HttpGet("GetCarsById", Name = "GetCarsById")]
        public async Task<IActionResult> GetCarsById(int id)
        {
           
            var car = await _carService.GetCarByIdAsync(id);
            return Ok(car);

        }
        [HttpDelete("DeleteCarById", Name = "DeleteCarById")]
        public async Task<IActionResult> DeleteCarById(int carId)
        {
            var message = await _carService.DeleteCarAsync(carId);

            if (message == "Car deleted successfully.")
                return Ok(new { message });

            return BadRequest(new { message }); // Send error message if deletion isn't possible
        }


        [HttpPut("UpdateCarById", Name = "UpdateCarById")]
        public async Task<IActionResult> UpdateCarById(int carId, [FromBody] UpdateCarDto payload)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (carId != payload.Id)
                return BadRequest("The car id is not valid");

            var updatedCar = new Car()
            {
                Id = payload.Id,
                Name = payload.Name,
                Category = payload.Category,
                Description = payload.Description,
                Price = payload.Price,
                Url = payload.Url,
                
            };

            var res = await _carService.UpdateCarAsync(carId, updatedCar);

            if (!res)
                return NotFound();

            return Ok(updatedCar);
        }

        [HttpPost("CreateCar", Name = "CreateCar")]
        public async Task<IActionResult> CreateCar([FromBody] CreateCarDto payload)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //Create new airline object
            var newCar = new Car
            {
                Name = payload.Name,
                Category = payload.Category,
                Description = payload.Description,
                Price = payload.Price,
                Url = payload.Url,
            };

            var res = await _carService.CreateCarAsync(newCar);


            return Created();
        }
    }
}
