const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class PowerBi {
    async insert(powerbi) {
        try {
            const sql = 'INSERT INTO ansa.powerbi (url, title, type, description, dateReg) values (?, ?, ?, ?, now() - interval 3 hour )'
            await query(sql, [powerbi.url, powerbi.title, powerbi.type, powerbi.description])

            const sqlid = 'SELECT LAST_INSERT_ID() AS id_powerbi FROM ansa.powerbi LIMIT 1'
            const obj = await query(sqlid)

            return obj[0].id_powerbi
        } catch (error) {
            throw new InvalidArgumentError('El powerbi no se pudo insertar en la base de datos')
        }
    }

    list() {
        try {
            const sql = `SELECT id_powerbi, url, type, token, idreport, dateReg FROM ansa.powerbi `
            return query(sql)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    listLoginType(id_login, type) {
        try {
            const sql = `SELECT BI.id_powerbi, BI.title, BI.url, BI.type as typedesc, BI.type, BI.token, BI.idreport, DATE_FORMAT(BI.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.powerbi BI, ansa.viewpowerbi VB WHERE VB.id_powerbi = BI.id_powerbi and VB.id_login = ${id_login} and BI.type = ${type}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    listLogin(id_login, type) {
        try {
            const sql = `SELECT BI.id_powerbi, BI.title, BI.url, BI.type as typedesc, BI.type, BI.token, BI.idreport, DATE_FORMAT(BI.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.powerbi BI, ansa.viewpowerbi VB WHERE VB.id_powerbi = BI.id_powerbi and VB.id_login = ${id_login}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    listBis() {
        try {
            const sql = `SELECT BI.id_powerbi, BI.type, BI.type as typedesc, BI.title, BI.description, BI.url, DATE_FORMAT(BI.dateReg, '%H:%i %d/%m/%Y') as dateReg, 
            count(VB.id_powerbi) as count
            FROM ansa.powerbi BI 
            LEFT JOIN ansa.viewpowerbi VB ON VB.id_powerbi = BI.id_powerbi
            group by BI.id_powerbi 
            ORDER BY BI.dateReg DESC`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    async delete(id_powerbi) {
        try {

            const sqlView = `DELETE from ansa.viewpowerbi WHERE id_powerbi = ${id_powerbi}`
            await query(sqlView)

            const sql = `DELETE from ansa.powerbi WHERE id_powerbi = ${id_powerbi}`
            await query(sql)

            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi en la base de datos')
        }
    }

    async count(id_login) {
        try {

            const sql = `SELECT COUNT(id_viewpowerbi) as count FROM ansa.viewpowerbi WHERE id_login = ${id_login}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede enumerar el número de powerbi')
        }
    }

    async update(powerbi) {
        try {
            const sql = 'UPDATE ansa.powerbi SET url = ?, type = ?, title = ?, token = ?, idreport = ? WHERE id_powerbi = ?'
            const result = await query(sql, [powerbi.url, powerbi.type, powerbi.title, powerbi.token, powerbi.idreport, powerbi.id_powerbi])
            return true
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_powerbi) {
        try {
            const sql = `SELECT id_powerbi, url, type, token, idreport, dateReg FROM ansa.powerbi WHERE id_powerbi = ${id_powerbi}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del powerbi')
        }
    }
}

module.exports = new PowerBi()