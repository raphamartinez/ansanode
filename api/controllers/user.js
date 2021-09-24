const User = require('../models/user')
const Middleware = require('../infrastructure/auth/middleware')
const History = require('../models/history')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/users', [Middleware.bearer, Authorization('user', 'read')] , async ( req, res, next) => {

        try {
            const users = await User.listUsers()

            History.insertHistory(`Listado de usuarios.`, req.login.id_login)

            res.json(users)
        } catch (err) {
            next(err)
        }
    }) 

    app.get('/user/:id_login', [Middleware.bearer, Authorization('user', 'read')], async ( req, res, next) => {
        try {
            const id_login = req.params.id_login

            const user = await User.viewUserAdm(id_login)

            History.insertHistory(`Visto el usuario ${user.name}.`, id_login)

            res.json(user)
        } catch (err) {
            next(err)
        }
    })

    app.post('/user', [Middleware.bearer, Authorization('user', 'create')], async ( req, res, next) => {
        try {
            const data = req.body
            const result = await User.insertUser(data)

            History.insertHistory(`Adición de usuario ${data.user.name}.`, req.login.id_login)

            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/user/:id', [Middleware.bearer, Authorization('user', 'update')], async ( req, res, next) => {

        try {
            const data = req.body
            const id_user = req.params.id
            const user = await User.updateUser(data, id_user)

            History.insertHistory(`Actualización de datos - ${data.user.name}.`, req.login.id_login)

            res.json(user)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/user/:id_user', [Middleware.bearer, Authorization('user', 'delete')], async( req, res, next) => {
        try {
            const id_user = req.params.id_user
            await User.deleteStatus(id_user)

            res.json()
        } catch (err) {
            next(err)
        }
    })
}
