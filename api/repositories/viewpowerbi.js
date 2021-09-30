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

    list(id_powerbi) {
        try {
            let sql = `SELECT vp.id_viewpowerbi, us.name 
            FROM viewpowerbi vp
            INNER JOIN user us ON vp.id_login = us.id_login `

            sql += `WHERE vp.id_powerbi = ${id_powerbi} `

            sql+= `GROUP BY vp.id_viewpowerbi
            ORDER BY vp.dateReg DESC`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi')
        }
    }

    async delete(id_viewpowerbi) {
        try {
            const sql = `DELETE from viewpowerbi WHERE id_viewpowerbi = ?`
            const result = await query(sql, id_viewpowerbi)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi en la base de datos')
        }
    }
}

module.exports = new ViewPowerBi()