const User = require('../models/user')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/users', Middleware.bearer , async (req, res, next) => {

        try {
            const users = await User.listUsers()

            res.json(users)
        } catch (error) {
            next(error)
        }
    }) 

    app.get('/user/:id', Middleware.bearer, async (req, res, next) => {
        try {
            const id_user = req.params.id

            const user = await User.viewUser(id_user)

            res.json(user)
        } catch (error) {
            next(error)
        }
    })

    app.post('/user', Middleware.bearer, async (req, res, next) => {
        try {
            const data = req.body
            const result = await User.insertUser(data)

            res.json(result)
        } catch (error) {
            next(error)
        }
    })

    app.put('/user/:id', Middleware.bearer, async (req, res, next) => {

        try {
            const data = req.body
            const id_user = req.params.id
            const user = await User.updateUser(data, id_user)

            res.json(user)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/user/:id', Middleware.bearer, async(req, res, next) => {
        try {
            const id_user = req.params.id
            await User.deleteStatus(id_user)

            res.json(true)
        } catch (error) {
            next(error)
        }
    })
}
