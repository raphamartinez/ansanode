const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Mail {
    async insertMail(mail, id_login) {
        try {
            const sql = 'INSERT INTO mailpowerbi (recipients, cc, cco, title, body, type, id_login, datereg) values (?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
            const result = await query(sql, [mail.for, mail.cc, mail.cco, mail.title, mail.body, mail.type, id_login])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    async insertAttachment(attachment, id_mailpowerbi) {
        try {
            const sql = 'INSERT INTO mailattachment (url, id_mailpowerbi) values (?, ?)'
            const result = await query(sql, [attachment, id_mailpowerbi])
            
            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo office en la base de datos')
        }
    }

    async insertScheduling(formatDate, id_mailpowerbi) {
        try {
            const sql = 'INSERT INTO mailscheduling (date, id_mailpowerbi) values (?, ?)'
            const result = await query(sql, [formatDate, id_mailpowerbi])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo office en la base de datos')
        }
    }

    async insertPeriod(weekday, mail) {
        try {
            const sql = 'INSERT INTO mailperiod (weekday, hour, datestart, dateend, id_mailpowerbi) values (?, ?, ?, LAST_DAY(?), ?)'
            const result = await query(sql, [weekday, mail.hour, `${mail.datestart}-01`, `${mail.dateend}-10`, mail.id_mailpowerbi])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el archivo office en la base de datos')
        }
    }

    async deleteMail(id_mailpowerbi) {
        try {
            const sqlattachment = `DELETE from mailattachment WHERE id_mailpowerbi = ? `
            await query(sqlattachment, id_mailpowerbi)

            const sqlscheduling = `DELETE from mailscheduling WHERE id_mailpowerbi = ? `
            await query(sqlscheduling, id_mailpowerbi)

            const sqlperiod = `DELETE from mailperiod WHERE id_mailpowerbi = ? `
            await query(sqlperiod, id_mailpowerbi)

            const sql = `DELETE from mailpowerbi WHERE id_mailpowerbi = ?`
            return query(sql, id_mailpowerbi)

        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    deleteAttachment(id_mailattachment) {
        try {
            const sql = `DELETE from mailattachment WHERE id_mailattachment = ${id_mailattachment}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    deleteScheduling(id_mailscheduling) {
        try {
            const sql = `DELETE from mailscheduling WHERE id_mailscheduling = ?`
            return query(sql, id_mailscheduling)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    updateMail(mailpowerbi) {
        try {
            const sql = 'UPDATE mailpowerbi SET recipients = ?, cc = ?, cco = ?, title = ?, body = ?, type = ? WHERE id_mailpowerbi = ?'
            return query(sql, [mailpowerbi.recipients, mailpowerbi.cc, mailpowerbi.cco, mailpowerbi.title, mailpowerbi.body, mailpowerbi.type, mailpowerbi.id_mailpowerbi])
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    updateAttachment(attachment) {
        try {
            const sql = 'UPDATE mailattachment SET url = ? WHERE id_mailattachment = ?'
            return query(sql, [attachment.url, attachment.id_mailattachment])
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    listMail(id_login) {
        try {
            let sql = `SELECT MA.id_mailpowerbi, MA.recipients, MA.cc, MA.cco, MA.title, MA.body, DATE_FORMAT(MA.datereg, '%H:%i %d/%m/%Y') as datereg, COUNT(MT.id_mailattachment) as countatt
            FROM mailpowerbi MA
            LEFT JOIN mailattachment MT ON MA.id_mailpowerbi = MT.id_mailpowerbi
            `

            if (id_login) sql += `WHERE MA.id_login = ${id_login} `

            sql += `GROUP BY MA.id_mailpowerbi`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }

    async listMailtoSend() {
        try {
            let sql = `SELECT ma.id_mailpowerbi, ma.type, ma.recipients, ma.cc, ma.cco, ma.title, ma.body, DATE_FORMAT(ma.datereg, '%H:%i %d/%m/%Y') as datereg, COUNT(mt.id_mailattachment) as countatt
            FROM mailpowerbi ma
            LEFT JOIN mailattachment mt ON ma.id_mailpowerbi = mt.id_mailpowerbi
            LEFT JOIN mailscheduling ms ON ma.id_mailpowerbi = ms.id_mailpowerbi
            LEFT JOIN mailperiod mp ON ma.id_mailpowerbi = mp.id_mailpowerbi
            WHERE (ms.date between now() - interval 4 hour AND now() - interval 2 hour) 
            OR ((date(now() - interval 4 hour) between date(mp.datestart) and date(mp.dateend)) AND WEEKDAY(now() - interval 4 hour) = mp.weekday AND hour(now() - interval 4 hour) = mp.hour)
            GROUP BY ma.id_mailpowerbi`
            const result = await query(sql)

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