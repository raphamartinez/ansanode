const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('../models/error')

class History {
    async insert(history) {
        try {
            const sql = 'INSERT INTO history (description, status, dateReg, id_login) values (?, 1, now() - interval 4 hour , ?)'
            await query(sql, [history.description, history.id_login])
            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el historial en la base de datos')
        }
    }

    list(id_login) {
        try {
            let sql = `SELECT HI.id_history, HI.description, DATE_FORMAT(HI.dateReg, '%H:%i %d/%m/%Y') as dateReg, US.name 
            FROM history HI, user US WHERE US.id_login = HI.id_login and 
            HI.status = 1 `

            if(id_login) sql+= `and HI.id_login = ${id_login} `
           
           sql+= ` ORDER BY HI.id_history DESC`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar historial')
        }
    }

    async count(id_login) {
        try {
            let sql = `SELECT COUNT(id_history) as count 
            FROM history 
            WHERE dateReg > DATE_ADD(now() - interval 4 hour , INTERVAL -1 DAY) `
            
            if(id_login) sql += ` AND id_login = ${id_login} `

            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede enumerar el número de vistas')
        }
    }

    async lastAccess(id_login) {
        try {
            let sql = `SELECT us.name, DATE_FORMAT(hi.dateReg, '%H:%i %d/%m/%Y') as time  
            FROM user us
            INNER JOIN history hi ON us.id_login = hi.id_login `
            
            if(id_login) sql += ` WHERE us.id_login = ${id_login} `

            sql+= `ORDER BY hi.dateReg DESC LIMIT 1`

            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar el último acceso')
        }
    }
}

module.exports = new History()