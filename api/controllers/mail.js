const Mail = require('../models/mailpowerbi')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {


    app.get('/mails', [Middleware.authenticatedMiddleware, Authorization('mail', 'read')], async (req, res, next) => {

        try {
            let mails
            if (req.access.all.allowed) {
                mails = await Mail.listMailPowerBi()
            } else {
                mails = await Mail.listMailPowerBi(req.login.id_login)
            }

            res.json(mails)
        } catch (err) {
            next(err)
        }
    })


    app.get('/mail/:id_mailpowerbi', [Middleware.authenticatedMiddleware, Authorization('mail', 'read')], async (req, res, next) => {
        try {
            const id_mailpowerbi = req.params.id_mailpowerbi
            const mail = await Mail.viewMail(id_mailpowerbi)

            res.json(mail)
        } catch (err) {
            next(err)
        }
    })

    app.post('/mail', [Middleware.authenticatedMiddleware, Authorization('mail', 'create')], async (req, res, next) => {
        try {
            const mail = req.body.mailschedule
            const id_mailpowerbi = await Mail.insertMailPowerBi(mail, req.login.id_login)
            await Mail.insertMailAttachment(mail.attachment, id_mailpowerbi)
            await Mail.insertMailScheduling(mail.schedule, id_mailpowerbi)

            res.status(201).json(id_mailpowerbi)
        } catch (err) {
            next(err)
        }
    })

    app.post('/attachment', [Middleware.authenticatedMiddleware, Authorization('mail', 'create')], async (req, res, next) => {
        try {
            const attachment = req.body.attachment
            const id = await Mail.insertMailAttachment(attachment.urls, attachment.id_mailpowerbi)

            res.status(201).send({ id, msg: 'Archivo adjunto agregado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.post('/scheduling', [Middleware.authenticatedMiddleware, Authorization('mail', 'create')], async (req, res, next) => {
        try {
            const scheduling = req.body.scheduling
            const id = await Mail.insertMailScheduling(scheduling.schedule, scheduling.id_mailpowerbi)

            res.status(201).send({ id, msg: 'Programación de fecha agregada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.put('/mail/:id_mailpowerbi', [Middleware.authenticatedMiddleware, Authorization('mail', 'update')], async (req, res, next) => {

        try {
            const id_mailpowerbi = req.params.id_mailpowerbi
            const data = req.body

            data.id_mailpowerbi = id_mailpowerbi

            await Mail.updateMailPowerBi(data)
            res.json({ msg: 'Email actualizado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.put('/attachment/:id_mailattachment', [Middleware.authenticatedMiddleware, Authorization('mail', 'update')], async (req, res, next) => {

        try {
            const id_mailattachment = req.params.id_mailattachment
            const data = req.body

            data.id_mailattachment = id_mailattachment

            await Mail.updateMailAttachment(data)

            res.json({ msg: 'Archivo adjunto con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/mail/:id_mailpowerbi', [Middleware.authenticatedMiddleware, Authorization('mail', 'delete')], async (req, res, next) => {
        try {
            const id_mailpowerbi = req.params.id_mailpowerbi
            await Mail.deleteMailPowerBi(id_mailpowerbi)
            
            res.json({ msg: 'Email eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/attachment/:id_mailattachment', [Middleware.authenticatedMiddleware, Authorization('mail', 'delete')], async (req, res, next) => {
        try {
            const id_mailattachment = req.params.id_mailattachment
            await Mail.deleteMailAttachment(id_mailattachment)

            res.json({ msg: 'Archivo anexo eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/scheduling/:id_mailscheduling', [Middleware.authenticatedMiddleware, Authorization('mail', 'delete')], async (req, res, next) => {
        try {
            const id_mailscheduling = req.params.id_mailscheduling
            await Mail.deleteMailScheduling(id_mailscheduling)

            res.json({ msg: 'Programación de fecha eliminada con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}
