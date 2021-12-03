const Crm = require('../models/crm')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/crm', [Middleware.authenticatedMiddleware, Authorization('crm', 'read')], async (req, res, next) => {
        try {
          res.render('crm',{
              perfil: req.login.perfil
          })
        } catch (err) {
            next(err)
        }
    })

    app.get('/crm/:start/:end/:offices/:sellers', [Middleware.authenticatedMiddleware, Authorization('crm', 'read')], async (req, res, next) => {
        try {

            let search = {
                start: req.params.start,
                end: req.params.end,
                offices: req.params.offices,
                sellers: req.params.sellers,
                id: false
            }

            if (req.access.only.allowed) {
                switch (req.access.atributes) {
                    case "office":
                        if (!search.offices) search.offices = req.params.offices;
                        break;
                    case "id":
                        search.offices = false
                        search.id = req.login.id_login
                        break;
                }
            }

            const { crms, types, days, clients } = await Crm.list(search)

            res.json({ crms, types, days, clients })
        } catch (err) {
            next(err)
        }
    })

    app.get('/crm/products/:id', [Middleware.authenticatedMiddleware, Authorization('crm', 'read')], async (req, res, next) => {
        try {

            const products = await Crm.listProducts(req.params.id)

            res.json(products)
        } catch (err) {
            next(err)
        }
    })

    app.post('/crm', [Middleware.authenticatedMiddleware, Authorization('crm', 'create')], async (req, res, next) => {
        try {
            const crm = req.body.crm

            const id = await Crm.create(crm, req.login.id_login)

            res.status(201).json({ msg: 'Crm agregada con éxito.', id })
        } catch (err) {
            next(err)
        }
    })

    app.put('/crm/:id', [Middleware.authenticatedMiddleware, Authorization('crm', 'update')], async (req, res, next) => {
        try {
            const data = req.body
            const id_crm = req.params.id

            await Crm.update(data, id_crm)
            cachelist.delPrefix('crm')

            res.json({ msg: 'Crm actualizada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.put('/crm/products/:id', [Middleware.authenticatedMiddleware, Authorization('crm', 'update')], async (req, res, next) => {
        try {
            const value = req.body.value
            const id = req.params.id

            await Crm.updateProduct(value, id)
            cachelist.delPrefix('crm')

            res.json({ msg: 'Crm actualizada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/crm/:id', [Middleware.authenticatedMiddleware, Authorization('crm', 'delete')], async (req, res, next) => {
        try {
            const id_crm = req.params.id

            await Crm.delete(id_crm)
            cachelist.delPrefix('crm')

            res.json({ msg: 'Crm eliminada con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}