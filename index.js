require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken');
const { job, jobHbs, jobMail, jobGoalLine, jobReceivable } = require('./api/models/job')
const { InvalidArgumentError, NotFound, NotAuthorized } = require('./api/models/error');

// const connection = require('./api/infrastructure/database/connection')
// const tables = require('./api/infrastructure/database/tables')
// const Web = require('./api/models/webscraping')
// const GoalLine = require('./api/models/goalline')


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
    jobMail.start()
    job.start()
    jobHbs.start()
    jobGoalLine.start()
    jobReceivable.start()
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
//ok
// Hbs.listReceivables()
// Surveymonkey.ListResponse()

// Mailpowerbi.listMailtoSend()
// WebScraping.init()
// Hbs.init()
// WebScraping.meta()

// const dates = [
//   '2022-03-01',
//   '2022-04-01',
//   '2022-05-01',
//   '2022-06-01',
//   '2022-07-01',
// ]

// for (let index = 0; index < dates.length; index++) {
//   const date = dates[index];
//   GoalLine.create(date)
// }