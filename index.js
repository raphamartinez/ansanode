require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken');
const Job = require('./api/models/job')
const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('./api/models/error');

const connection = require('./api/infrastructure/database/connection')
const tables = require('./api/infrastructure/database/tables')
const Goal = require('./api/models/goalline');
const Surveymonkey = require('./api/models/surveymonkey')



process.setMaxListeners(100)
const app = customExpress()

app.set('views', [path.join(__dirname, 'views/public'), path.join(__dirname, 'views/admin')])
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.listen(3000, () => {

  app.use(express.static(__dirname + '/public'))
  app.use(express.static(__dirname + '/views'))
  app.use(express.static(__dirname + '/tmp'))

  app.get('/', function (req, res) {
    res.render('login');
  });

  if (process.env.NODE_ENV !== 'developer') {
    Job.execute()
  }

})


app.use((err, req, res, next) => {

  let status = 500
  const body = {
    message: err.message
  }

  if (err instanceof NotFound) {
    status = 404
    body.dateExp = err.dateExp
  }

  if (err instanceof NotAuthorized) {
    status = 401
    body.dateExp = err.dateExp
  }

  if (err instanceof InvalidArgumentError) {
    status = 400
  }

  if (err instanceof jwt.JsonWebTokenError) {
    status = 401
  }

  if (err instanceof jwt.TokenExpiredError) {
    status = 401
    body.dateExp = err.dateExp
  }

  res.status(status)
  res.json(body)
  
})

// Surveymonkey.ListResponse()

// Mailpowerbi.listMailtoSend()
// WebScraping.init()
// Hbs.init()
// WebScraping.meta()

// const dates = [
//   '2021-08-01',
//   '2021-09-01',
//   '2021-10-01',
//   '2021-11-01',
//   '2021-12-01',
//   '2022-01-01',
// ]

// for (let index = 0; index < dates.length; index++) {
//   const date = dates[index];
//   Goal.create(date)
// }

