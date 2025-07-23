# Firebase Admin Service

Microservizio Node/Express che espone un endpoint per scrivere in Firestore i dati di registrazione di un utente.

## Prerequisiti

- Node.js v16+  
- Account Firebase con Service Account key

## Setup locale

1. Clona questa repo  
2. `npm install`  
3. Crea un file `.env` (o configura su Render) con la variabile: GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "...", "project_id": "...", ...}'
4. Avvia in locale: `npm run start`

Il server risponderà su `http://localhost:3000`.

## Deploy su Render

1. Collega la repo Git a Render come **Web Service**  
2. Imposta nel pannello **Environment**:
- `GOOGLE_SERVICE_ACCOUNT_JSON` → incolla il JSON intero della tua Service Account  
- `PORT` (opzionale)
3. Build Command: `npm install`  
4. Start Command: `npm start`  
5. Ogni push su `main` scatenerà un nuovo deploy.

## Come chiamare l’endpoint

Dal client, dopo la creazione utente Firebase Auth:

```js
await fetch("https://<tuo-backend>.onrender.com/api/create-owner", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
 uid:   user.uid,
 name:  user.displayName || nomeDigitato,
 email: user.email
})
});
```