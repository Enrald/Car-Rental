// Çelësi për të ruajtur makinat në Local Storage
const carsStorageKey = 'cars';

// Forma për shtimin e makinave
const addCarForm = document.getElementById('carForm');

// Event listener për shtimin e makinave
addCarForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Parandalon rifreskimin e faqes

    // Merr të dhënat nga formulari
    const carName = document.getElementById('addCarName').value.trim();
    const carPrice = document.getElementById('addCarPrice').value.trim();
    const carDescription = document.getElementById('addCarDescription').value.trim();
    const carImage = document.getElementById('addCarImage').value.trim();
    const carType = document.querySelector('input[name="carType"]:checked').value;

    // Kontroll nëse fusha është bosh
    if (!carName || !carPrice || !carDescription || !carImage) {
        alert('Ju lutem, plotësoni të gjitha fushat!');
        return;
    }

    // Krijo një objekt për makin
    const car = {
        name: carName,
        price: carPrice,
        description: carDescription,
        image: carImage,
        type: carType,
    };

    // Ruaj makinën në Local Storage
    // saveCarToLocalStorage(car);

    $.ajax({
        url: "https://localhost:7235/CreateCar",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ name: carName,price: carPrice,description:carDescription,url: carImage,category:carType }),
        success: function (response) {
            window.location.href = "index.html";
          addCarForm.reset();
        },
        error: function (error) {
          console.error(error);
        },
      });
    

    // Mesazh suksesi dhe pastrimi i formularit
    
});

// Funksioni për të ruajtur makinën në Local Storage
// function saveCarToLocalStorage(car) {
//     let cars = JSON.parse(localStorage.getItem(carsStorageKey)) || []; // Merr array ekzistues ose krijo një të ri
//     cars.push(car); // Shto makinën e re
//     localStorage.setItem(carsStorageKey, JSON.stringify(cars)); // Ruaje array-n e përditësuar
// }

// Forma për fshirjen e makinave
const deleteCarForm = document.getElementById('deleteCarForm');

// Funksioni për të fshirë një makinë nga Local Storage
function deleteCarByName() {
    const id = document.getElementById('deleteCarName').value.trim(); // Merr emrin e makinës nga input-i

    // Kontroll nëse fusha është bosh
    if (!id) {
        alert('Ju lutem, jepni një ID makine!');
        return;
    }
    
        // Call API EndPoint to delete an airline
        $.ajax({
          url: `https://localhost:7235/DeleteCarById?carId=${id}`,
          method: "DELETE",
          success: function (response) {
            alert("Makina u fshi me sukses");
          },
          error: function (error) {
            console.error(error);
          },
        });
    
    // Merr listën ekzistuese nga Local Storage
    // let cars = JSON.parse(localStorage.getItem(carsStorageKey)) || []; 

    // // Filtron listën për të hequr makinën me këtë emër
    // const updatedCars = cars.filter(car => car.name !== carName);

    // if (cars.length === updatedCars.length) {
    //     alert(`Makina me emrin "${carName}" nuk u gjet!`);
    // } else {
    //     // Përditëso Local Storage
    //     localStorage.setItem(carsStorageKey, JSON.stringify(updatedCars));
    //     alert(`Makina me emrin "${carName}" u fshi me sukses!`);
    // }

    // // Pastron input-in
    // document.getElementById('deleteCarName').value = '';
}

// Event listener për formën e fshirjes
deleteCarForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Parandalon rifreskimin e faqes
    deleteCarByName(); // Thërret funksionin për të fshirë makinën
});

$.ajax({
  url: "https://localhost:7235/GetCars",
  method: "GET",
  success: function (cars) {
      const carsList = document.getElementById("carsList");  // Get the tbody element

      // Clear the existing table rows before adding new data
      carsList.innerHTML = "";

      // Check if the response contains valid data
      if (!Array.isArray(cars) || cars.length === 0) {
          // Display a message if no cars are available
          carsList.innerHTML = '<tr><td colspan="2">No cars available</td></tr>';
          return;
      }

      // Loop through the cars data and insert rows into the table
      cars.forEach(car => {
          if (!car.id || !car.name) {
              console.error("Invalid car data:", car);
              return;
          }

          // Create a new row with the car id and name
          const row = document.createElement("tr");

          // Create the ID cell
          const idCell = document.createElement("td");
          idCell.textContent = car.id; // Set the ID of the car
          row.appendChild(idCell);

          // Create the Name cell
          const nameCell = document.createElement("td");
          nameCell.textContent = car.name; // Set the name of the car
          row.appendChild(nameCell);

          // Append the row to the table body
          carsList.appendChild(row);
      });
  },
  error: function (error) {
      console.error(error);
  },
});
