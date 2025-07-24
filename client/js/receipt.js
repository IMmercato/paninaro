import { db } from './helpers/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { requireAuth } from './helpers/authController.js';

/**
 * Renders past orders (stats) once we know the user is authenticated.
 * @param {import('firebase').User} user
 */
async function initReceipt(user) {
  try {
    const statsRef = collection(db, `users/${user.uid}/stats`);
    const snap     = await getDocs(statsRef);
    const list     = document.getElementById('ordini');
    list.innerHTML = '';  // optional: clear existing items

    snap.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.classList.add('receipt');
      li.innerHTML = `
        <h3>Order ID: ${doc.id}</h3>
        <p>Cart: ${data.cart.map(i => `${i.id} - €${i.price}`).join(', ')}</p>
        <p>Total: €${data.total}</p>
        <p>Time: ${data.time.toDate().toLocaleString()}</p>
        <p>Status: ${data.orderready ? 'Ready' : 'Not Ready'}</p>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading receipts:', err);
    document.getElementById('ordini').textContent = 'Errore nel caricare gli ordini.';
  }
}

requireAuth(initReceipt);