import { db } from './helpers/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { requireAuth } from './helpers/authController.js';

/**
 * Fetches total spending for the authenticated user
 * @param {firebase.User} user
 */
async function initSpending(user) {
  try {
    let total = 0;
    const statsRef = collection(db, `users/${user.uid}/stats`);
    const snap     = await getDocs(statsRef);

    snap.forEach(doc => {
      const data = doc.data();
      if (data.total) {
        total += data.total;
      }
    });
    
    const el = document.getElementById('lose');
    el.textContent = `Spese totali: €${total.toFixed(2)}`;
  } catch (err) {
    console.error('Error fetching spending stats:', err);
    document.getElementById('lose').textContent = 'Errore nel caricare le spese.';
  }
}

requireAuth(initSpending);