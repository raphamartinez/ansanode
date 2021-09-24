const History = require('../models/history')
const Middleware = require('../infrastructure/auth/middleware')
const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('../models/error');
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {
    app.post('/history', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const description = req.body.description

            const history = await History.insertHistory(description, id_login)
            res.status(201).json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/history', [Middleware.bearer, Authorization('history', 'read')], async (req, res, next) => {
        try {
            const perfil = req.login.perfil
            const id_login = req.login.id_login

            const history = await History.listHistoryDashboard(perfil, id_login)
            res.json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/history/:id', [Middleware.bearer, Authorization('history', 'read')], async (req, res, next) => {
        try {
            const id_login = req.params.id

            const history = await History.listHistoryDashboardUser(id_login)
            res.json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/historys', [Middleware.bearer, Authorization('history', 'read')], async (req, res, next) => {
        try {

            let historys
            if (req.access.all.allowed) {
                historys = await History.list()
            }else{
                const id_login = req.login.id_login
                historys = await History.list(id_login)
            }
            res.json(historys)
        } catch (err) {
            next(err)
        }
    })
}