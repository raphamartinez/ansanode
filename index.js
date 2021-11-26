require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')
const { job, jobHbs, jobMail, jobGoalLine, jobReceivable, jobInterview } = require('./api/models/job')
const { InvalidArgumentError, NotFound, NotAuthorized, InternalServerError } = require('./api/models/error');
// const Hbs = require('./api/models/hbs')
// const Web = require('./api/models/webscraping')
// Web.listProsegurOffice()

process.setMaxListeners(100)
const app = customExpress()

app.set('views', [path.join(__dirname, 'views/public'), path.join(__dirname, 'views/admin'), path.join(__dirname, 'views/quiz')])
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
    jobInterview.start()
  }
});

app.use((err, req, res, next) => {
  console.log(err);

  let status = 500
  let body = {
    msg: 'Hubo un problema al realizar la operación. Intenta más tarde'
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

// const su = require('./api/models/patrimony');
// su.ListResponseFirst()

// const Clock = require('./api/models/clockmachine')
// Clock.listClockMachineHbs()

// Hbs.listReceivables()
