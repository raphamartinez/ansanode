const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class ProsegurUser {

    async insert(user) {
        try {
            const sql = "INSERT INTO ansa.prosegurusers (code, name, office, orden, phone, contract, datereg) values ( ?, ?, ?, ?, ?, ?, now() - interval 3 hour )"
            const result = await query(sql, [user.code, user.name, user.office, user.orden, user.phone, user.contract])

            return result.insertId
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el historial en la base de datos')

        }
    }

    async list(office) {
        try {
            let sql = `SELECT * FROM ansa.prosegurusers `

            if (office) sql += ` WHERE office = '${office}' `
            const result = await query(sql)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el historial de webscraping')
        }
    }

    async listProsegur(office, period, type) {

        try {
            let sql = `SELECT * FROM ansa.proseguroffice 
            WHERE id_proseguroffice > 0 `

            if (office && office.length > 0 && office != "ALL" && office[0] != "") sql += ` AND office IN (${office}) `
            if (period) sql += ` AND date BETWEEN '${period.start}' and '${period.end}' `
            if (type != "ALL") sql += ` AND type IN ('${type}') `

            sql+= ` ORDER BY date DESC`

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el historial de webscraping')
        }
    }

    async drop(id) {
        try {
            const sql = `DELETE FROM ansa.prosegurusers WHERE id = ?`
            const result = await query(sql, id)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el historial de webscraping')
        }
    }
}

module.exports = new ProsegurUser()