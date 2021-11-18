const Hbs = require('../models/hbs')
const Item = require('../models/item')
const Authorization = require('../infrastructure/auth/authorization')
const Middleware = require('../infrastructure/auth/middleware')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.post('/goodyear', [Middleware.bearer, Authorization('goodyear', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`finance:${JSON.stringify(req.body.search)},id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listGoodyear(search, id_login)
            cachelist.addCache(`goodyear:${JSON.stringify(req.body.search)},id_login:${req.login.id_login}`, JSON.stringify(items), 60 * 60 * 6)

            res.status(201).json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/items', [Middleware.bearer, Authorization('items', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`items:${JSON.stringify(req.body.search)},id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login
            let search = req.body.search

            const items = await Hbs.listItems(search, id_login)
            cachelist.addCache(`items:${JSON.stringify(req.body.search)},id_login:${req.login.id_login}`, JSON.stringify(items), 60 * 60 * 6)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/itemslabel/:office', [Middleware.bearer, Authorization('items', 'read')], async (req, res, next) => {
        try {
            let code = req.body.code
            let office = req.params.office

            const items = await Hbs.listItemsLabel(code, office)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/itemsgroups', [Middleware.bearer, Authorization('items', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`itemsgroups`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const itemsgroups = await Hbs.listItemsGroups()
            cachelist.addCache(`itemsgroups`, JSON.stringify(itemsgroups), 60 * 60 * 12)

            res.json(itemsgroups)
        } catch (err) {
            next(err)
        }
    })

    app.get('/items/all', [Middleware.bearer, Authorization('items', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`items/all`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const items = await Item.listUnion()
            cachelist.addCache(`items/all`, JSON.stringify(items), 60 * 60 * 12)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/itemscomplete', [Middleware.bearer, Authorization('items', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`items:id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const items = await Hbs.listItemsComplete(req.login.id_login)
            cachelist.addCache(`items:id_login:${req.login.id_login}`, JSON.stringify(items), 60 * 60 * 12)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/invoiceitems/:invoice', [Middleware.bearer, Authorization('items', 'read')], async (req, res, next) => {
        try {
            const invoice = req.params.invoice

            const items = await Item.listInvoiceItems(invoice)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/price', [Middleware.bearer, Authorization('price', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`price:${JSON.stringify(req.body.search)},id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login
            const search = req.body.search

            const items = await Hbs.listPrice(search, id_login)
            cachelist.addCache(`price:${JSON.stringify(req.body.search)},id_login:${req.login.id_login}`, JSON.stringify(items), 60 * 60 * 6)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockandgroup', [Middleware.bearer, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`stockandgroup`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const fields = await Hbs.listStockandGroup()
            cachelist.addCache(`stockandgroup`, JSON.stringify(fields), 60 * 60 * 6)

            res.json(fields)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockuser', [Middleware.bearer, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const fields = await Hbs.listStockbyUser(id_login)
            res.json(fields)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockbyitem/:artcode', [Middleware.bearer, Authorization('stock', 'read')], async (req, res, next) => {
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
            const cached = await cachelist.searchValue(`goal:id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login

            const expected = await Item.listExpectedSalesByManager(id_login)
            cachelist.addCache(`goal:id_login:${req.login.id_login}`, JSON.stringify(expected), 60 * 60 * 6)

            res.json(expected)
        } catch (err) {
            next(err)
        }
    })
}