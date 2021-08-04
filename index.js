require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const connection = require('./api/infrastructure/database/connection')
const tables = require('./api/infrastructure/database/tables')
const WebScraping = require('./api/models/webscraping')
const express = require('express')
const Hbs = require('./api/models/hbs')
const CronJob = require('cron').CronJob
const path = require('path')
const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('./api/models/error');
const jwt = require('jsonwebtoken');

process.setMaxListeners(100)

const app = customExpress()

app.set('views', [path.join(__dirname, 'views/public'), path.join(__dirname, 'views/admin')])
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')



app.listen(3000, () => {
  console.log('Server Running!!!');
  app.use(express.static(__dirname + '/public'))
  app.use(express.static(__dirname + '/views'))
  app.use(express.static(__dirname + '/tmp'))

  app.all('/', function (req, res) {
    res.render('login');
  });

  if (process.env.NODE_ENV !== 'developer') {

    const job = new CronJob('0 0 * * * *', () => {
      try {
        console.log('Executed Cron sucessfuly!');
        WebScraping.init()
      } catch (error) {
        console.log('Error cron!');
      }
    });

    job.start()

    const jobHbs = new CronJob('0 30 5 * * *', () => {
      try {
        console.log('Executed Cron Hbs sucessfuly!');
        Hbs.init()
      } catch (error) {
        console.log('Error cron!');
      }
    });

    jobHbs.start()

  }
})
Hbs.init()

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
