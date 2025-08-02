const express = require('express');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(express.static('client'));
app.use(express.json());

const API_URL = process.env.API_URL;

// ===================
// ROUTES (HTML pages)
// ===================
app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'));
app.get('/Signin', (req, res) => res.sendFile(__dirname + '/client/signin.html'));
app.get('/Login', (req, res) => res.sendFile(__dirname + '/client/login.html'));
app.get('/Paninaro', (req, res) => res.sendFile(__dirname + '/client/paninaro.html'));
app.get('/Order', (req, res) => res.sendFile(__dirname + '/client/ordine.html'));
app.get('/Spese', (req, res) => res.sendFile(__dirname + '/client/spese.html'));
app.get('/Receipt', (req, res) => res.sendFile(__dirname + '/client/receipt.html'));
app.get('/Guadagni', (req, res) => res.sendFile(__dirname + '/client/money.html'));
app.get('/Termini-Condizioni', (req, res) => res.sendFile(__dirname + '/client/regole.html'));
app.get('/Privacy-Policies', (req, res) => res.sendFile(__dirname + '/client/privacy.html'));
app.get('/Sitemap', (req, res) => res.sendFile(__dirname + '/client/sitemap.xml'));

// ===================
// API: Forward owner creation
// ===================
app.post('/api/owner', async (req, res) => {
  const { uid, name, email } = req.body;

  if (!req.body || !uid || !email) {
    return res.status(400).json({ error: "uid and email are required" });
  }

  try {
    const backendResponse = await fetch(`${API_URL}/api/create-owner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, name, email })
    });

    const contentType = backendResponse.headers.get('content-type');
    const result = contentType?.includes('application/json')
      ? await backendResponse.json()
      : { error: 'Invalid response from backend' };

    return res.status(backendResponse.status).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach backend service" });
  }
});

// ===================
// 404 Fallback
// ===================
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/client/404.html');
});

// ===================
// Start Server
// ===================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});