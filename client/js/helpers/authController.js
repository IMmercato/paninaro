import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Run `init(user)` only if logged in; otherwise redirect.
 */
export function requireAuth(init, redirectUrl = '/') {
  onAuthStateChanged(auth, user => {
    if (user) init(user);
    else window.location.href = redirectUrl;
  });
}

/**
 * If user is already logged in, send them to `redirectUrl`.
 */
export function redirectIfAuth(redirectUrl = '/Paninaro') {
  onAuthStateChanged(auth, user => {
    if (user) window.location.href = redirectUrl;
  });
}

/**
 * Sign out current user and go to `redirectUrl`.
 */
export function logout(redirectUrl = '/') {
  signOut(auth)
    .then(() => window.location.href = redirectUrl)
    .catch(err => console.error('Logout Failed', err));
}

/**
 * Sign/Login using Google Provider
 */
export async function handleGoogleSignIn(redirectUrl = '/Paninaro') {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const API_URL = process.env.API_URL;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "aplication-json" },
      body: JSON.stringify({
        uid: user.uid,
        name: name,
        email: user.email
      })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Backend failed to write user");

    window.location.href = redirectUrl;

  } catch (err) {
    console.error("Errore durante il login con Google:", err);
    alert("Login con Google fallito. Riprova.");
  }
}