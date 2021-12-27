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

    // async listExpectedSalesByManager(id_login) {
    //     try {

    //         let sql = `SELECT SA.name, SA.id_salesman,  sum(GO.amount) as amount, sum(GO.amount * PR.price) AS expected
    //         FROM ansa.goalline GL
    //         INNER JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
    //         INNER JOIN ansa.salesman SA ON SA.id_salesman = GO.id_salesman
    //         INNER JOIN ansa.itemprice PR ON GL.itemcode = PR.code
    //         WHERE GL.application <> "DESCONSIDERAR"
    //         AND SA.id_login = ?
    //         AND GO.amount > 0
    //         AND GL.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
    //         GROUP BY SA.name`

    //         const data = await query(sql, id_login)
    //         return data

    //     } catch (error) {
    //         throw new InternalServerError('No se pudieron enumerar las sucursais')
    //     }
    // }
}

module.exports = new ItemPrice()