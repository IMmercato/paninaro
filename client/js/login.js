import { auth } from './helpers/firebase.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';
import { handleGoogleSignIn } from './helpers/authController.js';

function initLogin() {
  const form = document.getElementById("form");
  const emailInput    = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const googleBtn     = document.getElementById("google-auth-btn");
  const errorDiv      = document.getElementById("error-message");

  googleBtn.addEventListener("click", () => {
    handleGoogleSignIn();
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      errorDiv.textContent = "Please fill in all fields.";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/Order";
    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}

initLogin();