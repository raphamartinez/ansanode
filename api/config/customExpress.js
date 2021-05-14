const express = require('express')
<<<<<<< HEAD
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy
const cors = require('cors')
const consign = require('consign')
const path = require('path');
const { InvalidArgumentError, NotFound, NotAuthorized } = require('../models/error');
const jwt = require('jsonwebtoken');

module.exports = () => {



  require('../infrastructure/redis/blocklist')
  require('../infrastructure/redis/allowlist')

  const app = express()

  app.use(cors())

  require('../infrastructure/auth/strategy')

  app.use(passport.initialize())

  // app.use((req, res, next) => {
  //   if (req.headers["x-forwarded-proto"] == "http")
  //     res.redirect(`https://${req.headers.host}${req.url}`)
  //   else {
  //     next();
  //   }
  // });

  // app.use((req, res, next) => {
  //   res.set({
  //     'Content-Type': 'application/json'
  //   })
  //   next()
  // });

const consign = require('consign')
const passport = require('passport')
const bearerStrategy = require('passport-http-bearer')
const redis = require('redis')
const path = require('path');

module.exports = () => {
  require('dotenv').config()

  // redis.createClient({ prefix: 'blocklist:' })

  const app = express()

  app.use((req, res, next) => {

    if (req.headers["x-forwarded-proto"] == "http")
      res.redirect(`https://${req.headers.host}${req.url}`)
    else {
      next();
    }

  });
>>>>>>> de55bacec8263a31fbb1ca3beb14ae1bbe34b238

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

<<<<<<< HEAD

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization')
    app.use(cors())
    next();
  });

  // Resposta Fake para o coockie X-Powered-By
  // app.use((req, res, next) => {
  //   res.setHeader('X-Powered-By', 'PHP/7.1.7')
  //   next();
  // });
=======
  // Resposta Fake para o coockie X-Powered-By
  app.use((req, res, next) => {
    res.set('X-Powered-By', 'PHP/7.1.7')
    next();
  });

  passport.use(
    new bearerStrategy(
      async (token, done) => {
        try {
          const payload = jwt.verify(token, process.env.KEY_JWT)
          const user = await User.viewUser(payload.id)
          done(null, user)
        } catch (error) {
          done(error)
        }
      })
  )
>>>>>>> de55bacec8263a31fbb1ca3beb14ae1bbe34b238

  consign({ cwd: path.join(__dirname, '../') })
    .include('models')
    .then('controllers')
    .into(app)

<<<<<<< HEAD
  app.use((error, req, res, next) => {
    let status = 500
    const body = {
      message: error.message
    }

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

    res.status(status)
    res.json(body)
  })

=======
>>>>>>> de55bacec8263a31fbb1ca3beb14ae1bbe34b238
  return app
}
