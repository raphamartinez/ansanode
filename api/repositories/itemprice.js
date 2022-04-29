const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class ItemPrice {

    async insert(item) {
        try {
            const sql = 'INSERT INTO ansa.itemprice (code, price) values (?, ?)'
            const result = await query(sql, [item.code, item.price])

            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el articulo en la base de datos')
        }
    }

    async update(item) {
        try {
            const sql = 'UPDATE ansa.itemprice SET price = ? WHERE code = ?'
            const result = await query(sql, [item.price, item.code])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    list(goal) {
        try {
            const sql = `SELECT * FROM ansa.itemprice`

            return query(sql, goal.date)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listHbs(goal) {
        try {
            const sql = `SELECT pr.ArtCode, MIN(pr.Price)
            FROM Price pr 
            Group BY pr.ArtCode
            ORDER BY pr.ArtCode
                  `

            return query(sql, goal.date)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new ItemPrice()