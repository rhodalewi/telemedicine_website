const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./database')
const dotenv = require('dotenv');

dotenv.config();

//CONFIGURE SESSION STORE
const sessionStore = new MySQLStore({}, db.promise());

//SESSION MIDDLEWARE
const sessionMiddleware = session({
    name: 'telemedicine.sid',
    secret: process.env.SESSION_SECRET || 'default',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 240 * 60 * 1000, //4hours
        secure: process.env.MODE_ENV === 'production', 
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'production' ? 'none' : 'lax'
    }
});

module.exports = sessionMiddleware;