const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Mail {
    async insertMail(mail) {
        try {
            const sql = 'INSERT INTO ansa.mailpowerbi (recipients, cc, cco, title, body, type, datereg) values (?, ?, ?, ?, ?, ?,  now() - interval 4 hour )'
            await query(sql, [mail.for, mail.cc, mail.cco, mail.title, mail.body, mail.type])

            const result = await query("Select LAST_INSERT_ID() as id_mailpowerbi from ansa.mailpowerbi LIMIT 1")

            return result[0].id_mailpowerbi
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    async insertAttachment(attachment, id_mailpowerbi) {
        try {
            const sql = 'INSERT INTO ansa.mailattachment (url, id_mailpowerbi) values (?, ?)'
            const result = await query(sql, [attachment, id_mailpowerbi])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo office en la base de datos')
        }
    }

    async insertScheduling(formatDate, id_mailpowerbi) {
        try {
            const sql = 'INSERT INTO ansa.mailscheduling (date, id_mailpowerbi) values (?, ?)'
            const result = await query(sql, [formatDate, id_mailpowerbi])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo office en la base de datos')
        }
    }

    async deleteMail(id_mailpowerbi) {
        try {
            const sqlattachment = `DELETE from ansa.mailattachment WHERE id_mailpowerbi = ${id_mailpowerbi} `
            await query(sqlattachment)

            const sqlscheduling = `DELETE from ansa.mailscheduling WHERE id_mailpowerbi = ${id_mailpowerbi} `
            await query(sqlscheduling)

            const sql = `DELETE from ansa.mailpowerbi WHERE id_mailpowerbi = ${id_mailpowerbi}`
            return query(sql)

        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    deleteAttachment(id_mailattachment) {
        try {
            const sql = `DELETE from ansa.mailattachment WHERE id_mailattachment = ${id_mailattachment}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    deleteScheduling(id_mailscheduling) {
        try {
            const sql = `DELETE from ansa.mailscheduling WHERE id_mailscheduling = ${id_mailscheduling}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    updateMail(mailpowerbi) {
        try {
            const sql = 'UPDATE ansa.mailpowerbi SET recipients = ?, cc = ?, cco = ?, title = ?, body = ?, type = ? WHERE id_mailpowerbi = ?'
            return query(sql, [mailpowerbi.recipients, mailpowerbi.cc, mailpowerbi.cco, mailpowerbi.title, mailpowerbi.body, mailpowerbi.type, mailpowerbi.id_mailpowerbi])
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    updateAttachment(attachment) {
        try {
            const sql = 'UPDATE ansa.mailattachment SET url = ? WHERE id_mailattachment = ?'
            return query(sql, [attachment.url, attachment.id_mailattachment])
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    listMail() {
        try {
            let sql = `SELECT MA.id_mailpowerbi, MA.recipients, MA.cc, MA.cco, MA.title, MA.body, DATE_FORMAT(MA.datereg, '%H:%i %d/%m/%Y') as datereg, COUNT(MT.id_mailattachment) as countatt
            FROM ansa.mailpowerbi MA
            LEFT JOIN ansa.mailattachment MT ON MA.id_mailpowerbi = MT.id_mailpowerbi
            GROUP BY MA.id_mailpowerbi`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }

    async listMailtoSend(now, nowLater) {
        try {
            let sql = `SELECT MA.id_mailpowerbi, MA.type, MA.recipients, MA.cc, MA.cco, MA.title, MA.body, DATE_FORMAT(MA.datereg, '%H:%i %d/%m/%Y') as datereg, COUNT(MT.id_mailattachment) as countatt
            FROM ansa.mailpowerbi MA
            LEFT JOIN ansa.mailattachment MT ON MA.id_mailpowerbi = MT.id_mailpowerbi
            LEFT JOIN ansa.mailscheduling MS ON MA.id_mailpowerbi = MS.id_mailpowerbi
            WHERE MS.date between ? AND ?
            GROUP BY MA.id_mailpowerbi`
            const result = await query(sql, [now, nowLater])

            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }

    viewMail(id_mailpowerbi) {
        try {
            let sql = `SELECT * FROM mailpowerbi WHERE id_mailpowerbi = ${id_mailpowerbi}`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }

    listAttachment(id_mailpowerbi) {
        try {
            let sql = `SELECT * FROM mailattachment WHERE id_mailpowerbi = ${id_mailpowerbi}`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }

    listScheduling(id_mailpowerbi) {
        try {
            let sql = `SELECT DATE_FORMAT(date, '%H:%i %d/%m/%Y') as date, id_mailscheduling FROM mailscheduling WHERE id_mailpowerbi = ${id_mailpowerbi}`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }
}

module.exports = new Mail()