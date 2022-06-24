const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class ViewPowerBi {
    async insert(viewpowerbi) {
        try {
            const sql = 'INSERT INTO viewpowerbi (id_powerbi, id_login, dateReg) values (?, ?, now() - interval 4 hour )';
            const result = await query(sql, [viewpowerbi.id_powerbi, viewpowerbi.id_login]);
            
            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo powerbi el archivo office en la base de datos')
        }
    }

    list(id_powerbi) {
        try {
            let sql = `SELECT vp.id_viewpowerbi, us.name, vp.id_login
            FROM viewpowerbi vp
            INNER JOIN user us ON vp.id_login = us.id_login 
            WHERE vp.id_powerbi = ?
            GROUP BY vp.id_viewpowerbi
            ORDER BY vp.dateReg DESC`

            return query(sql, id_powerbi)
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