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
    proxy: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, //1 day
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
});

module.exports = sessionMiddleware;