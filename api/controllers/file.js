const File = require('../models/file')
const Middleware = require('../infrastructure/auth/middleware')
const multer = require('multer')
const multerConfig = require('../config/multer')
const History = require('../models/history')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.post('/file', [Middleware.authenticatedMiddleware, Authorization('file', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file
            const details = req.body

            const id_file = await File.save(file, details, req.login.id_login)

            History.insertHistory(`Carga de archivo realizada - ${details.title}.`, req.login.id_login)
            const newfile = await File.view(id_file)

            cachelist.delPrefix('file')

            res.json(newfile)
        } catch (err) {
            next(err)
        }
    })

    app.post('/fileoffice', [Middleware.authenticatedMiddleware, Authorization('file', 'create')], async (req, res, next) => {
        try {
            const data = req.body.obj

            const id_file = await File.saveoffice(data, req.login.id_login)

            History.insertHistory(`Carga de archivo realizada - ${data.title}.`, req.login.id_login)
            const newfile = await File.view(id_file)

            cachelist.delPrefix('file')

            res.json(newfile)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/file/:id_file', [Middleware.authenticatedMiddleware, Authorization('file', 'delete')], async (req, res, next) => {
        try {
            const id_file = req.params.id_file

            await File.delete(id_file)

            History.insertHistory(`Archivo - ${file.title} eliminado!`, req.login.id_login)

            cachelist.delPrefix('file')

            res.json({msg: 'Archivo eliminado con éxito.'})
        } catch (err) {
            next(err)
        }
    })

    app.get('/files/:type/:title', [Middleware.authenticatedMiddleware, Authorization('file', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`file:${JSON.stringify(req.params)}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const file = {
                type: req.params.type,
                title: req.params.title
            }

            const files = await File.list(file, req.login.id_login)
            cachelist.addCache(`file:${JSON.stringify(req.params)}`, JSON.stringify(files), 60 * 60 * 12)

            res.json(files)
        } catch (err) {
            next(err)
        }
    })

    app.get('/file/:id_file', [Middleware.authenticatedMiddleware, Authorization('file', 'read')], async (req, res, next) => {
        try {
            const id_file = req.params.id_file

            const file = await File.view(id_file)

            History.insertHistory(`Vista previa del documento ${file.title}.`, req.login.id_login)

            res.json(file.path)
        } catch (err) {
            next(err)
        }
    })
}