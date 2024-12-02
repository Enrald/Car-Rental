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

    // Krijo një objekt për makinën
    const car = {
        name: carName,
        price: carPrice,
        description: carDescription,
        image: carImage,
        type: carType,
    };

    // Ruaj makinën në Local Storage
    saveCarToLocalStorage(car);

    // Mesazh suksesi dhe pastrimi i formularit
    alert('Makina u shtua me sukses!');
    addCarForm.reset();
});

// Funksioni për të ruajtur makinën në Local Storage
function saveCarToLocalStorage(car) {
    let cars = JSON.parse(localStorage.getItem(carsStorageKey)) || []; // Merr array ekzistues ose krijo një të ri
    cars.push(car); // Shto makinën e re
    localStorage.setItem(carsStorageKey, JSON.stringify(cars)); // Ruaje array-n e përditësuar
}

// Forma për fshirjen e makinave
const deleteCarForm = document.getElementById('deleteCarForm');

// Funksioni për të fshirë një makinë nga Local Storage
function deleteCarByName() {
    const carName = document.getElementById('deleteCarName').value.trim(); // Merr emrin e makinës nga input-i

    // Kontroll nëse fusha është bosh
    if (!carName) {
        alert('Ju lutem, jepni një emër makine!');
        return;
    }

    // Merr listën ekzistuese nga Local Storage
    let cars = JSON.parse(localStorage.getItem(carsStorageKey)) || []; 

    // Filtron listën për të hequr makinën me këtë emër
    const updatedCars = cars.filter(car => car.name !== carName);

    if (cars.length === updatedCars.length) {
        alert(`Makina me emrin "${carName}" nuk u gjet!`);
    } else {
        // Përditëso Local Storage
        localStorage.setItem(carsStorageKey, JSON.stringify(updatedCars));
        alert(`Makina me emrin "${carName}" u fshi me sukses!`);
    }

    // Pastron input-in
    document.getElementById('deleteCarName').value = '';
}

// Event listener për formën e fshirjes
deleteCarForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Parandalon rifreskimin e faqes
    deleteCarByName(); // Thërret funksionin për të fshirë makinën
});
