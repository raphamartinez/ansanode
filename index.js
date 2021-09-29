require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const express = require('express')
const path = require('path')
const { job, jobHbs, jobMail, jobGoalLine, jobReceivable } = require('./api/models/job')
const { InvalidArgumentError, NotFound, NotAuthorized, InternalServerError } = require('./api/models/error');
// const logger = require('./api/logger/pino')
const jwt = require('jsonwebtoken');
// const connection = require('./api/infrastructure/database/connection')
// const tables = require('./api/infrastructure/database/tables')
// const Survey = require('./api/models/surveymonkey')
// const GoalLine = require('./api/models/goalline')

process.setMaxListeners(100)
const app = customExpress()

app.set('views', [path.join(__dirname, 'views/public'), path.join(__dirname, 'views/admin')])
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.listen(3000, () => {
  logger.info('Server Started')

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
});

app.use((error, req, res, next) => {
  let status = 500
  const body = {
    message: 'Hubo un problema al realizar la operación. Intenta más tarde'
  }
  logger.error(error)

  if (error instanceof NotFound) {
    status = 404
    body.dateExp = error.dateExp
  }

  if (error instanceof NotAuthorized) {
    status = 401
    body.dateExp = error.dateExp
  }

  if (error instanceof InvalidArgumentError) {
    status = 400
  }

  if (error instanceof jwt.JsonWebTokenError) {
    status = 401
  }

  if (error instanceof jwt.TokenExpiredError) {
    status = 401
    body.dateExp = error.dateExp
  }


  // logger.error({status, body})

  res.status(status)
  res.json(body)
})

// Survey.ListResponse()

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