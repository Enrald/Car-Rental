// Kontejnerët ku do të shfaqen kartat
const sedanContainer = document.getElementById('sedanContainer');
const suvContainer = document.getElementById('suvContainer');

// Ngarko kartat nga Local Storage kur faqja hapet
window.onload = function () {
  loadCarsFromLocalStorage();
};

// Funksioni për të ngarkuar kartat nga Local Storage
function loadCarsFromLocalStorage() {
  const cars = JSON.parse(localStorage.getItem('cars')) || []; // Merr makinat nga Local Storage
  if (cars.length === 0) {
    sedanContainer.innerHTML = '<p>Nuk ka makina të kategorisë Sedan!</p>';
    suvContainer.innerHTML = '<p>Nuk ka makina të kategorisë SUV!</p>';
    return;
  }

  // Shfaq çdo makinë në kategorinë përkatëse
  cars.forEach(car => {
    createCard(car); // Krijo kartën për secilën makinë
  });
}

// Funksioni për të krijuar një kartë dinamike
function createCard(car) {
  // HTML i kartës
  const cardHTML = `
    <div class="card m-3" style="width: 18rem;">
      <img src="${car.image}" class="card-img-top" alt="${car.name}" style="height: 150px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${car.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${car.price} €</h6>
        <p class="card-text">${car.description}</p>
        <button class="btn btn-primary" id="reserve-${car.name}">Rezervo</button>
      </div>
    </div>
  `;

  // Shto kartën në konteinerin përkatës
  if (car.type === "Sedan") {
    sedanContainer.innerHTML += cardHTML;
  } else if (car.type === "SUV") {
    suvContainer.innerHTML += cardHTML;
  }

  const button = document.getElementById(`reserve-${car.name}`);
  const savedState = localStorage.getItem(car.name); // Kontrollo nëse është ruajtur statusi

  // Kontrollo nëse makina është e rezervuar dhe përditëso butonin
  if (savedState === "reserved") {
    button.textContent = "U rezervua";
    button.disabled = true;
  }

  // Shto event listener për rezervimin
  button.addEventListener("click", function () {
    reserveCar(car.name); // Funksioni që rezervon makinën
  });
}

// Funksioni për të rezervuar makinën
function reserveCar(carName) {
  // Gjej butonin që shkaktoi eventin
  const button = event.target;

  // Kontrollo nëse butoni ka tekstin "Rezervo"
  if (button.textContent === "Rezervo") {
    // Ndrysho tekstin dhe çaktivizo butonin
    button.textContent = "U rezervua";
    button.disabled = true;

    // Ruaj statusin e makinës si "reserved"
    localStorage.setItem(carName, "reserved");

    // Merr listën e rezervimeve nga Local Storage ose krijo një të re
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    // Shto rezervimin e ri
    const date = new Date().toLocaleDateString(); // Data e sotme
    reservations.push({ name: carName, date });

    // Ruaj rezervimet e përditësuara në Local Storage
    localStorage.setItem("reservations", JSON.stringify(reservations));

    // (Opsionale) Shfaq një mesazh në console
    console.log(`Makina ${carName} u rezervua më ${date}!`);
  }
}
