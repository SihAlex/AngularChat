const dotenv = require("dotenv");
dotenv.config({
    path: './env/.env'
});

const mysql = require("mysql");

const DATABASE = process.env.DATABASE;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE
}

db_init = () => {
    db = mysql.createPool(dbConfig);
    return db;
}

exports.db = db_init();
