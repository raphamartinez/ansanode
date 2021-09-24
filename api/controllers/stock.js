const Stock = require('../models/stock')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.post('/stock', [Middleware.bearer,  Authorization('stock', 'create')], async ( req, res, next) => {
        try {
            const id_login = req.body.id_login
            const stock = req.body.stock

            const items = await Stock.insert(stock, id_login)
            res.status(201).json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/stocks/:id_login', [Middleware.bearer,  Authorization('stock', 'read')], async ( req, res, next) => {
        try {
            const id_login = req.params.id_login

            const stock = await Stock.list(id_login)

            res.json(stock)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/stock/:id_stock', [Middleware.bearer,  Authorization('stock', 'delete')], async ( req, res, next) => {
        try {
            const id_stock = req.params.id_stock

            await Stock.delete(id_stock)

            res.json(id_stock)
        } catch (err) {
            next(err)
        }
    })
}