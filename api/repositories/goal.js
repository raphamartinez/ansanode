const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Goal {

    async insert(goal) {
        try {
            const sql = 'INSERT INTO ansa.goal (id_goalline, id_salesman, amount) values (?, ?, ?)';
            const result = await query(sql, [goal.id_goalline, goal.id_salesman, goal.amount]);

            return result.insertId;
        } catch (error) {
            console.log(error);
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

    async validate(id_goalline, id_salesman) {
        try {
            const sql = 'SELECT amount, id_goal FROM ansa.goal where id_goalline = ? and id_salesman = ?'
            const result = await query(sql, [id_goalline, id_salesman])

            return result[0]
        } catch (error) {
            return false
        }
    }

    async listSalesman(code) {
        try {
            const sql = 'SELECT id_salesman, office FROM ansa.salesman where code = ?'
            const result = await query(sql, [code])

            return result[0]
        } catch (error) {
            return false
        }
    }

    async search(obj) {
        try {
            const sql = 'SELECT id_goalline FROM ansa.goalline where itemcode = ? and date = ?'
            const result = await query(sql, [obj.itemcode, obj.date])

            return result[0].id_goalline;
        } catch (error) {
            return false
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

    async listGoalsByManager(id_login) {
        try {
            const sql = `SELECT sa.name, DATE_FORMAT(gl.date, '%m/%Y') as date, COUNT(go.amount) as goals, COUNT(gl.id_goalline) AS countlines 
            FROM ansa.salesman sa
            CROSS JOIN ansa.goalline gl
            LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
            WHERE sa.id_login = ?
            group by sa.code, gl.date
            order by gl.date asc`

            return query(sql, id_login)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    async listGoals(id_salesman, month, group) {
        try {
            let sql = `SELECT GL.itemgroup, SUM(GO.amount) as amount
            FROM ansa.goal GO
            LEFT JOIN ansa.goalline GL ON GO.id_goalline = GL.id_goalline 
            WHERE GL.application <> "DESCONSIDERAR"
            AND GO.id_salesman = ?
            AND GL.date BETWEEN ? AND LAST_DAY(?) `

            if (group) sql += ` AND GL.itemgroup = '${group}' `

            sql += ` 
            GROUP by GL.itemgroup
            ORDER BY GL.itemgroup ASC`

            const result = await query(sql, [id_salesman, `${month}-01`, `${month}-10`])

            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async listGoalsItem(id_salesman, month) {

        try {
            let sql = `SELECT GL.itemcode, GL.itemgroup, GL.itemname, SUM(GO.amount) as amount
            FROM ansa.salesman SA
            LEFT JOIN ansa.goal GO ON SA.id_salesman = GO.id_salesman
            LEFT JOIN ansa.goalline GL ON GO.id_goalline = GL.id_goalline 
            WHERE GL.application <> "DESCONSIDERAR"
            AND SA.id_salesman = ?
            AND GL.date BETWEEN ? AND LAST_DAY(?)
            GROUP by GL.itemcode
            ORDER BY GL.itemcode ASC`

            const result = await query(sql, [id_salesman, `${month}-01`, `${month}-10`])
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async listGoalsOffice(offices, month, group, id) {
        try {
            let sql = `SELECT GL.itemgroup, SUM(GO.amount) as amount
            FROM ansa.salesman SA 
            LEFT JOIN ansa.goal GO ON SA.id_salesman = GO.id_salesman
            LEFT JOIN ansa.goalline GL ON GO.id_goalline = GL.id_goalline 
            WHERE GL.application <> "DESCONSIDERAR"
            AND GL.date BETWEEN ? AND LAST_DAY(?) `

            if (group) sql += ` AND GL.itemgroup = '${group}' `
            if (id) sql += ` AND SA.id_salesman = '${id}' `
            if (offices) sql += ` AND SA.office IN (${offices}) `

            sql += ` 
            GROUP by GL.itemgroup
            ORDER BY GL.itemgroup ASC `

            const result = await query(sql, [`${month}-01`, `${month}-10`])
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async items(offices, month, group) {
        try {
            let sql = `SELECT GL.itemcode, GL.itemgroup, GL.itemname, SUM(GO.amount) as amount
            FROM ansa.salesman SA
            LEFT JOIN ansa.goal GO ON SA.id_salesman = GO.id_salesman
            LEFT JOIN ansa.goalline GL ON GO.id_goalline = GL.id_goalline 
            WHERE GL.application <> "DESCONSIDERAR"
            AND SA.office IN (?)
            AND GL.date BETWEEN ? AND LAST_DAY(?)
            group by GL.itemcode
            ORDER BY GL.itemcode ASC`

            const result = await query(sql, [offices, `${month}-01`, `${month}-10`])
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async month(offices, salesman) {
        try {
            let sql = `SELECT DATE_FORMAT(GL.date, '%Y-%m') as month, DATE_FORMAT(GL.date, '%m/%Y') as monthDesc
            FROM ansa.salesman SA
            LEFT JOIN ansa.goal GO ON SA.id_salesman = GO.id_salesman
            LEFT JOIN ansa.goalline GL ON GO.id_goalline = GL.id_goalline 
            WHERE GL.application <> "DESCONSIDERAR"
            AND GL.date < NOW() `

            if (offices) sql += ` AND SA.office = '${offices}' `
            if (salesman) sql += ` AND SA.id_salesman = '${salesman}' `

            sql += `
            group by GL.date
            ORDER BY GL.date ASC`;

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }
}

module.exports = new Goal()