const Invoice = require('../models/invoice');
const Office = require('../models/office')

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

    app.get('/invoices/client/:start/:end/:offices/:clients/:groups', [Middleware.authenticatedMiddleware, Authorization('office', 'read')], async (req, res, next) => {
        try {

            let search = {
                start: req.params.start,
                end: req.params.end,
                offices: req.params.offices,
                clients: req.params.clients,
                groups: req.params.groups
            };

            let invoices = await Invoice.listAnalysis(search);
            res.json(invoices);
        } catch (err) {
            next(err)
        }
    })
}