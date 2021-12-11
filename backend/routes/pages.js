const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config({
    path: './env/.env'
});

router.get('/', (request, response) => {
    let token = null;
    let decoded = {}
    if(token = getToken(request)) {
        decoded = getDecoded(token);
    }
    response.render('index', {
        user: decoded.name || null
    });
    console.log("Accessing the Home Page");
})

router.get("/register", (request, response) => {
    response.render("register");
    console.log("Accessing the Register Page");
});

router.get("/login", (request, response) => {
    response.render("login");
    console.log("Accessing the Login Page");
});

router.get("/logout", (request, response) => {
    response
        .clearCookie("jwt")
        .render("index");
    console.log("Logout");
    response.status(200).redirect('/');
});

router.get("/products", (request, response) => {
    response.render("products");
    console.log("Accessing the Products Page");
})

router.get("/profile", (request, response) => {
    let token = null;
    let decoded = {}
    if(token = getToken(request)) {
        decoded = getDecoded(token);

    response.render("profile", {
        user: decoded.name || null,
        phone: decoded.phone || null,
        email: decoded.email || null
    });
    console.log("Accessing the Profile Page");
    } else {
        response.redirect("/login");
    }
})

router.get("/cart", (request, response) => {
    let token = null;
    let decoded = {}
    if(token = getToken(request)) {
        decoded = getDecoded(token);

    response.render("cart");
    console.log("Accessing the Cart Page");
    } else {
        response.redirect("/login");
    }
})

router.get("/orders", (request, response) => {
    let token = null;
    let decoded = {}
    if(token = getToken(request)) {
        decoded = getDecoded(token);

    response.render("orders");
    console.log("Accessing the Orders Page");
    } else {
        response.redirect("/login");
    }
})

function getToken(request) {
    let token = null;
    if(request && request.cookies && request.cookies.jwt) {
        token = request.cookies['jwt'];
    }
    return token;
}

function getDecoded(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = router;