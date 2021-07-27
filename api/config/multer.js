const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, callback) => {
            crypto.randomBytes(16,(err, hash) => {
                if(err) callback(err)

                const name = `${hash.toString('hex')}-${file.originalname}`

                callback(null, name)
            })
        }
    }),
    limits: {
        fileSize: 200 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/svg+xml',
            'video/mp4',
            'video/webm',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',,
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',,
            'application/msword',
            'text/plain'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error('Tipo de archivo invalido'))
        }
    },
}