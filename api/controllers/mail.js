const Mail = require('../models/mailpowerbi')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {


    app.get('/mails', [Middleware.bearer, Authorization('mail', 'read')], async (req, res, next) => {

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


    app.get('/mail/:id_mailpowerbi', [Middleware.bearer, Authorization('mail', 'read')], async (req, res, next) => {
        try {
            const id_mailpowerbi = req.params.id_mailpowerbi
            const mail = await Mail.viewMail(id_mailpowerbi)

            res.json(mail)
        } catch (err) {
            next(err)
        }
    })

    app.post('/mail', [Middleware.bearer, Authorization('mail', 'create')], async (req, res, next) => {
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

    app.post('/attachment', [Middleware.bearer, Authorization('mail', 'create')], async (req, res, next) => {
        try {
            const attachment = req.body.attachment
            const result = await Mail.insertMailAttachment(attachment.urls, attachment.id_mailpowerbi)

            res.status(201).send(result)
        } catch (err) {
            next(err)
        }
    })

    app.post('/scheduling', [Middleware.bearer, Authorization('mail', 'create')], async (req, res, next) => {
        try {
            const scheduling = req.body.scheduling
            const result = await Mail.insertMailScheduling(scheduling.schedule, scheduling.id_mailpowerbi)

            res.status(201).send(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/mail/:id_mailpowerbi', [Middleware.bearer, Authorization('mail', 'update')], async (req, res, next) => {

        try {
            const id_mailpowerbi = req.params.id_mailpowerbi
            const data = req.body

            data.id_mailpowerbi = id_mailpowerbi

            await Mail.updateMailPowerBi(data)
            res.json()
        } catch (err) {
            next(err)
        }
    })

    app.put('/attachment/:id_mailattachment', [Middleware.bearer, Authorization('mail', 'update')], async (req, res, next) => {

        try {
            const id_mailattachment = req.params.id_mailattachment
            const data = req.body

            data.id_mailattachment = id_mailattachment

            await Mail.updateMailAttachment(data)

            res.json()
        } catch (err) {
            next(err)
        }
    })

    app.delete('/mail/:id_mailpowerbi', [Middleware.bearer, Authorization('mail', 'delete')], async (req, res, next) => {
        try {
            const id_mailpowerbi = req.params.id_mailpowerbi
            const result = await Mail.deleteMailPowerBi(id_mailpowerbi)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/attachment/:id_mailattachment', [Middleware.bearer, Authorization('mail', 'delete')], async (req, res, next) => {
        try {
            const id_mailattachment = req.params.id_mailattachment
            const result = await Mail.deleteMailAttachment(id_mailattachment)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/scheduling/:id_mailscheduling', [Middleware.bearer, Authorization('mail', 'delete')], async (req, res, next) => {
        try {
            const id_mailscheduling = req.params.id_mailscheduling
            const result = await Mail.deleteMailScheduling(id_mailscheduling)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}
