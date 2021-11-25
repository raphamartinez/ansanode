const Clock = require('../models/clockmachine')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/clock/:type/:start/:end/:code/:offices', [Middleware.bearer, Authorization('clock', 'read')], async (req, res, next) => {
        try {
            let clocks

            const period = {
                start: req.params.start,
                end: req.params.end
            }
            const type = req.params.type
            const code = req.params.code
            let office = req.params.offices

            if (req.access.all.allowed) {
                clocks = await Clock.list(office, period, type, code)
            } else {
                if(!office) office = req.login.offices
                clocks = await Clock.list(office, period, type, code)
            }

            res.json(clocks)
        } catch (err) {
            next(err)
        }
    })

    app.get('/clock/workers', [Middleware.bearer, Authorization('clock', 'read')], async (req, res, next) => {
        try {
            let workers

            if (req.access.all.allowed) {
                const cached = await cachelist.searchValue(`clock/workers`)

                if (cached) {
                    return res.json(JSON.parse(cached))
                }

                workers = await Clock.listWorkers()
                cachelist.addCache(`clock/workers`, JSON.stringify(workers), 60 * 60 * 2)

            } else {
                if(req.login.offices.length > 0) workers = await Clock.listWorkers(req.login.offices)
            }

            res.json(workers)
        } catch (err) {
            next(err)
        }
    })
}