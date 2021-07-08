const Login = require('../models/login')
const Middleware = require('../infrastructure/auth/middleware')
const History = require('../models/history')
const path = require('path')

module.exports = app => {

    app.post('/login', Middleware.local, async function (req, res, next) {
        try {
            const id_login = req.login.id_login
            const token = await Login.generateTokens(id_login)
            const login = await Login.viewLogin(id_login)

            History.insertHistory('Acceso de usuario', id_login)
            res.status(200).json({ refreshToken: token.refreshToken, accessToken: token.accessToken, url: '../admin/dashboard.html', user: login })
        } catch (error) {
            next(error)
        }
    })

    app.post('/logout', [Middleware.refresh, Middleware.bearer], async function (req, res, next) {
        try {
            const token = req.token
            await Login.logout(token)
            res.status(200).json({ url: '../public/login.html' })
        } catch (error) {
            next(error)
        }

    });
    


    app.all('/admin/*', Middleware.bearer, async function (req, res, next) {
        try {
            next()
        } catch (error) {
            next(error)
        }
    })

    app.post('/insertLogin', Middleware.bearer, async function (req, res, next) {
        try {
            const data = req.body
            await Login.insertLogin(data)
            res.sendFile('login.html', { root: path.join(__dirname, '../../views/public') });
        } catch (error) {
            next(error)
        }

    });

    app.post('/forgotPassword', async function (req, res) {
        try {
            const mail = req.body.mail
            await Login.forgotPassword(mail)
            res.redirect('/login');
        } catch (err) {
            next(error)
        }
    });

    app.post('/resetPassword', async function (req, res, next) {
        try {
            const token = req.body.token
            const password = req.body.password
            const result = await Login.changePassword(token, password)
            res.send({ message: result })
        } catch (error) {
            next(error)
        }
    });

    app.post('/refresh', Middleware.refresh, async function (req, res, next) {
        try {
            const token = await Login.generateTokens(req.login.id_login)
            res.status(200).json({ refreshToken: token.refreshToken, accessToken: token.accessToken })
        } catch (error) {
            next(error)
        }
    });

    app.post('/changepass', Middleware.bearer, async (req, res, next) => {
        try {
            const data = req.body.user
            const id_login = req.login.id_login
            const result = await Login.updatePassword(data,id_login)
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    })
}