const User = require('../models/user')
const Middleware = require('../infrastructure/auth/middleware')
const History = require('../models/history')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/usuarios', [Middleware.authenticatedMiddleware, Authorization('user', 'read')], async (req, res, next) => {
        try {
            res.render('users')
        } catch (err) {
            next(err)
        }
    })


    app.get('/users/:perfil?', [Middleware.authenticatedMiddleware, Authorization('user', 'read')], async (req, res, next) => {
        try {
            let id;
            let users;
            let offices = req.login.offices
            let perfil = req.params.perfil
            History.insertHistory(`Listado de usuarios.`, req.login.id_login)

            if (req.access.all.allowed) {
                users = await User.listUsers(perfil, false, false)
            } else {
                if (req.login.perfil == 4) {
                    offices = offices.map(of => {
                        return of.code
                    })

                    users = await User.listUsers(perfil, id, offices)
                } else {
                    users = await User.listUsers(perfil, req.login.id_login)
                }
            }
            res.json(users)
        } catch (err) {
            next(err)
        }
    })

    app.get('/user/:id_login?', [Middleware.authenticatedMiddleware, Authorization('user', 'read')], async (req, res, next) => {
        try {
            let id = req.params.id_login
            if (!id) id = req.login.id_login

            const user = await User.view(id)

            History.insertHistory(`Visto el usuario ${user.name}.`, id)

            res.render('user', {
                user,
                id
            })
        } catch (err) {
            next(err)
        }
    })

    app.post('/user', [Middleware.authenticatedMiddleware, Authorization('user', 'create')], async (req, res, next) => {
        try {
            const data = req.body
            const user = await User.insertUser(data)

            History.insertHistory(`Adición de usuario ${data.user.name}.`, req.login.id_login)

            res.status(201).json({ msg: 'Usuario agregado con éxito.', user })
        } catch (err) {
            next(err)
        }
    })

    app.post('/user/update/:id', [Middleware.authenticatedMiddleware, Authorization('user', 'update')], async (req, res, next) => {
        try {
            const data = req.body
            const id = req.params.id

            await User.updateUser(data, id)

            History.insertHistory(`Actualización de datos - ${data.name}.`, req.login.id_login)

            res.redirect(`/user/${req.params.id}`)
        } catch (err) {
            next(err)
        }
    })

    app.post('/user/delete/:id_login', [Middleware.authenticatedMiddleware, Authorization('user', 'delete')], async (req, res, next) => {
        try {
            await User.deleteStatus(req.params.id_login)

            res.redirect('/usuarios')
        } catch (err) {
            next(err)
        }
    })
}
