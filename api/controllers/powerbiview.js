const ViewPowerBi = require('../models/viewpowerbi')
const Middleware = require('../infrastructure/auth/middleware')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

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

    app.get('/powerbiview/:id_powerbi', Middleware.bearer, async (req, res, next) => {
        try {
            
            const powerbis = await ViewPowerBi.listPowerBi(req.params.id_powerbi)

            res.json(powerbis)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/powerbiview/:id_powerbi', Middleware.bearer, async (req, res, next) => {
        try {
            
            await ViewPowerBi.delete(req.params.id_powerbi)

            res.json({msg: `Acceso ao informe caducado con éxito!`})
        } catch (error) {
            next(error)
        }
    })

}
