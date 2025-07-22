import { auth, db } from './helpers/firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { redirectIfAuth } from './helpers/authController.js';

function initRegister() {
  const form = document.getElementById("form");
  const nameInput   = document.getElementById("name");
  const emailInput  = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const classeInput   = document.getElementById("classe");
  const errorDiv      = document.getElementById("error-message");

  // Redirect if already signed in
  redirectIfAuth('/Order')

  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorDiv.textContent = '';  // reset
    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const classe   = classeInput.value.trim();

    if (!name || !email || !password || !classe) {
      errorDiv.textContent = "Please fill in all fields.";
      return;
    }
    /*if (!email.endsWith("@itiseveripadova.edu.it")) {
      errorDiv.textContent = "Use @itiseveripadova.edu.it email.";
      return;
    }*/
    if (!confirm(`Hai selezionato la classe: ${classe}. È corretta?`)) {
      errorDiv.textContent = "Please select the correct class.";
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name, email, classe });
      window.location.href = '/Order';
    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}

initRegister();