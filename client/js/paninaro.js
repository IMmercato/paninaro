import { db } from './helpers/firebase.js';
import {
  query,
  where,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

function initPaninaro() {
  const form   = document.getElementById('paninaro');
  const ordersDiv = document.getElementById('ordini');
  const logoutForm = document.getElementById('logoutForm');
  const dashboardBtn = document.querySelector('.dashboard');
  const containerN = document.getElementById('n');
  let unsubscribers = [];

  // Staff login form
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name     = form.name.value;
    const password = form.password.value;
    const res = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, password })
    });
    const txt = await res.text();
    if (txt === 'Invalid username or password') alert(txt);
    else window.location.href = '/Paninaro';
  });

  // Check session
  (async () => {
    const res = await fetch('/check-session');
    const { loggedIn } = await res.json();
    if (!loggedIn) return;
    form.style.display = 'none';
    ordersDiv.style.display = 'block';
    logoutForm.style.display = 'block';
    startRealtime();
  })();

  // Real-time listener
  async function startRealtime() {
    const classNames = [
      "2IE","1EA","1IA","1IB","1IC","1ID","1IE","1IF","1IG","1MA","1MB",
      "2IA","2IB","2IC","2ID","2IF","2IG","2IH","2MA","2MB",
      "3IA","3IB","3IC","3ID","3IF","3IG","3MA","3MB","3UA",
      "4IA","4IB","4IC","4ID","4IF","4MA","4MB","4UA",
      "5EA","5IB","5IA","5IC","5ID","5IE","5IF","5MA"
    ];
    const now = new Date();
    const hour = now.getHours();
    const startDate = hour < 12
      ? new Date(now.setHours(0,0,0,0))
      : new Date(now.setHours(12,30,0,0));
    const endDate = new Date(now.setHours(23,59,59,999));

    for (const cls of classNames) {
      const colRef = collection(db, `orders/${cls}/orders`);
      const q = query(
        colRef,
        where('time', '>=', Timestamp.fromDate(startDate)),
        where('time', '<=', Timestamp.fromDate(endDate))
      );
      const unsub = onSnapshot(q, snap => {
        const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                              .filter(o => !o.orderready);
        if (orders.length) renderCard(cls, orders);
      });
      unsubscribers.push(unsub);
    }
  }

  function renderCard(className, orders) {
    const card = document.createElement('div');
    card.id = 'card';
    let tot = 0;
    const itemsHTML = orders.flatMap(o =>
      Array.isArray(o.cart)
        ? o.cart.map(i => { tot += i.price; return `<p>${i.id} - €${i.price}</p>`; })
        : []
    ).join('');

    card.innerHTML = `
      <button class="toggle-button">${className}</button>
      <div class="details">
        ${itemsHTML}
        <h3>Totale: ${tot}</h3>
        <button class="confirm-delete">Confirm Delete</button>
      </div>
    `;
    containerN.appendChild(card);

    card.querySelector('.toggle-button')
        .addEventListener('click', () => card.querySelector('.details').classList.toggle('expanded'));

    card.querySelector('.confirm-delete')
        .addEventListener('click', async () => {
          if (!confirm("Are you sure?")) return;
          for (let o of orders) {
            const ref = doc(db, `orders/${className}/orders`, o.id);
            await updateDoc(ref, { orderready: true });
          }
          card.remove();
        });
  }

  dashboardBtn.addEventListener('click', () => {
    window.open('/Guadagni', '_blank');
  });

  logoutForm.addEventListener('submit', e => {
    e.preventDefault();
    unsubscribers.forEach(fn => fn());
    logoutForm.submit();
  });
}

initPaninaro();