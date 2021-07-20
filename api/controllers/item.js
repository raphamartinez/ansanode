const Hbs = require('../models/hbs')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.post('/goodyear', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listGoodyear(search, id_login)
            res.json(items)
        } catch (error) {
            next(error)
        }
    })

    app.post('/items', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listItems(search, id_login)
            res.json(items)
        } catch (error) {
            next(error)
        }
    })

    app.post('/price', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listPrice(search, id_login)
            res.json(items)
        } catch (error) {
            next(error)
        }
    })

    app.get('/stockandgroup', Middleware.bearer, async (req, res, next) => {
        try {
            const fields = await Hbs.listStockandGroup()
            res.json(fields)
        } catch (error) {
            next(error)
        }
    })

    app.get('/stockbyitem/:artcode', Middleware.bearer, async (req, res, next) => {
        try {
            const artcode = req.params.artcode

            const stocks = await Hbs.listStockByItem(artcode)
            res.json(stocks)
        } catch (error) {
            next(error)
        }
    })
}