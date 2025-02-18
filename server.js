const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});
app.get('/Signin', async (req, res) => {
  res.sendFile(__dirname + '/client/signin.html');
});
app.get('/Login', async (req, res) => {
  res.sendFile(__dirname + '/client/login.html');
});
app.get('/Paninaro', async (req, res) => {
  res.sendFile(__dirname + '/client/paninaro.html');
});
app.get('/Order', async (req, res) => {
  res.sendFile(__dirname + '/client/ordine.html');
});
app.get('/Spese', async (req, res) => {
  res.sendFile(__dirname + '/client/spese.html');
});
app.get('/Guadagni', async (req, res) => {
  res.sendFile(__dirname + '/client/money.html');
});
app.get('/Termini&Condizioni', async (req, res) => {
  res.sendFile(__dirname + '/client/regole.html');
});
app.get('/Sitemap', async (req, res) => {
  res.sendFile(__dirname + '/client/sitemap.xml');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});