const db_init = require('../db/db.js');
const db = db_init.db;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.register = (request, response) => {
    console.log(request.body);

    const { name, phone, email, password, passwordConfirm } = request.body;

    if(!name || !phone || !email || !password) {
        return response.render("register", {
            message: 'Вы должны заполнить все поля.' 
        });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return response.status(400).json({
                message: 'Эта почта уже зарегистрирована.' 
            });
        } else if(password !== passwordConfirm) {
            return response.status(400).json({
                message: 'Пароли не совпадают.' 
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', {name: name, phone: phone, email: email, password: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                return response.status(201).json({message: 'Registered successfully.'});
            }
        });
    });
}

exports.login = (request, response) => {
    console.log(request.body);
    try {
        const { email, password } = request.body;

        if(!email || !password) {
            return response.status(400).json({
                message: 'Вы должны заполнить все поля.'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if(!results || !(await bcrypt.compare(password, results[0].password))) {
                response.status(401).json({
                    message: 'Неправильный логин или пароль.'
                });
            } else {
                const id = results[0].user_id;
                const name = results[0].name;
                const phone = results[0].phone;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log(`User ${token} has logined in.`);

                const cookieOptions = {
                    expires: new Date(
                        // JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 - to convert to ms
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                response.cookie('jwt', token, cookieOptions);
                response.status(200).json({message: 'Logined successfully.'});
            }
        });
    } catch (error) {
        console.log(error);
    }
}