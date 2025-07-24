# Firebase Admin Service

A Node/Express microservice that exposes an endpoint to write user registration data to Firestore.

## 🔧 Prerequisites

- Node.js v16 or higher  
- Firebase account with a Service Account key

## 🧪 Local Setup

1. Clone this repository  
2. Run `npm install`  
3. Create a `.env` file (or configure it directly on Render) with the following variable:  
   ```
   GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "...", "project_id": "...", ...}'
   ```
4. Start the server locally:  
   ```
   npm run start
   ```

The server will respond at `http://localhost:3000`.

## 🚀 Deploying to Render

1. Connect your Git repository to [Render](https://render.com) as a **Web Service**  
2. In the **Environment** panel, add:
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: paste the full JSON of your Firebase Service Account  
   - `PORT` (optional)
3. Set the build command:
   ```
   npm install
   ```
4. Set the start command:
   ```
   npm start
   ```
5. Every push to the `main` branch will trigger a new deployment.

## 📮 How to Call the Endpoint

From your client-side code, after creating the user with Firebase Auth:

```js
await fetch("https://<your-backend>.onrender.com/api/create-owner", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uid:   user.uid,
    name:  user.displayName || typedName,
    email: user.email
  })
});
```
