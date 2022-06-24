const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class File {
    async insert(file, details, id_login) {
        try {
            const sql = 'INSERT INTO file (title, description, filename, mimetype, path, type, size, id_login, datereg) values (?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
            const result = await query(sql, [details.title, details.description, file.filename, file.mimetype, file.path, details.type, file.size, id_login])

            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    async insertoffice(data, id_login) {
        try {
            const sql = 'INSERT INTO file (title, description, mimetype, path, type, id_login, datereg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
            const result = await query(sql, [data.title, data.description, data.mimetype, data.path, data.type, id_login])

            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo office en la base de datos')
        }
    }

    delete(id_file) {
        try {
            const sql = `DELETE from file WHERE id_file = ${id_file}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    update(file, id_file) {
        try {
            const sql = 'UPDATE file SET type = ? WHERE id_file = ?'
            return query(sql, [file, id_file])
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_file) {
        try {
            const sql = `SELECT * FROM file where id_file = ${id_file}`
            const result = await query(sql)

            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del archivo')
        }
    }

    list(file) {
        try {
            let sql = `SELECT DATE_FORMAT(datereg, '%H:%i %d/%m/%Y') as datereg, path, size, id_login, type, title, description, mimetype, filename, id_file FROM file
            WHERE mimetype <> "" `

            if (file.type) sql += `AND type = ${file.type} `
            if (file.title) sql += `AND title LIKE '%${file.title}%' `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }
}

module.exports = new File()