const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

const db_init = require('./db/db.js');
const db = db_init.db;

const publicDirectory = path.join(__dirname, './public');

const FRONT_PORT = process.env.FRONT_PORT;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `http://localhost:${FRONT_PORT}`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`)
        next();
    }
});

app.use(express.static(publicDirectory));
app.use(express.static(path.join(publicDirectory, 'images')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    console.log('GET');
    res.send('hello world');
});
app.get('/auth/login', require('./routes/auth'));

dotenv.config({
    path: './env/.env'
});

db.getConnection( (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("MySQL connected...");
    }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
     console.log(`Server started on port ${PORT}`)
});
