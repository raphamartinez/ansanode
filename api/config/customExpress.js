const express = require('express')
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy
const cors = require('cors')
const consign = require('consign')
const path = require('path');
const jwt = require('jsonwebtoken');
const Login = require('../models/login')
// const logger = require('../logger/pino')
// const pinoHttp = require('pino-http')({ logger })

module.exports = () => {

  require('../infrastructure/redis/blocklist')
  require('../infrastructure/redis/allowlist')

  const app = express()

  app.use(cors())

  // app.use(pinoHttp)

  require('../infrastructure/auth/strategy')

  app.use(passport.initialize())

  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] == "http")
      res.redirect(`https://${req.headers.host}${req.url}`)
    else {
      next();
    }
  })

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(express.static(__dirname + '/public'))
  app.use(express.static(__dirname + '/views'))
  app.use(cors())


  app.use((req, res, next) => {
    res.set('X-Powered-By', 'PHP/7.1.7');
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization')
    next();
  });

  passport.use(
    new BearerStrategy(
      async (token, done) => {
        try {
          const payload = jwt.verify(token, process.env.KEY_JWT)
          const login = await Login.viewLogin(payload.id)
          done(null, login, { token })
        } catch (error) {
          done(error)
        }
      })
  )

  consign({ cwd: path.join(__dirname, '../') })
    .include('models')
    .then('controllers')
    .into(app)


  return app
}
