const Finance = require('../models/finance')
const Office = require('../models/office')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/cobranza', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {

            let arroffices = [];
            let offices = {};
            if (!req.access.all.allowed) {
                offices = await Office.listOffice(req.login.id_login)
                arroffices = offices.map(office => office.code)
            }

            const period = 30
            let invoices = await Finance.listOpenInvoices(period, arroffices)
            res.render('cobranza', {
                invoices
            })
        } catch (err) {
            next(err)
        }
    })

    app.get('/finance/graph/:office?/:user?', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            let office = req.params.office
            let user = req.params.user

            if (req.access.all.allowed) {

                if (office && office == "ALL") office = false
                if (user && user == "ALL") user = false

                let { graphs, details } = await Finance.graphReceivable(user, office)
                res.json({ graphs, details })
            } else {
                let id_login = false;
                let offices = false;
                let datestart = false;
                let dateend = false;

                if (req.login.perfil == 4 || req.login.perfil == 8) {
                    let offices = req.login.offices

                    offices = offices.map(of => {
                        return of.code
                    })

                    if (office && office != "ALL") offices = office
                    if (user && user != "ALL") id_login = user

                } else {
                    id_login = req.login.id_login
                }

                let { graphs, details } = await Finance.graphReceivable(id_login, offices, datestart, dateend)
                res.json({ graphs, details })
            }

        } catch (err) {
            next(err)
        }
    })

    app.post('/finance', [Middleware.authenticatedMiddleware, Authorization('finance', 'create')], async (req, res, next) => {
        try {
            const finance = req.body.finance

            const status = await Finance.insert(finance, req.login.id_login)

            cachelist.delPrefix('finance')

            res.status(201).json(status)
        } catch (err) {
            next(err)
        }
    })

    app.post('/financeexpected', [Middleware.authenticatedMiddleware, Authorization('finance', 'create')], async (req, res, next) => {
        try {
            const finance = req.body.finance

            const status = await Finance.insertExpected(finance, req.login.id_login)

            res.status(201).json(status)
        } catch (err) {
            next(err)
        }
    })

    app.put('/finance/:id_finance', [Middleware.authenticatedMiddleware, Authorization('finance', 'update')], async (req, res, next) => {
        try {
            const finance = req.body.finance
            const id_finance = req.params.id_finance

            await Finance.update(finance, id_finance)

            cachelist.delPrefix('finance')

            res.json({ msg: 'Comentario actualizada con ??xito.' })
        } catch (err) {
            next(err)
        }
    })

    app.get('/financeresumeoffice/:month?', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {

            let arroffices = [];

            let offices = {};

            let month = req.params.month ? req.params.month : false

            if (req.access.all.allowed) {
                const cached = await cachelist.searchValue(`office`);

                if (cached) {
                    offices = await JSON.parse(cached);
                } else {
                    offices = await Office.listOffice();
                    cachelist.addCache(`office`, JSON.stringify(search.offices), 60 * 60 * 2);
                }

            } else {
                offices = await Office.listOffice(req.login.id_login);
            }

            arroffices = offices.map(office => office.code);

            const resume = await Finance.resumeOffice(arroffices, month);

            res.json(resume)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/finance/:id_finance', [Middleware.authenticatedMiddleware, Authorization('finance', 'delete')], async (req, res, next) => {
        try {
            const id_finance = req.params.id_finance

            await Finance.delete(id_finance)

            cachelist.delPrefix('finance')

            res.json({ msg: 'Finanza eliminado con ??xito.' })
        } catch (err) {
            next(err)
        }
    })

    app.get('/finance/:clients/:offices/:overdue/:type', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            let offices = req.params.offices

            if (req.access.all.allowed) {
                offices = req.params.offices

                // const cached = await cachelist.searchValue(`finance:${JSON.stringify(req.params)}`)

                // if (cached) {
                //     return res.json(JSON.parse(cached))
                // }

            }

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

    app.get('/financeview/:office/:user/:status', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`financeview:${JSON.stringify(req.params)}`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const office = req.params.office
            const user = req.params.user
            const status = req.params.status

            const finances = await Finance.view(office, user, status)
            cachelist.addCache(`financeview:${JSON.stringify(req.params)}`, JSON.stringify(finances), 60 * 60 * 3)

            res.json(finances)
        } catch (err) {
            next(err)
        }
    })

    app.get('/financeclick/:typeAmountOpen/:office?', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {

            const typeAmountOpen = req.params.typeAmountOpen
            let arroffices = [];
            let offices = {};
            if (!req.access.all.allowed) {
                offices = await Office.listOffice(req.login.id_login)
                arroffices = offices.map(office => office.code)
            }else{
                const office = req.params.office  
                arroffices.push(office)
            }

            const invoices = await Finance.amountOpen(arroffices, typeAmountOpen)
            res.json(invoices)
        } catch (err) {
            next(err)
        }
    })


    app.get('/financehistory/:invoice', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
        try {
            let invoice = req.params.invoice

            const historys = await Finance.listInvoiceHistory(invoice)
            res.json(historys)
        } catch (err) {
            next(err)
        }
    })

    app.get('/financeclient/:client/:date', [Middleware.authenticatedMiddleware, Authorization('finance', 'read')], async (req, res, next) => {
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