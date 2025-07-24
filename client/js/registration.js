import { auth, db } from './helpers/firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { redirectIfAuth, handleGoogleSignIn } from './helpers/authController.js';

function initRegister() {
  const form        = document.getElementById("form");
  const nameInput   = document.getElementById("name");
  const emailInput  = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorDiv    = document.getElementById("error-message");
  const googleBtn   = document.getElementById("google-auth-btn");
  let popupInProgress = false;

  redirectIfAuth('/Paninaro');

  googleBtn.addEventListener("click", () => {
    if (popupInProgress) return;
    popupInProgress = true;
    handleGoogleSignIn();
    popupInProgress = false;
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
      
      const res = await fetch('/api/owner', {
        method: "POST",
        headers: { "Content-Type": "application-json" },
        body: JSON.stringify({
          uid: user.uid,
          name: name,
          email: user.email
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Backend failed to write user");

      window.location.href = '/Paninaro';

    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}

initRegister();