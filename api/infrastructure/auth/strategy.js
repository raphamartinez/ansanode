const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const bcrypt = require('bcrypt')
const Login = require('../../models/login')
const Token = require('../../models/token')

const { NotAuthorized, InvalidArgumentError } = require('../../models/error')

function verifyToken(token) {
  if (token === undefined) {
    throw new NotAuthorized('Acceso no autorizado al recurso solicitado.')
  }
}

function verifyLogin(login) {
  if (!login) {
    throw new NotAuthorized('Acceso no autorizado al recurso solicitado.')
  }
}

async function verifyPassword(password, passwordHash) {
  const passwordValid = await bcrypt.compare(password, passwordHash)
  if (!passwordValid) {
    throw new NotAuthorized('Las contraseñas ingresadas no coinciden.')
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'mail',
      passwordField: 'password',
      session: false
    },
    async (mail, password, done) => {
      try {
        const login = await Login.searchMail(mail)
        verifyLogin(login.mail)
        await verifyPassword(password, login.password)
        done(null, login)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  new BearerStrategy(
    async (token, done) => {
    try {
      verifyToken(token)
      const id_login = await Token.access.verify(token)
      const login = await Login.viewLogin(id_login)
      verifyLogin(login.mail)
      done(null, login, { token })
    } catch (error) {
      done(error)
    }
  })
)



