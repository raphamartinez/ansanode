const Stock = require('../models/stock')
const Hbs = require('../models/hbs')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/stock', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            res.render('stock')
        } catch (err) {
            next(err)
        }
    })

    app.get('/inventario', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            res.render('inventario')
        } catch (err) {
            next(err)
        }
    })

    app.post('/stock', [Middleware.authenticatedMiddleware, Authorization('stock', 'create')], async (req, res, next) => {
        try {
            const id_login = req.body.id_login
            const stock = req.body.stock

            await Stock.insert(stock, id_login)

            cachelist.delPrefix('stock')

            res.status(201).json({ msg: 'Stock agregado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.post('/report/dote', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const stock = req.body.stock
            const name = req.login.name

            const wb = await Hbs.listDote(stock, name)
            wb.write('dote.xlsx', res)
        } catch (err) {
            next(err)
        }
    })

    app.post('/report/xlsx/dote', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const stock = req.body.stock
            const name = req.login.name

            const workbook = await Hbs.listDoteXs(stock, name)
            const buffer = await workbook.xlsx.writeBuffer();

            res.contentType('application/vnd.ms-excel')
            res.setHeader('Content-Disposition', 'attachment; filename=Toma de Inventario.xlsx');
            return res.send(buffer)
        } catch (err) {
            next(err)
        }
    })


    app.get('/stocks/:id_login', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const cached = await cachelist.searchValue(`stock:id_login:${req.params.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const stock = await Stock.list(req.params.id_login)
            cachelist.addCache(`stock:id_login:${req.params.id_login}`, JSON.stringify(stock), 60 * 60 * 3)


            res.json(stock)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/stock/:id_stock', [Middleware.authenticatedMiddleware, Authorization('stock', 'delete')], async (req, res, next) => {
        try {
            await Stock.delete(req.params.id_stock)

            cachelist.delPrefix('stock')

            res.json({ msg: 'Stock eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}