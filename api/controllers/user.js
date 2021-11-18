const User = require('../models/user')
const Middleware = require('../infrastructure/auth/middleware')
const History = require('../models/history')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/users', [Middleware.bearer, Authorization('user', 'read')], async (req, res, next) => {
        try {
            const users = await User.listUsers()

            History.insertHistory(`Listado de usuarios.`, req.login.id_login)
            res.json(users)
        } catch (err) {
            next(err)
        }
    })

    app.get('/user/:id_login', [Middleware.bearer, Authorization('user', 'read')], async (req, res, next) => {
        try {
            const user = await User.viewUserAdm(req.params.id_login)

            History.insertHistory(`Visto el usuario ${user.name}.`, req.params.id_login)
            res.json(user)
        } catch (err) {
            next(err)
        }
    })

    app.post('/user', [Middleware.bearer, Authorization('user', 'create')], async (req, res, next) => {
        try {
            const data = req.body
            const user = await User.insertUser(data)

            History.insertHistory(`Adición de usuario ${data.user.name}.`, req.login.id_login)

            res.status(201).json({ msg: 'Usuario agregado con éxito.', user })
        } catch (err) {
            next(err)
        }
    })

    app.put('/user/:id', [Middleware.bearer, Authorization('user', 'update')], async (req, res, next) => {
        try {
            const data = req.body
            const id_user = req.params.id
            await User.updateUser(data, id_user)

            History.insertHistory(`Actualización de datos - ${data.user.name}.`, req.login.id_login)

            res.json({ msg: 'Usuario actualizado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/user/:id_login', [Middleware.bearer, Authorization('user', 'delete')], async (req, res, next) => {
        try {
            await User.deleteStatus(req.params.id_login)

            res.json({ msg: 'Usuario eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}
