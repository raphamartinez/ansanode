const Inventory = require('../models/inventory')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/inventario', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const archives = await Inventory.archives()
            res.render('inventory', {
                archives
            })
        } catch (err) {
            next(err)
        }
    })

    app.post('/inventory/delete/:id', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const id = req.params.id
            await Inventory.delete(id)

            res.redirect('/inventario')
        } catch (err) {
            next(err)
        }
    })

    app.get(`/inventory/new/:stock`, [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const stock = req.params.stock
            const id_login = req.login.id_login
            const itemsdt = await Inventory.list(stock)
            const id = await Inventory.create(id_login, stock)
            const items = await Inventory.items(itemsdt, id)
            return res.json({ items, id })
        } catch (err) {
            next(err)
        }
    })

    app.get(`/inventory/:id_inventory`, [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const id = req.params.id_inventory
            const inventory = await Inventory.inventory(id)
            if (!inventory) return res.json()
            const itemsdt = await Inventory.list(inventory[0].stock)
            const items = await Inventory.items(itemsdt, id)
            return res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.post('/inventory/item', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            let item = req.body.item
            const id_login = req.login.id_login
            const status = await Inventory.insert(item, id_login)
            return res.json(status)
        } catch (err) {
            next(err)
        }
    })

    app.post('/report/inventory', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const stock = req.body.stock
            const name = req.login.name
            const items = await Inventory.list(stock)
            const workbook = await Inventory.generate(items, name, stock)
            const buffer = await workbook.xlsx.writeBuffer()

            res.contentType('application/vnd.ms-excel')
            res.setHeader('Content-Disposition', 'attachment; filename=Toma de Inventario.xlsx')
            return res.send(buffer)
        } catch (err) {
            next(err)
        }
    })

    app.post('/report/inventory/:id', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {
            const id = req.params.id
            const stock = req.body.stock
            const name = req.login.name
            const items = await Inventory.list(stock)
            const workbook = await Inventory.generate(items, name, stock, id)
            const buffer = await workbook.xlsx.writeBuffer()

            res.contentType('application/vnd.ms-excel')
            res.setHeader('Content-Disposition', 'attachment; filename=Toma de Inventario.xlsx')
            return res.send(buffer)
        } catch (err) {
            next(err)
        }
    })
}