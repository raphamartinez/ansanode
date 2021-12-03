const Hbs = require('../models/hbs')
const Seller = require('../models/seller')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/sellershbs', [Middleware.authenticatedMiddleware, Authorization('salesman', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`sellers`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const sellers = await Hbs.listSalesman()
            cachelist.addCache(`sellershbs`, JSON.stringify(sellers), 60 * 60 * 6)

            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellers', [Middleware.authenticatedMiddleware, Authorization('salesman', 'read')], async (req, res, next) => {
        try {
            const sellers = await Seller.list()
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellersgoalline', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`goal:sellersgoalline:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login

            const sellers = await Seller.list(id_login)
            cachelist.addCache(`goal:sellersgoalline:${req.login.id_login}`, JSON.stringify(sellers), 60 * 60 * 6)

            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellersdashboard', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`goal:sellers:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login

            const sellers = await Seller.listDashboard(id_login)
            cachelist.addCache(`goal:sellers:${req.login.id_login}`, JSON.stringify(sellers), 60 * 60 * 6)

            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellergoal/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            const id_login = req.login.id_login

            const sellers = await Seller.view(id_login, id_salesman)
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.post('/salesman', [Middleware.authenticatedMiddleware, Authorization('salesman', 'create')], async (req, res, next) => {
        try {
            await Seller.insert(req.body.sellers)

            cachelist.delPrefix('sellers')

            res.status(201).json({ msg: 'Vendedor agregado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.put('/salesman/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('salesman', 'update')], async (req, res, next) => {
        try {
            const manager = req.body.manager
            await Seller.update(manager)

            cachelist.delPrefix('sellers')

            res.json({ msg: 'Vendedor actualizado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/salesman/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('salesman', 'delete')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            await Seller.delete(id_salesman)

            cachelist.delPrefix('sellers')

            res.json({ msg: 'Vendedor eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}