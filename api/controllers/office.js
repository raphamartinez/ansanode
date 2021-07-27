const Office = require('../models/office')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/offices', Middleware.bearer, async ( req, res, next) => {
        try {
            const offices = await Office.listOffice()
            res.json(offices)
        } catch (err) {
            next(err)
        }
    })

    app.get('/office/:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_office = req.params.id

            const office = await User.viewUser(id_office)
            res.json(office)
        } catch (err) {
            next(err)
        }
    })

    app.post('/office', Middleware.bearer, async ( req, res, next) => {
        try {
            const data = req.body

            const result = await Office.createOffice(data)
            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/office/:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const data = req.body
            const id_office = req.params.id

            const result = await Office.updateOffice(data, id_office)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/office/:id', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_office = req.params.id

            const result = await Office.deleteOffice(id_office)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}