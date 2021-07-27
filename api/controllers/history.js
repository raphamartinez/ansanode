const History = require('../models/history')
const Middleware = require('../infrastructure/auth/middleware')
const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('../models/error');

module.exports = app => {
    app.post('/history', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_login = req.login.id_login
            const description = req.body.description

            const history = await History.insertHistory(description, id_login)
            res.status(201).json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/history', Middleware.bearer, async ( req, res, next) => {
        try {
            const perfil = req.login.perfil
            const id_login = req.login.id_login

            const history = await History.listHistoryDashboard(perfil, id_login)
            res.json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/history/:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_login = req.params.id

            const history = await History.listHistoryDashboardUser(id_login)
            res.json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/historys', Middleware.bearer, async ( req, res, next) => {
        try {
            const perfil = req.login.perfil
            const id_login = req.login.id_login

            const history = await History.listHistory(perfil, id_login)
            res.json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/historys:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_login = req.params.id

            const history = await History.listHistoryUser(id_login)
            res.json(history)
        } catch (err) {
            next(err)
        }
    })
}