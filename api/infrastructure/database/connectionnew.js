const mysql = require('mysql2');

const connectionnew = mysql.createConnection({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
})

module.exports = connectionnew

