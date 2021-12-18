const History = require('../models/history')
const Middleware = require('../infrastructure/auth/middleware')
const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('../models/error');
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const WebScraping = require('../models/webscraping')

module.exports = app => {

    app.get('/historial', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('history')
        } catch (err) {
            next(err)
        }
    })

    app.post('/history', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const description = req.body.description

            const history = await History.insertHistory(description, id_login)

            cachelist.delPrefix('history')

            res.status(201).json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/history', [Middleware.authenticatedMiddleware, Authorization('history', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`history:id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const system = await History.listHistoryDashboard(req.login.perfil, req.login.id_login)
            const robot = await WebScraping.listWebscrapingHistory()

            const historys = {
                system, robot
            }

            cachelist.addCache(`history:id_login:${req.login.id_login}`, JSON.stringify(historys), 60 * 30)

            res.json(historys)
        } catch (err) {
            next(err)
        }
    })

    app.get('/history/:id', [Middleware.authenticatedMiddleware, Authorization('history', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`history:${JSON.stringify(req.params)}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const history = await History.listHistoryDashboardUser(req.params.id)
            cachelist.addCache(`history:${JSON.stringify(req.params)}`, JSON.stringify(history), 60 * 30)

            res.json(history)
        } catch (err) {
            next(err)
        }
    })

    app.get('/historys', [Middleware.authenticatedMiddleware, Authorization('history', 'read')], async (req, res, next) => {
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