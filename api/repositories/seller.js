const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Seller {

    async insert(salesman) {
        try {
            const sql = 'INSERT INTO salesman (code, name, office, dateReg) values (?, ?, ?, now() - interval 4 hour )'
            const result = await query(sql, [salesman.code, salesman.name, salesman.office])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async delete(id_salesman) {
        try {
            const sql = `DELETE from salesman WHERE id_salesman = ${id_salesman}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }


    async update(manager) {
        try {
            const sql = `UPDATE ansa.salesman set id_login = ? WHERE id_salesman = ?`
            const result = await query(sql, [manager.id_login, manager.id_salesman])
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    list(id_login) {
        try {
            let sql = `SELECT US.name as manager, SA.id_salesman, SA.code, SA.name, SA.office, DATE_FORMAT(SA.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.salesman SA
            LEFT JOIN ansa.login LO ON SA.id_login = LO.id_login 
            LEFT JOIN ansa.user US ON LO.id_login = US.id_login `

            if (id_login) sql += `WHERE LO.id_login = ${id_login}`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async view(id_salesman) {
        try {
            let sql = `SELECT US.name as manager, SA.id_salesman, SA.code, SA.name, SA.office, DATE_FORMAT(SA.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.salesman SA
            LEFT JOIN ansa.login LO ON SA.id_login = LO.id_login 
            LEFT JOIN ansa.user US ON LO.id_login = US.id_login `

            if (id_salesman) sql += `WHERE SA.id_salesman = ${id_salesman}`

            const data = await query(sql)
            return data[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Seller()