const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;