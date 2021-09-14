const Finance = require('../models/finance')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.post('/finance', Middleware.bearer, async ( req, res, next) => {
        try {
            const finance = req.body.finance

            const result = await Finance.insert(finance)
            res.status(201).json({return: "guardado"})
        } catch (err) {
            next(err)
        }
    })

    app.put('/finance/:id_finance', Middleware.bearer, async ( req, res, next) => {
        try {
            const finance = req.body.finance
            const id_finance = req.params.id_finance

            const result = await Finance.update(finance, id_finance)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/finance/:id_finance', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_finance = req.params.id_finance

            const result = await Finance.delete(id_finance)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.get('/finance/:clients/:offices/:overdue', Middleware.bearer, async ( req, res, next) => {
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

    app.get('/clients', Middleware.bearer, async ( req, res, next) => {
        try {
            const clients = await Finance.listDistinctClients()
            res.json(clients)
        } catch (err) {
            next(err)
        }
    })

    app.get('/financehistory/:invoice', Middleware.bearer, async ( req, res, next) => {
        try {
            let invoice = req.params.invoice

            const historys = await Finance.listInvoiceHistory(invoice)
            res.json(historys)
        } catch (err) {
            next(err)
        }
    })

    app.get('/financeclient/:client/:date', Middleware.bearer, async ( req, res, next) => {
        try {
            let client = req.params.client
            let date = req.params.date

            const finances = await Finance.listClients(client, date)
            res.json(finances)
        } catch (err) {
            next(err)
        }
    })
}