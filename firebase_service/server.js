const express = require("express");
const cors    = require("cors");
const admin   = require("firebase-admin");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  )
});

const db = admin.firestore();

/**
 * POST /api/create-owner
 * Body: { uid: string, name: string, email: string }
 */
app.post("/api/create-owner", async (req, res) => {
  const { uid, name, email } = req.body;
  
  if (!uid || !email) {
    return res.status(400).json({ error: "uid e email sono obbligatori" });
  }

  try {
    await db.doc(`owners/${uid}`).set({
      name: name || "",
      contact: email,
      restaurantIds: []
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("Errore create-owner:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡️ Server in ascolto sulla porta ${PORT}`);
});