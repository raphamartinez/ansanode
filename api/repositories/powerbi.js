const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class PowerBi {
    async insert(powerbi) {
        try {

            const sql = 'INSERT INTO ansa.powerbi (url, title, type, dateReg) values (?, ?, ?, now() - interval 4 hour )'
            await query(sql, [powerbi.url, powerbi.title, powerbi.type])

            const sqlId = 'select LAST_INSERT_ID() as id_powerbi from ansa.powerbi LIMIT 1'
            const obj = await query(sqlId)
            const sqlView = 'INSERT INTO ansa.viewpowerbi (id_powerbi, id_login, dateReg) values ( ?, ?, now() - interval 4 hour )'
            await query(sqlView, [obj[0].id_powerbi, powerbi.id_login])

            return true
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
            const sql = `SELECT US.name, BI.id_powerbi, BI.title, BI.url FROM ansa.powerbi BI, ansa.viewpowerbi VB, ansa.login LO, ansa.user US WHERE VB.id_powerbi = BI.id_powerbi and LO.id_login = VB.id_login and US.id_login = LO.id_login`
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