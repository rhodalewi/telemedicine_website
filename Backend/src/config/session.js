const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./database')
const dotenv = require('dotenv');

dotenv.config();

//CONFIGURE SESSION STORE
const sessionStore = new MySQLStore({}, db);

//SESSION MIDDLEWARE
const sessionMiddleware = session({
    name: 'telemedicine.sid',
    secret: process.env.SESSION_SECRET || 'default',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 240 * 60 * 1000, //4hours
        secure: true, 
    }
});

module.exports = sessionMiddleware;