const Client = require('../models/client')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')


module.exports = app => {

    app.get('/clients', [Middleware.bearer, Authorization('clients', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue('clients')

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const clients = await Client.list()

            await cachelist.addCache('clients', JSON.stringify(clients), 60 * 15)

            res.json(clients)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/clients/hbs', [Middleware.bearer, Authorization('clients', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue('clients/hbs')

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const clients = await Client.listHbs()

            await cachelist.addCache('clients/hbs', JSON.stringify(clients), 60 * 15)

            res.json(clients)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })
}