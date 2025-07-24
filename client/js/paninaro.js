import { db } from './helpers/firebase.js';
import {
  query,
  where,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
        document.getElementById("accept-btn").onclick = function() {
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
  const cards = document.querySelectorAll(".card");
  cards.forEach(selectedCard => {
    selectedCard.addEventListener("click", () => {
      cards.forEach(card => {
        if (card === selectedCard) {
          card.classList.add("selected");
        } else {
          card.classList.add("fade-out");
        }
      });

      setTimeout(() => {
        selectedCard.classList.add("fade-in");
      }, 600);
    });
  });
}
initPaninaro();