const PowerBi = require('../models/powerbi')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/powerbis/:type', Middleware.bearer, async ( req, res, next) => {

        try {
            const id_login = req.login.id_login
            const type = req.params.type
            const powerbis = await PowerBi.listPowerBi(id_login, type)
            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })

    app.get('/powerbis', Middleware.bearer, async ( req, res, next) => {

        try {
            const id_login = req.login.id_login
            const powerbis = await PowerBi.listPowerBis(id_login)
            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })

    app.all('/admin/*', Middleware.bearer, async ( req, res, next) => {
        try {
            next()
        } catch (err) {
            next(err)
        }
    });

    app.get('/powerbisuser/:id', Middleware.bearer, async ( req, res, next) => {

        try {
            const id_login = req.params.id
            const powerbis = await PowerBi.listPowerBis(id_login)
            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })


    app.get('/powerbi/:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_powerbi = req.params.id
            const user = await PowerBi.viewPowerBi(id_powerbi)
            res.json(user)
        } catch (err) {
            next(err)
        }
    })

    app.post('/powerbi', Middleware.bearer, async ( req, res, next) => {
        try {
            const powerbi = req.body.powerbi
            const result = await PowerBi.insertPowerBi(powerbi)
            res.status(201).send(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/powerbi/:id', Middleware.bearer, async ( req, res, next) => {

        try {
            const id_powerbi = req.params.id
            const data = req.body
            await PowerBi.updatePowerBi(data, id_powerbi)
            res.json()
        } catch (err) {
            next(err)
        }
    })

    app.delete('/powerbi/:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_powerbi = req.params.id
            const result = await PowerBi.deletePowerBi(id_powerbi)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}
