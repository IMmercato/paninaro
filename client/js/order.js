import { db } from './helpers/firebase.js';
import {
  doc,
  getDoc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { requireAuth, logout } from './helpers/authController.js';

function initOrder(user) {
  // Food data and cart
  const foodList = [
    { id: 1, name: "Pizza", price: 15.99 },
    { id: 2, name: "Burger", price: 10.99 },
    { id: 3, name: "Sandwich", price: 8.99 },
    { id: 4, name: "Salad", price: 7.99 },
    { id: 5, name: "Fries", price: 4.99 },
  ];
  let cart = [];

  // Build UI
  const container = document.querySelector(".food-container");
  foodList.forEach(food => {
    const card = document.createElement("div");
    card.classList.add("food-card");
    card.innerHTML = `
        <h3>${food.name}</h3>
        <p>Price: €${food.price}</p>
        <button class="add-to-cart-btn"   data-id="${food.id}">Add to Cart</button>
        <button class="remove-from-cart-btn" data-id="${food.id}" style="display:none;">Remove</button>
      `;
    container.appendChild(card);
  });

  // Helpers
  function updateCartDisplay() {
    const list = document.getElementById("cart-list");
    const totalEl = document.getElementById("total-price");
    list.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      list.innerHTML += `<li>${item.name} — €${item.price}</li>`;
      total += item.price;
    });
    totalEl.textContent = `Total Price: €${total.toFixed(2)}`;
    return total;
  }

  // Button wiring
  container.addEventListener("click", e => {
    const id = parseInt(e.target.dataset.id);
    const food = foodList.find(f => f.id === id);
    if (!food) return;

    if (e.target.classList.contains("add-to-cart-btn")) {
      cart.push(food);
      e.target.style.display = "none";
      e.target.nextElementSibling.style.display = "inline-block";
    } else if (e.target.classList.contains("remove-from-cart-btn")) {
      cart = cart.filter(f => f.id !== id);
      e.target.style.display = "none";
      e.target.previousElementSibling.style.display = "inline-block";
    }
    updateCartDisplay();
  });

  // Checkout modal
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length) document.getElementById("modal").style.display = "block";
    else alert("Your cart is empty!");
  });

  document.getElementById("decline-btn").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
  });

  document.getElementById("accept-btn").addEventListener("click", async () => {
    document.getElementById("modal").style.display = "none";
    const totalPrice = updateCartDisplay();
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const classe = userDoc.data().classe;
    const ordersRef = collection(doc(db, "orders", classe), "orders");
    const statsRef = collection(doc(db, "users", user.uid), "stats");
    const now = new Date();

    try {
      await addDoc(ordersRef, { cart, total: totalPrice, time: now, orderready: false });
      await addDoc(statsRef, { cart, total: totalPrice, time: now });
      alert("Order placed successfully!");
      cart = [];
      updateCartDisplay();
    } catch (err) {
      alert("Error placing order. Please try again.");
    }
  });

  // Logout
  document.getElementById("logout").addEventListener("click", () => {
    logout('/')
  });
}

requireAuth(initOrder);