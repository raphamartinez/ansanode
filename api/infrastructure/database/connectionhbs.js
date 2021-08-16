const mysql = require('mysql2');

  connectionhbs = mysql.createConnection({
    user: 'dblectura',
    host: '10.0.0.21',
    database: 'ansa',
    password: 'Dblec#2020',
    port: 3306
  })
  
module.exports = connectionhbs