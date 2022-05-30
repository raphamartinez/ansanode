const mysql = require('mysql2');

const connectionhbs = mysql.createConnection({
  user: process.env.DBHBS_USER,
  host: process.env.DBHBS_HOST,
  database: process.env.DBHBS_NAME,
  password: "Dblec#2020",
  port: process.env.DBHBS_PORT
})

module.exports = connectionhbs