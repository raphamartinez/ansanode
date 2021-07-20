const query = require('../infrastructure/database/queries')

class File {
    async insert(file, details, id_login) {
        const sql = 'INSERT INTO ansa.file (title, description, filename, mimetype, path, type, size, id_login, datereg) values (?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
        await query(sql, [details.title, details.description, file.filename, file.mimetype, file.path, details.type, file.size, id_login])

        const result = await query("Select LAST_INSERT_ID() as id_file from ansa.file LIMIT 1")

        return result[0].id_file
    }

    delete(id_file) {
        const sql = `DELETE from ansa.file WHERE id_file = ${id_file}`
        return query(sql)
    }

    update(file, id_file) {
        const sql = 'UPDATE ansa.file SET type = ? WHERE id_file = ?'
        return query(sql, [file, id_file])
    }

    async view(id_file) {
        const sql = `SELECT * FROM file where id_file = ${id_file}`
        const result = await query(sql)

        return result[0]
    }

    list(file) {
        let sql = `SELECT DATE_FORMAT(datereg, '%H:%i %d/%m/%Y') as datereg, path, size, id_login, type, title, description, mimetype, filename, id_file FROM file
        WHERE filename <> "" `

        if (file.type) sql += `AND type = ${file.type} `
        if (file.title) sql += `AND title LIKE '%${file.title}%' `

        return query(sql)
    }
}

module.exports = new File()