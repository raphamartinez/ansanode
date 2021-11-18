const Finance = require('../models/finance')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.post('/finance', [Middleware.bearer, Authorization('finance', 'create')], async (req, res, next) => {
        try {
            const finance = req.body.finance

            await Finance.insert(finance, req.login.id_login)

            cachelist.delPrefix('finance')

            res.status(201).json({return: 'Comentario agregado con éxito.'})
        } catch (err) {
            next(err)
        }
    })

    app.put('/finance/:id_finance', [Middleware.bearer, Authorization('finance', 'update')], async (req, res, next) => {
        try {
            const finance = req.body.finance
            const id_finance = req.params.id_finance

            await Finance.update(finance, id_finance)

            cachelist.delPrefix('finance')

            res.json({msg: 'Comentario actualizada con éxito.'})
        } catch (err) {
            next(err)
        }
    })

    app.delete('/finance/:id_finance', [Middleware.bearer, Authorization('finance', 'delete')], async (req, res, next) => {
        try {
            const id_finance = req.params.id_finance

            await Finance.delete(id_finance)

            cachelist.delPrefix('finance')

            res.json({ msg: 'Finanza eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.get('/finance/:clients/:offices/:overdue/:type', [Middleware.bearer, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            let offices = req.params.offices

            // if (req.access.all.allowed) {
            //     offices = req.params.offices

            //     const cached = await cachelist.searchValue(`finance:${JSON.stringify(req.params)}`)

            //     if (cached) {
            //         return res.json(JSON.parse(cached))
            //     }

            // }

            const clients = req.params.clients
            const overdue = req.params.overdue
            const type = req.params.type

            const finances = await Finance.list(clients, offices, overdue, type)
            cachelist.addCache(`finance:${JSON.stringify(req.params)}`, JSON.stringify(finances), 60 * 60 * 3)

            res.json(finances)
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
}