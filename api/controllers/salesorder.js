const Finance = require('../models/finance')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/ventas', [Middleware.authenticatedMiddleware, Authorization('sales', 'read')], async (req, res, next) => {
        try {

            res.render('salesorder')
        } catch (err) {
            next(err)
        }
    })

    app.get('/salesorder/:datestart/:dateend/:salesman/:office/:group', [Middleware.authenticatedMiddleware, Authorization('sales', 'read')], async (req, res, next) => {
        try {

            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend,
                salesman: req.params.salesman,
                office: req.params.office,
                group: req.params.group
            }

            const salesorders = await Finance.listSalesOrders(search)

            res.json(salesorders)
        } catch (err) {
            next(err)
        }
    })
}