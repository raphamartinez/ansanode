const User = require('../models/user')
const Middleware = require('../infrastructure/auth/middleware')
const History = require('../models/history')

module.exports = app => {

    app.get('/users', Middleware.bearer , async (req, res, next) => {

        try {
            const users = await User.listUsers()

            History.insertHistory(`Listado de usuarios.`, req.login.id_login)

            res.json(users)
        } catch (error) {
            next(error)
        }
    }) 

    app.get('/user/:id', Middleware.bearer, async (req, res, next) => {
        try {
            const id_user = req.params.id

            const user = await User.viewUser(id_user)

            History.insertHistory(`Visto el usuario ${user.name}.`, req.login.id_login)

            res.json(user)
        } catch (error) {
            next(error)
        }
    })

    app.post('/user', Middleware.bearer, async (req, res, next) => {
        try {
            const data = req.body
            const result = await User.insertUser(data)

            History.insertHistory(`Adición de usuario ${data.user.name}.`, req.login.id_login)

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

            History.insertHistory(`Actualización de datos - ${data.user.name}.`, req.login.id_login)

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
