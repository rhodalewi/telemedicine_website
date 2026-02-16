const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    dateStrings: true
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MYSQL Database');
})

module.exports = db.promise();;