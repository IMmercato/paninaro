let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const welcome = document.getElementById("modal");
function nextSlide() {
  if (currentSlide < slides.length - 1) {
    slides[currentSlide].classList.remove("active");
    currentSlide++;
    slides[currentSlide].classList.add("active");
  } else {
    // When reaching the last slide, hide the slides and show the final section
    document.querySelector(".slide-container").style.display = "none";
    welcome.style.display = 'block';
    setTimeout(() => {
      welcome.style.display = 'none';
      document.getElementById("final-section").classList.add("active");
    }, 3000);
    document.getElementById("accept-btn").onclick = function () {
      welcome.style.display = 'none';
      document.getElementById("final-section").classList.add("active");
    };
  }
}
window.nextSlide = nextSlide;
document.getElementById("data").addEventListener("submit", function (e) {
  e.preventDefault();
  nextSlide();
});

function initPaninaro() {
  const orderCard = document.querySelector("#order");
  const bookingCard = document.querySelector("#booking");
  const info = document.getElementById("info");
  const selectSection = document.querySelector(".select");

  const infoData = {
    order: {
      orderPerDay: "2",
      totalOrders: "20",
      completedOrders: "19",
      ongoingOrder: "1"
    },
    booking: {
      availableSeats: "50",
      totalSeats: "100",
      occupiedSeats: "50",
      avarageSeats: "30"
    }
  };

  // Handle order card click
  orderCard.addEventListener("click", () => {
    // Apply animations to cards in select section
    selectSection.querySelectorAll('.card').forEach(card => {
      if (card === orderCard) {
        card.classList.add("selected");
        card.classList.remove("fade-out");
      } else {
        card.classList.add("fade-out");
        card.classList.remove("selected");
      }
    });

    // Show info after animation
    setTimeout(() => {
      info.style.display = "flex";
      info.innerHTML = `
        <div class="card">
          <h1>${infoData.order.orderPerDay}</h1>
          <h3>Ordini/giorno</h3>
        </div>
        <div class="card">
          <h1>${infoData.order.totalOrders}</h1>
          <h3>Totale Ordini</h3>
        </div>
        <div class="card">
          <h1>${infoData.order.completedOrders}</h1>
          <h3>Ordini effettuati</h3>
        </div>
        <div class="card">
          <h1>${infoData.order.ongoingOrder}</h1>
          <h3>Ordini in Corso</h3>
        </div>
      `;
      
      // Add fade-in animation to info cards
      setTimeout(() => {
        info.querySelectorAll('.card').forEach(card => {
          card.classList.add('fade-in');
        });
      }, 50);
    }, 300);
  });

  // Handle booking card click
  bookingCard.addEventListener("click", () => {
    // Apply animations to cards in select section
    selectSection.querySelectorAll('.card').forEach(card => {
      if (card === bookingCard) {
        card.classList.add("selected");
        card.classList.remove("fade-out");
      } else {
        card.classList.add("fade-out");
        card.classList.remove("selected");
      }
    });

    // Show info after animation
    setTimeout(() => {
      info.style.display = "flex";
      info.innerHTML = `
        <div class="card">
          <h1>${infoData.booking.availableSeats}</h1>
          <h3>Posti Disponibili</h3>
        </div>
        <div class="card">
          <h1>${infoData.booking.totalSeats}</h1>
          <h3>Posti Totali</h3>
        </div>
        <div class="card">
          <h1>${infoData.booking.occupiedSeats}</h1>
          <h3>Posti Occupati</h3>
        </div>
        <div class="card">
          <h1>${infoData.booking.avarageSeats}</h1>
          <h3>Posti medi/giorno</h3>
        </div>
      `;
      
      // Add fade-in animation to info cards
      setTimeout(() => {
        info.querySelectorAll('.card').forEach(card => {
          card.classList.add('fade-in');
        });
      }, 50);
    }, 300);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPaninaro);