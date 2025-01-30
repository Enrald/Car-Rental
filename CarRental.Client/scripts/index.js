const sedanContainer = document.getElementById("sedanContainer");
const suvContainer = document.getElementById("suvContainer");



window.onload = function () {
  loadCarsFromLocalStorage();
};

function loadCarsFromLocalStorage() {
  $.ajax({
    url: "https://localhost:7235/GetCars",
    method: "GET",
    success: function (cars) {
      if (!Array.isArray(cars) || cars.length === 0) {
        sedanContainer.innerHTML = '<p>Nuk ka makina të kategorisë Sedan!</p>';
        suvContainer.innerHTML = '<p>Nuk ka makina të kategorisë SUV!</p>';
        return;
      }

      cars.forEach(car => {
        if (!car.category || !car.name || !car.price || !car.url) {
          console.error("Invalid car data:", car);
          return;
        }
        createCard(car);
      });
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function createCard(car) {
  const cardHTML = `
    <div class="card m-3" style="width: 18rem;">
      <img src="${car.url}" class="card-img-top" alt="${car.name}" style="height: 150px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${car.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${car.price} €</h6>
        <p class="card-text">${car.description}</p>
        <div class="d-flex flex-wrap gap-2">
          <input 
            type="date" 
            class="form-control form-control-sm" 
            id="start-date-${car.name}" 
            placeholder="Nga">
          <input 
            type="date" 
            class="form-control form-control-sm" 
            id="end-date-${car.name}" 
            placeholder="Deri">
          <button class="btn btn-primary btn-sm" id="reserve-${car.name}">Rezervo</button>
        </div>
      </div>
    </div>
  `;
  

  if (car.category === "Sedan") {
    sedanContainer.innerHTML += cardHTML;
  } else if (car.category === "SUV") {
    suvContainer.innerHTML += cardHTML;
  }

  const button = document.getElementById(`reserve-${car.name}`);
  console.log("Created button for car:", car.name, button);

  const savedState = localStorage.getItem(car.name);

  if (savedState === "reserved") {
    button.textContent = "U rezervua";
    button.disabled = true;
  }

  button.addEventListener("click", function (event) {
    console.log("Button clicked for car:", car.name); 
    reserveCar(car, event);
  });
}

function reserveCar(car, event) {
  const button = event.target; // Merr butonin që u klikua
  const startDateInput = document.getElementById(`start-date-${car.name}`);
  const endDateInput = document.getElementById(`end-date-${car.name}`);

  if (!startDateInput || !endDateInput) {
    console.error("Inputet e datave nuk janë të disponueshme.");
    alert("Ka ndodhur një problem, provoni përsëri.");
    return;
  }

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    alert("Ju lutemi plotësoni të dyja datat për rezervim!");
    return;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    alert("Data 'Deri' duhet të jetë pas datës 'Nga'!");
    return;
  }

  // Thirr API-n për krijimin e rezervimit
  $.ajax({
    url: "https://localhost:7235/api/Reservations/CreateReservation",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      carId: car.id, // Përdor ID-n e makinës nga objekti `car`
      startDate: startDate,
      endDate: endDate
    }),
    success: function (response) {
      button.textContent = "U rezervua";
      button.disabled = true;
      console.log(`Makina ${car.name} u rezervua nga ${startDate} deri më ${endDate}!`);
    },
    error: function (error) {
      console.error("Ka ndodhur një gabim gjatë krijimit të rezervimit: ", error);
      alert("Makina nuk mund të rezervohet. Kontrolloni datat ose provoni më vonë.");
    }
  });
}
