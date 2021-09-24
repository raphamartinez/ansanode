const Hbs = require('../models/hbs')
const Seller = require('../models/seller')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/sellershbs', [Middleware.bearer, Authorization('salesman', 'read')], async (req, res, next) => {
        try {
            const sellers = await Hbs.listSalesman()
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellers', [Middleware.bearer, Authorization('salesman', 'read')], async (req, res, next) => {
        try {
            const sellers = await Seller.list()
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellersgoalline', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const sellers = await Seller.list(id_login)
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellersdashboard', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const sellers = await Seller.listDashboard(id_login)
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellergoal/:id_salesman', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            const id_login = req.login.id_login

            const sellers = await Seller.view(id_login, id_salesman)
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.post('/salesman', [Middleware.bearer, Authorization('salesman', 'create')], async (req, res, next) => {
        try {
            const data = req.body.sellers
            const result = await Seller.insert(data)
            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/salesman/:id_salesman', [Middleware.bearer, Authorization('salesman', 'update')], async (req, res, next) => {
        try {
            const manager = req.body.manager
            const result = await Seller.update(manager)
            res.status(201).json(manager)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/salesman/:id_salesman', [Middleware.bearer, Authorization('salesman', 'delete')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            const result = await Seller.delete(id_salesman)
            res.json(id_salesman)
        } catch (err) {
            next(err)
        }
    })
}