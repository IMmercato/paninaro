import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, setDoc, updateDoc, deleteDoc, collection, doc, getDocs, query, serverTimestamp, where } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBOrbHqvaKesB01CNajd62X5FlNzI0KgRc",
    authDomain: "paninaro-9788d.firebaseapp.com",
    projectId: "paninaro-9788d",
    storageBucket: "paninaro-9788d.firebasestorage.app",
    messagingSenderId: "463589606739",
    appId: "1:463589606739:web:e1b7415617f9faaa790da6",
    measurementId: "G-304NM45KZP"
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const registerForm = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const classeInput = document.getElementById("classe");
const errorMessageDiv = document.getElementById("error-message");

// Add event listener to the form
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get the input values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const classe = classeInput.value.trim();

    // Validate the input values
    if (!name || !email || !password || !classe) {
        errorMessageDiv.textContent = "Please fill in all fields.";
        return;
    }

    // Check if the email is a specific type (e.g., @example.com)
    if (!email.endsWith("@itiseveripadova.edu.it")) {
        errorMessageDiv.textContent = "Please use an @itiseveripadova.edu.it email address.";
        return;
    }

    // Register the user with Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User registered successfully:", user);

            // Save the user's data to Firestore
            const userRef = doc(db, "users", user.uid);
            setDoc(userRef, {
                name: name,
                email: email,
                classe: classe,
            })
                .then(() => {
                    console.log("User data saved to Firestore successfully.");
                })
                .catch((error) => {
                    console.error("Error saving user data to Firestore:", error);
                });
            window.location.href= '/Order';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error registering user:", errorCode, errorMessage);
            errorMessageDiv.textContent = errorMessage;
        });
});