const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const http = require('http');

const app = express();
app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

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
app.get('/Receipt', async (req, res) => {
    res.sendFile(__dirname + '/client/receipt.html');
});
app.get('/Guadagni', async (req, res) => {
    res.sendFile(__dirname + '/client/money.html');
});
app.get('/Termini-Condizioni', async (req, res) => {
    res.sendFile(__dirname + '/client/regole.html');
});
app.get('/Privacy-Policies', async (req, res) => {
    res.sendFile(__dirname + '/client/privacy.html');
});
app.get('/Sitemap', async (req, res) => {
    res.sendFile(__dirname + '/client/sitemap.xml');
});

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/client/404.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});