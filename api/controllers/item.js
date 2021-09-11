const Hbs = require('../models/hbs')
const Item = require('../models/item')

const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.post('/goodyear', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listGoodyear(search, id_login)
            res.status(201).json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/items', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            let search = req.body.search

            const items = await Hbs.listItems(search, id_login)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/itemslabel/:office', Middleware.bearer, async (req, res, next) => {
        try {
            let code = req.body.code
            let office = req.params.office

            const items = await Hbs.listItemsLabel(code, office)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/itemsgroups', Middleware.bearer, async (req, res, next) => {
        try {
            const itemsgroups = await Hbs.listItemsGroups()
            res.json(itemsgroups)
        } catch (err) {
            next(err)
        }
    })

    app.get('/itemscomplete', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const items = await Hbs.listItemsComplete(id_login)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/invoiceitems/:invoice', Middleware.bearer, async (req, res, next) => {
        try {
            const invoice = req.params.invoice

            const items = await Item.listInvoiceItems(invoice)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/price', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listPrice(search, id_login)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockandgroup', Middleware.bearer, async (req, res, next) => {
        try {
            const fields = await Hbs.listStockandGroup()
            res.json(fields)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockuser', Middleware.bearer, async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const fields = await Hbs.listStockbyUser(id_login)
            res.json(fields)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockbyitem/:artcode', Middleware.bearer, async (req, res, next) => {
        try {
            const artcode = req.params.artcode

            const stocks = await Hbs.listStockByItem(artcode)
            res.json(stocks)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sale/:id_salesman/:artcode', Middleware.bearer, async (req, res, next) => {
        try {
            const artcode = req.params.artcode
            const id_salesman = req.params.id_salesman

            const sale = await Hbs.listSaleByItem(id_salesman, artcode)
            res.json(sale)
        } catch (err) {
            next(err)
        }
    })

    app.get('/expectedsellers', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_login = req.login.id_login

            const expected = await Item.listExpectedSalesByManager(id_login)
            res.json(expected)
        } catch (err) {
            next(err)
        }
    })
}