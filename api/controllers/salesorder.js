const Finance = require('../models/finance')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/salesorder/:datestart/:dateend/:salesman/:office', [Middleware.bearer, Authorization('sales', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`salesorder:${JSON.stringify(req.params)}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend,
                salesman: req.params.salesman,
                office: req.params.office
            }
            const salesorders = await Finance.listSalesOrders(search)
            cachelist.addCache(`salesorder:${JSON.stringify(req.params)}`, JSON.stringify(salesorders), 60 * 30)

            res.json(salesorders)
        } catch (err) {
            next(err)
        }
    })
}