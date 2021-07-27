const Login = require('../models/login')
const Middleware = require('../infrastructure/auth/middleware')
const History = require('../models/history')
const path = require('path')

module.exports = app => {

    app.post('/login', Middleware.local, async function ( req, res, next) {
        try {
            const id_login = req.login.id_login
            const token = await Login.generateTokens(id_login)
            const login = await Login.viewLogin(id_login)

            History.insertHistory('Acceso de usuario', id_login)
            res.json({ refreshToken: token.refreshToken, accessToken: token.accessToken, url: '../admin/dashboard.html', user: login })
        } catch (err) {
            next(err)
        }
    })

    app.post('/logout', [Middleware.refresh, Middleware.bearer], async function ( req, res, next) {
        try {
            const token = req.token
            await Login.logout(token)
            res.json({ url: '../public/login.html' })
        } catch (err) {
            next(err)
        }

    });
    


    app.all('/admin/*', Middleware.bearer, async function ( req, res, next) {
        try {
            next()
        } catch (err) {
            next(err)
        }
    })

    app.post('/insertLogin', Middleware.bearer, async function ( req, res, next) {
        try {
            const data = req.body
            await Login.insertLogin(data)
            res.sendFile('login.html', { root: path.join(__dirname, '../../views/public') });
        } catch (err) {
            next(err)
        }
    });

    app.post('/forgotPassword', async function ( req, res, next) {
        try {
            const mailenterprise = req.body.mail
            const login = await Login.forgotPassword(mailenterprise)

            History.insertHistory('Solicitud de restablecimiento de contraseña', login.id_login)

            res.json({  url: '../', message: 'Correo electrónico de restablecimiento de contraseña enviado!' })
        } catch (err) {
            next(err)
        }
    });

    app.get('/newPassword/:token', async function ( req, res, next) {
        try {
            res.render('password')
        } catch (err) {
            next(err)
        }
    });

    app.post('/resetPassword', async function ( req, res, next) {
        try {
            const token = req.body.token
            const password = req.body.password
            const id_login = await Login.changePassword(token, password)

            History.insertHistory('Contraseña alterada.', id_login)
            res.json({  url: '../', message: 'Contraseña alterada con éxito!' })
        } catch (err) {
            next(err)
        }
    });

    app.post('/refresh', Middleware.refresh, async function ( req, res, next) {
        try {
            const token = await Login.generateTokens(req.login.id_login)
            res.json({ refreshToken: token.refreshToken, accessToken: token.accessToken })
        } catch (err) {
            next(err)
        }
    });

    app.post('/changepass', Middleware.bearer, async ( req, res, next) => {
        try {
            const data = req.body.user
            const result = await Login.updatePassword(data,req.login.id_login)

            History.insertHistory('Contraseña alterada.', req.login.id_login)

            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}