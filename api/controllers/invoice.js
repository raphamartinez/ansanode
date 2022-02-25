const Invoice = require('../models/invoice');
const Client = require('../models/client')

const Middleware = require('../infrastructure/auth/middleware');
const Authorization = require('../infrastructure/auth/authorization');
const cachelist = require('../infrastructure/redis/cache');

module.exports = app => {

    app.get('/analisis/clientes', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {

            res.render('analysis');

        } catch (err) {
            next(err)
        }
    })

    app.get('/invoices/client/:month/:offices/:clients', [Middleware.authenticatedMiddleware, Authorization('office', 'read')], async (req, res, next) => {
        try {

            let search = {
                month: req.params.month,
                offices: req.params.offices,
                clients: req.params.clients
            }

            let invoices = await Invoice.listAnalysis(search);
            res.json(invoices);
        } catch (err) {
            next(err)
        }
    })
}