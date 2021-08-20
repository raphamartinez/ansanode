const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Goal {

    async insert(goal) {
        try {
            const sql = 'INSERT INTO ansa.goal (id_goalline, id_salesman, amount) values (?, ?, ?)'
            const result = await query(sql, [goal.id_goalline, goal.id_salesman, goal.amount])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async update(goal) {
        try {
            const sql = 'UPDATE ansa.goal SET amount = ? WHERE id_goal = ?'
            const result = await query(sql, [goal.amount, goal.id_goal])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async validate(goal) {
        try {
            const sql = 'SELECT amount, id_goal FROM ansa.goal where id_goalline = ? and id_salesman = ?'
            const result = await query(sql, [goal.id_goalline, goal.id_salesman])

            return result[0]
        } catch (error) {

        }
    }


    list(goal) {
        try {
            const sql = `SELECT GL.itemgroup, GL.provider, GL.application, GL.labelname, GL.labelcode, GL.date, GO.amount
            FROM ansa.goalline GL
            LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
            ORDER BY GL.date`

            return query(sql, goal.date)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new Goal()