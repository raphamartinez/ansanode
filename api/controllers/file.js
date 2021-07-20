const File = require('../models/file')
const Middleware = require('../infrastructure/auth/middleware')
const multer = require('multer')
const multerConfig = require('../config/multer')
const History = require('../models/history')

module.exports = app => {

    app.post('/file', Middleware.bearer, multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file
            const details = req.body

            const id_file = await File.save(file, details, req.login.id_login)

            History.insertHistory(`Carga de archivo realizada - ${details.title}.`, req.login.id_login)
            const newfile = await File.view(id_file)

            res.json(newfile)
        } catch (error) {
            next(error)
        }
    })

    app.post('/fileoffice', Middleware.bearer, async (req, res, next) => {
        try {
            const data = req.body.obj

            const id_file = await File.saveoffice(data, req.login.id_login)

            History.insertHistory(`Carga de archivo realizada - ${data.title}.`, req.login.id_login)
            const newfile = await File.view(id_file)

            res.json(newfile)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/file/:id_file', Middleware.bearer, async (req, res, next) => {
        try {
            const id_file = req.params.id_file

            const file = await File.delete(id_file)

            History.insertHistory(`Archivo - ${file.title} eliminado!`, req.login.id_login)

            res.json()
        } catch (error) {
            next(error)
        }
    })

    app.get('/files/:type/:title', Middleware.bearer, async (req, res, next) => {
        try {

            const file = {
                type: req.params.type,
                title: req.params.title
            }

            const files = await File.list(file,req.login.id_login)

            res.json(files)
        } catch (error) {
            next(error)
        }
    })

    app.get('/file/:id_file', Middleware.bearer, async (req, res, next) => {
        try {
            const id_file = req.params.id_file

            const file = await File.view(id_file)

            History.insertHistory(`Vista previa del documento ${file.title}.`, req.login.id_login)

            res.json(file.path)
        } catch (error) {
            next(error)
        }
    })
}