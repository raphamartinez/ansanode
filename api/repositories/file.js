const query = require('../infrastructure/database/queries')

class File {
    insert(file, details, id_login) {
        console.log(id_login);
        const sql = 'INSERT INTO ansa.file (title, description, filename, mimetype, path, type, size, id_login, datereg) values (?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
        return query(sql, [details.title, details.description ,file.filename, file.mimetype, file.path, details.type, file.size, id_login])
    }

    delete(id_file) {
        const sql = `DELETE from ansa.file WHERE id_file = ${id_file}`
        return query(sql)
    }

    update(file, id_file) {
        const sql = 'UPDATE ansa.file SET type = ? WHERE id_file = ?'
        return query(sql, [file, id_file])
    }

    view(id_file) {
        const sql = `SELECT * FROM file where id_file = ${id_file}`
        return query(sql)
    }

    list() {
        const sql = 'SELECT * FROM file'
        return query(sql)
    }
}

module.exports = new File()