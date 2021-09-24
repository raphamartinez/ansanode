const Finance = require('../models/finance')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.post('/finance', [Middleware.bearer, Authorization('finance', 'create')], async (req, res, next) => {
        try {
            const finance = req.body.finance

            await Finance.insert(finance)
            res.status(201).json({ return: "guardado" })
        } catch (err) {
            next(err)
        }
    })

    app.put('/finance/:id_finance', [Middleware.bearer, Authorization('finance', 'update')], async (req, res, next) => {
        try {
            const finance = req.body.finance
            const id_finance = req.params.id_finance

            const result = await Finance.update(finance, id_finance)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/finance/:id_finance', [Middleware.bearer, Authorization('finance', 'delete')], async (req, res, next) => {
        try {
            const id_finance = req.params.id_finance

            const result = await Finance.delete(id_finance)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.get('/finance/:clients/:offices/:overdue', [Middleware.bearer, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            const clients = req.params.clients
            const offices = req.params.offices
            const overdue = req.params.overdue

            const finances = await Finance.list(clients, offices, overdue)
            res.json(finances)
        } catch (err) {
            next(err)
        }
    })

    app.get('/clients', [Middleware.bearer, Authorization('clients', 'read')], async (req, res, next) => {
        try {
            const clients = await Finance.listDistinctClients()
            res.json(clients)
        } catch (err) {
            next(err)
        }
    })

    app.get('/financehistory/:invoice', [Middleware.bearer, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            let invoice = req.params.invoice

            const historys = await Finance.listInvoiceHistory(invoice)
            res.json(historys)
        } catch (err) {
            next(err)
        }
    })

    app.get('/financeclient/:client/:date', [Middleware.bearer, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            let client = req.params.client
            let date = req.params.date

            const finances = await Finance.listClients(client, date)
            res.json(finances)
        } catch (err) {
            next(err)
        }
    })

    app.get('/salesorder/:datestart/:dateend/:salesman/:office', [Middleware.bearer, Authorization('sales', 'read')], async (req, res, next) => {
        try {
            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend,
                salesman: req.params.salesman,
                office: req.params.office
            }
            const salesorders = await Finance.listSalesOrders(search)
            res.json(salesorders)
        } catch (err) {
            next(err)
        }
    })
}