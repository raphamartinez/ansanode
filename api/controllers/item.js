const Hbs = require('../models/hbs')
const Item = require('../models/item')
const Authorization = require('../infrastructure/auth/authorization')
const Middleware = require('../infrastructure/auth/middleware')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/goodyear', [Middleware.authenticatedMiddleware, Authorization('goodyear', 'read')], async (req, res, next) => {
        try {
            res.render('goodyear')
        } catch (err) {
            next(err)
        }
    })

    app.get('/goodyear/:datestart/:dateend/:itemgroup/:office', [Middleware.authenticatedMiddleware, Authorization('goodyear', 'read')], async (req, res, next) => {
        try {

            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend,
                itemgroup: req.params.itemgroup,
                office: req.params.office
            }

            console.log(search);
            const items = await Hbs.listGoodyear(search, req.login.id_login)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stock/items/:name/:code/:stock/:itemgroup/:empty', [Middleware.authenticatedMiddleware, Authorization('items', 'read')], async (req, res, next) => {
        try {

            let search = {
                name: req.params.name,
                code: req.params.code,
                stock: req.params.stock,
                itemgroup: req.params.itemgroup,
                empty: req.params.empty,
            }
            
            const items = await Hbs.listStock(search, req.login.id_login)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/itemslabel/:office', [Middleware.authenticatedMiddleware, Authorization('items', 'read')], async (req, res, next) => {
        try {
            let code = req.body.code
            let office = req.params.office

            const items = await Hbs.listItemsLabel(code, office)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/itemsgroups', [Middleware.authenticatedMiddleware, Authorization('items', 'read')], async (req, res, next) => {
        try {
            // const cached = await cachelist.searchValue(`itemsgroups`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const itemsgroups = await Hbs.listItemsGroups()
            cachelist.addCache(`itemsgroups`, JSON.stringify(itemsgroups), 60 * 60 * 12)

            res.json(itemsgroups)
        } catch (err) {
            next(err)
        }
    })

    app.get('/items/all', [Middleware.authenticatedMiddleware, Authorization('items', 'read')], async (req, res, next) => {
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

    app.get('/itemscomplete', [Middleware.authenticatedMiddleware, Authorization('items', 'read')], async (req, res, next) => {
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

    app.get('/invoiceitems/:invoice', [Middleware.authenticatedMiddleware, Authorization('items', 'read')], async (req, res, next) => {
        try {
            const invoice = req.params.invoice;

            const items = await Item.listInvoiceItems(invoice)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/precio', [Middleware.authenticatedMiddleware, Authorization('price', 'read')], async (req, res, next) => {
        try {
            res.render("precio",{
                perfil: req.login.perfil
            })
        } catch (err) {
            next(err)
        }
    })

    app.get('/price/:name/:code/:itemgroup/:pricelist', [Middleware.authenticatedMiddleware, Authorization('price', 'read')], async (req, res, next) => {
        try {

            let search = {
                name: req.params.name,
                code: req.params.code,
                pricelist: req.params.pricelist,
                itemgroup: req.params.itemgroup
            }

            console.log(search);

            const items = await Hbs.listPrice(search, req.login.id_login)
            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockandgroup', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
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

    app.get('/stockuser', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const offices = req.login.offices
            const perfil = req.login.perfil

            const fields = await Hbs.listStockbyUser(offices, perfil)
            res.json(fields)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stockbyitem/:artcode', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const artcode = req.params.artcode

            const stocks = await Hbs.listStockByItem(artcode)
            res.json(stocks)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sale/:id_salesman/:artcode', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const artcode = req.params.artcode
            const id_salesman = req.params.id_salesman

            const sale = await Hbs.listSaleByItem(id_salesman, artcode)
            res.json(sale)
        } catch (err) {
            next(err)
        }
    })

    // app.get('/expectedsellers', Middleware.authenticatedMiddleware, async ( req, res, next) => {
    //     try {
    //         const cached = await cachelist.searchValue(`goal:id_login:${req.login.id_login}`)

    //         if (cached) {
    //             return res.json(JSON.parse(cached))
    //         }

    //         const id_login = req.login.id_login

    //         const expected = await Item.listExpectedSalesByManager(id_login)
    //         cachelist.addCache(`goal:id_login:${req.login.id_login}`, JSON.stringify(expected), 60 * 60 * 6)

    //         res.json(expected)
    //     } catch (err) {
    //         next(err)
    //     }
    // })
}