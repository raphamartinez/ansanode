const Office = require('../models/office')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/offices', [Middleware.authenticatedMiddleware, Authorization('office', 'read')], async (req, res, next) => {
        try {

            let offices

            if (req.access.all.allowed) {
                const cached = await cachelist.searchValue(`office`)

                if (cached) {
                    return res.json(JSON.parse(cached))
                }

                offices = await Office.listOffice()
                cachelist.addCache(`office`, JSON.stringify(offices), 60 * 60 * 2)

            } else {
                offices = await Office.listOffice(req.login.id_login)
            }

            res.json(offices)
        } catch (err) {
            next(err)
        }
    })

    app.post('/office', [Middleware.authenticatedMiddleware, Authorization('office', 'create')], async (req, res, next) => {
        try {
            const data = req.body

            const result = await Office.createOffice(data)
            cachelist.delPrefix('office')

            res.status(201).json({ msg: 'Sucursal agregada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.put('/office/:id', [Middleware.authenticatedMiddleware, Authorization('office', 'update')], async (req, res, next) => {
        try {
            const data = req.body
            const id_office = req.params.id

            await Office.updateOffice(data, id_office)
            cachelist.delPrefix('office')

            res.json({ msg: 'Sucursal actualizada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/office/:id', [Middleware.authenticatedMiddleware, Authorization('office', 'delete')], async (req, res, next) => {
        try {
            const id_office = req.params.id

            await Office.deleteOffice(id_office)
            cachelist.delPrefix('office')

            res.json({ msg: 'Sucursal eliminada con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}