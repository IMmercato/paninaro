const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const Redis = require('ioredis');
const connectRedis = require('connect-redis');

dotenv.config();

const RedisStore = connectRedis(session);
const redisClient = new Redis(process.env.REDIS_URL);

const app = express();
dotenv.config();
app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'porcodio',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('newOrder', (orderData) => {
        io.emit('orderUpdate', orderData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

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
app.get('/Termini-Condizioni', async (req, res) => {
    res.sendFile(__dirname + '/client/regole.html');
});
app.get('/Sitemap', async (req, res) => {
    res.sendFile(__dirname + '/client/sitemap.xml');
});
app.post('/login', (req, res) => {
    const { name, password } = req.body;
    if (name === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        console.log('Logged in');
        res.redirect('/Paninaro');
    } else {
        res.send('Invalid username or password');
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy();
    console.log('Destroyed session');
    res.redirect('/Paninaro');
});

app.get('/check-session', (req, res) => {
    if (req.session.loggedIn) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});