const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Stock {

    async insert(obj, id_login) {
        try {
            console.log(obj, id_login);
            const sql = 'INSERT INTO ansa.stock (name,id_login) values (?,?)'
            const result = await query(sql, [obj, id_login])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async delete(id_stock) {
        try {
            const sql = `DELETE from stock WHERE id_stock = ${id_stock}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    async update(stock) {
        try {
            const sql = 'UPDATE stock SET name = ?  WHERE id_stock = ?'
            const result = await query(sql, [stock.name, stock.id_stock])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    list(id_login) {
        try {
            const sql = `SELECT * FROM ansa.stock where id_login = ?`

            return query(sql, id_login)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Stock()