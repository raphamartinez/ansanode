const PowerBi = require('../models/powerbi')
const ViewPowerBi = require('../models/viewpowerbi')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/powerbis/:type', [Middleware.bearer, Authorization('powerbi', 'read')], async (req, res, next) => {

        try {
            const cached = await cachelist.searchValue(`powerbi:${JSON.stringify(req.params)},id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login
            const type = req.params.type
            const powerbis = await PowerBi.listPowerBi(id_login, type)
            cachelist.addCache(`powerbi:${JSON.stringify(req.params)},id_login:${req.login.id_login}`, JSON.stringify(powerbis), 60 * 60 * 6)

            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })

    app.get('/powerbis', [Middleware.bearer, Authorization('powerbi', 'read')], async (req, res, next) => {

        try {

            const cached = await cachelist.searchValue(`powerbi:id_login:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_login = req.login.id_login
            const powerbis = await PowerBi.listPowerBis(id_login)
            cachelist.addCache(`powerbi:id_login:${req.login.id_login}`, JSON.stringify(powerbis), 60 * 60 * 6)

            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })

    app.get('/powerbisadmin', [Middleware.bearer, Authorization('powerbi', 'read')], async (req, res, next) => {

        try {
            const powerbis = await PowerBi.listBis()

            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })

    app.all('/admin/*', Middleware.bearer, async (req, res, next) => {
        try {
            next()
        } catch (err) {
            next(err)
        }
    });

    app.get('/powerbisuser/:id', [Middleware.bearer, Authorization('powerbi', 'read')], async (req, res, next) => {

        try {
            const id_login = req.params.id
            const powerbis = await PowerBi.listPowerBis(id_login)
            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })


    app.get('/powerbi/:id', [Middleware.bearer, Authorization('powerbi', 'read')], async (req, res, next) => {
        try {
            const id_powerbi = req.params.id
            const user = await PowerBi.viewPowerBi(id_powerbi)
            
            res.json(user)
        } catch (err) {
            next(err)
        }
    })

    app.post('/powerbi', [Middleware.bearer, Authorization('powerbi', 'create')], async (req, res, next) => {
        try {
            const powerbi = req.body.powerbi
            const id_powerbi = await PowerBi.insertPowerBi(powerbi)

            cachelist.delPrefix('powerbi')

            res.status(201).json(id_powerbi)
        } catch (err) {
            next(err)
        }
    })

    app.post('/powerbiview', Middleware.bearer, async (req, res, next) => {
        try {
            const users = req.body.users
            const id_powerbi = req.body.id_powerbi
            await ViewPowerBi.insertPowerBi(users, id_powerbi)

            cachelist.delPrefix('powerbi')

            res.status(200).json({ msg: `PowerBi agregado con éxito!` })
        } catch (error) {
            next(error)
        }
    })

    app.put('/powerbi/:id', [Middleware.bearer, Authorization('powerbi', 'update')], async (req, res, next) => {

        try {
            const id_powerbi = req.params.id
            const data = req.body
            await PowerBi.updatePowerBi(data, id_powerbi)

            cachelist.delPrefix('powerbi')

            res.json({msg: `PowerBi editado con éxito!`})
        } catch (err) {
            next(err)
        }
    })

    app.delete('/powerbi/:id', [Middleware.bearer, Authorization('powerbi', 'delete')], async (req, res, next) => {
        try {
            const id_powerbi = req.params.id
            await PowerBi.deletePowerBi(id_powerbi)

            cachelist.delPrefix('powerbi')

            res.json({msg: `PowerBi excluido con éxito!`})
        } catch (err) {
            next(err)
        }
    })
}
