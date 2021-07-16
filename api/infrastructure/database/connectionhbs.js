const mysql = require('mysql2');

  connectionhbs = mysql.createConnection({
    user: process.env.DBHBS_USER,
    host: "45.232.214.13",
    database: process.env.DBHBS_NAME,
    password: process.env.DBHBS_PASSWORD,
    port: process.env.DBHBS_PORT
  })

module.exports = connectionhbs