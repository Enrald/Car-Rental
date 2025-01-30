function loadReservations() {
  const carsList = document.getElementById("carsList");

  $.ajax({
    url: "https://localhost:7235/api/Reservations/GetAllReservations",
    method: "GET",
    contentType: "application/json",
    success: function (reservations) {
      if (!Array.isArray(reservations) || reservations.length === 0) {
        carsList.innerHTML = '<tr><td colspan="4">Nuk ka rezervime të disponueshme!</td></tr>';
        return;
      }

      carsList.innerHTML = ''; // Pastron listën

      reservations.forEach((reservation, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${reservation.id}</td>
          <td>${reservation.carName}</td>
          <td>${reservation.carCategory}</td>
          <td id="date-${reservation.id}">${reservation.startDate} - ${reservation.endDate}</td>
          <td>
            <button class="btn btn-danger" onclick="cancelReservation(${reservation.id})">Anulo</button>
            <button class="btn btn-primary" style="background-color: yellow; color: black;" onclick="showUpdateForm(${reservation.id})">Ndrysho</button>
          </td>
        `;
        carsList.appendChild(row);
      });
    },
    error: function (error) {
      console.error("Gabim gjatë ngarkimit të rezervimeve: ", error);
    }
  });
}

function showUpdateForm(reservationId) {
  // Shfaq formën e ndryshimit të datës
  const row = document.getElementById(`date-${reservationId}`);
  const dates = row.innerText.split(' - ');
  const startDate = dates[0];
  const endDate = dates[1];

  // Krijoni modalin ose formularin për editim
  const formHtml = `
    <div id="updateForm" class="modal" style="display: block;">
      <div class="modal-content">
        <span class="close" onclick="closeUpdateForm()">&times;</span>
        <h3>Ndrysho Datat e Rezervimit</h3>
        <label for="startDate">Data e Fillimit</label>
        <input type="date" id="startDate" value="${startDate}" required>
        <label for="endDate">Data e Mbarimit</label>
        <input type="date" id="endDate" value="${endDate}" required>
        <button class="btn btn-primary" onclick="updateReservation(${reservationId})">Ruaj</button>
      </div>
    </div>
  `;
  document.body.innerHTML += formHtml;
}

function closeUpdateForm() {
  // Mbyll formën e editimit
  const form = document.getElementById("updateForm");
  form.remove();
}

function updateReservation(reservationId) {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Ju lutemi plotësoni të dy datat.");
    return;
  }

  const reservationDto = {
    id: reservationId,
    startDate: startDate,
    endDate: endDate,
  };

  $.ajax({
    url: `https://localhost:7235/api/Reservations/UpdateReservation?id=${reservationId}`,
    method: "PUT", // Përdor PUT për përditësim
    contentType: "application/json",
    data: JSON.stringify(reservationDto),
    success: function () {
      alert("Rezervimi u përditësua me sukses!");
      loadReservations(); // Rifresko listën pas përditësimit
      closeUpdateForm(); // Mbyll formularin
    },
    error: function (error) {
      console.error("Gabim gjatë përditësimit të rezervimit: ", error);
    }
  });
}

function cancelReservation(reservationId) {
  $.ajax({
    url: `https://localhost:7235/api/Reservations/DeleteReservation?id=${reservationId}`,
    method: "DELETE",
    success: function () {
      alert("Rezervimi u anulua me sukses!");
      loadReservations(); // Rifresko listën pas anulimit
    },
    error: function (error) {
      console.error("Gabim gjatë anulimit të rezervimit: ", error);
    }
  });
}

// Ngarko rezervimet kur faqja hapet
loadReservations();
