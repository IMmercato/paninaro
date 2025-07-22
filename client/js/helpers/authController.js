import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

/**
 * Run `init(user)` only if logged in; otherwise redirect.
 * @param {function(firebase.User)} init 
 * @param {string} redirectUrl 
 */

export function requireAuth(init, redirectUrl = '/') {
    onAuthStateChanged(auth, user =>{
        if(user) init(user);
        else window.location.href = redirectUrl;
    });
}

/**
 * If user is already logged in, send them to `redirectUrl`.
 * @param {string} redirectUrl 
 */
export function redirectIfAuth(redirectUrl = '/Order') {
  onAuthStateChanged(auth, user => {
    if (user) window.location.href = redirectUrl;
  });
}

/**
 * Sign out current user and go to `redirectUrl`.
 * @param {string} redirectUrl 
 */

export function logout(redirectUrl = '/') {
    signOut(auth)
    .then(() => window.location.href = redirectUrl)
    .catch(err => console.error('Logout Failed', err))
}