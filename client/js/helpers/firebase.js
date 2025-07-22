import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBOrbHqvaKesB01CNajd62X5FlNzI0KgRc",
    authDomain: "paninaro-9788d.firebaseapp.com",
    projectId: "paninaro-9788d",
    storageBucket: "paninaro-9788d.firebasestorage.app",
    messagingSenderId: "463589606739",
    appId: "1:463589606739:web:e1b7415617f9faaa790da6",
    measurementId: "G-304NM45KZP"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };