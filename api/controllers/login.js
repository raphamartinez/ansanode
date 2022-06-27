const Login = require('../models/login');
const Middleware = require('../infrastructure/auth/middleware');
const History = require('../models/history');
const path = require('path');
const passport = require('passport');

module.exports = app => {

    // app.all('/admin/*', Middleware.authenticatedMiddleware, async function (req, res, next) {
    //     try {
    //         next()
    //     } catch (err) {
    //         next(err)
    //     }
    // });

    app.get('/login', async function (req, res, next) {
        try {
            if (req.query.fail) {
                req.flash('error', '¡Nombre de usuario y/o contraseña inválido!');
                res.redirect('login');
            } else
                res.render('login');
        } catch (err) {
            next(err)
        }
    });

    app.get('/forgotPassword', async function (req, res, next) {
        try {
            res.render('forgotPassword');
        } catch (err) {
            next(err)
        }
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login?fail=true'
    }));

    app.get('/dashboard', async function (req, res, next) {
        try {
            let id_login = false;
            let id = false;

            if (req.session.passport) {
                id_login = req.session.passport.user;
            } else {
                id_login = req.login.id_login
            }

            const login = await Login.viewLogin(id_login);

            History.insertHistory('Acceso de usuario', id_login);

            if (req.login.perfil != 1) id = id_login;
            const { count, lastAccess } = await History.dashboard(id);


            switch (login.perfil) {
                case 6:
                    return res.redirect('cobranza');
                case 7:
                    return res.redirect('patrimonio');
                case 8:
                    return res.redirect('metas');
            }

            res.render('dashboard', {
                count,
                lastAccess,
                perfil: login.perfil,
                username: login.name
            });

        } catch (err) {
            res.redirect('login?fail=true')
        }
    });

    app.post('/salir', async function (req, res, next) {
        try {
            req.logout()
            res.redirect('/')
        } catch (err) {
            next(err)
        }

    });

    app.post('/insertLogin', Middleware.authenticatedMiddleware, async function (req, res, next) {
        try {
            const data = req.body
            await Login.insertLogin(data)
            res.sendFile('login.html', { root: path.join(__dirname, '../../views/public') });
        } catch (err) {
            next(err)
        }
    });

    app.post('/forgotPassword', async function (req, res, next) {
        try {
            const mailenterprise = req.body.mail
            const login = await Login.forgotPassword(mailenterprise)

            if (login) History.insertHistory('Solicitud de restablecimiento de contraseña', login.id_login)

            res.json({ url: '../', message: 'Correo electrónico de restablecimiento de contraseña enviado!' })
        } catch (err) {
            next(err)
        }
    });

    app.get('/newPassword/:token', async function (req, res, next) {
        try {
            res.render('password')
        } catch (err) {
            next(err)
        }
    });

    app.post('/resetPassword', async function (req, res, next) {
        try {
            const token = req.body.token
            const password = req.body.pass
            const id_login = await Login.changePassword(token, password)

            History.insertHistory('Contraseña alterada.', id_login)
            res.json({ url: '../', message: 'Contraseña alterada con éxito!' })
        } catch (err) {
            next(err)
        }
    });

    app.post('/refresh', async function (req, res, next) {
        try {
            const token = await Login.generateTokens(req.login.id_login)
            res.json({ refreshToken: token.refreshToken, accessToken: token.accessToken })
        } catch (err) {
            next(err)
        }
    });

    app.post('/changepass/:id_login', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const login = req.body
            const id_login = req.params.id_login

            await Login.updatePassword(login, id_login)

            History.insertHistory(`Contraseña alterada del login - ${login.id_login}`, req.login.id_login)

            res.redirect(`/user/${req.params.id_login}`)
        } catch (err) {
            next(err)
        }
    })
}