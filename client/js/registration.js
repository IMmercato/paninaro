import { auth, db } from './helpers/firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { redirectIfAuth, handleGoogleSignIn } from './helpers/authController.js';

function initRegister() {
  const form        = document.getElementById("form");
  const nameInput   = document.getElementById("name");
  const emailInput  = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorDiv    = document.getElementById("error-message");
  const googleBtn   = document.getElementById("google-auth-btn");

  redirectIfAuth('/Paninaro');

  googleBtn.addEventListener("click", () => {
    handleGoogleSignIn();
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorDiv.textContent = '';
    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
      errorDiv.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const ownerRef = doc(db, "owners", user.uid);
      await setDoc(ownerRef, {
        name,
        contact: email,
        restaurantIds: []
      });

      window.location.href = '/Paninaro';

    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}

initRegister();