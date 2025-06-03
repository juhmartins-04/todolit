const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  port: 3307,
  user: "root",
  password: "123456",
  database: "todolist",
});


db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;