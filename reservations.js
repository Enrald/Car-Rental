function loadReservations() {
  const carsList = document.getElementById("carsList");
  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  reservations.forEach((reservation, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${reservation.name}</td>
      <td>${reservation.date}</td>
      <td><button class="btn btn-danger" onclick="cancelReservation('${reservation.name}')">Cancel</button></td>
    `;
    carsList.appendChild(row);
  });
}

// Funksioni për të anuluar rezervimin
function cancelReservation(carName) {
  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  const updatedReservations = reservations.filter(reservation => reservation.name !== carName);

  // Përditëso Local Storage
  localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  localStorage.removeItem(carName);

  // Rifresko faqen
  location.reload();
}

// Ngarko rezervimet kur hapet faqja
loadReservations();