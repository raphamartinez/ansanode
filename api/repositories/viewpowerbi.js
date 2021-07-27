const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class ViewPowerBi {
    async insert(viewpowerbi) {
        try {
            const sql = 'INSERT INTO ansa.viewpowerbi (id_powerbi, id_login, dateReg) values (?, ?, now() - interval 4 hour )'
            const result = query(sql, [viewpowerbi.id_powerbi, viewpowerbi.id_login])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo powerbi el archivo office en la base de datos')
        }
    }

    list() {
        try {
            const sql = `SELECT id_viewpowerbi, id_powerbi, id_login, dateReg FROM viewpowerbi `
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi')
        }
    }

    async delete(id_viewpowerbi) {
        try {
            const sql = `DELETE from viewpowerbi WHERE id_viewpowerbi = ${id_viewpowerbi}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi en la base de datos')
        }
    }
}

module.exports = new ViewPowerBi()