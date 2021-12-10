const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Seller {

    async insert(salesman) {
        try {
            const sql = 'INSERT INTO salesman (code, name, office, status, dateReg) values (?, ?, ?, ?, now() - interval 3 hour )'
            const result = await query(sql, [salesman.code, salesman.name, salesman.office, 1])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async delete(id_salesman) {
        try {
            const sql = `UPDATE salesman SET status = ? WHERE id_salesman = ?`
            const result = await query(sql, [0, id_salesman])
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }


    async update(manager) {
        console.log(manager);
        try {
            const sql = `UPDATE ansa.salesman set id_login = ? WHERE id_salesman = ?`
            const result = await query(sql, [manager.id, manager.id_salesman])
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    list(id_login, office) {
        try {
            let sql = `SELECT US.name as manager, SA.id_salesman, SA.code, SA.name, SA.office, DATE_FORMAT(SA.dateReg, '%H:%i %d/%m/%Y') as dateReg 
            FROM ansa.salesman SA
            LEFT JOIN ansa.login LO ON SA.id_login = LO.id_login 
            LEFT JOIN ansa.user US ON LO.id_login = US.id_login 
            WHERE SA.status = 1 `

            if (id_login) sql += ` AND LO.id_login = ${id_login}`
            if (office) sql += ` AND SA.office IN (${office}) `

            sql+= ` GROUP BY SA.id_salesman
            ORDER BY SA.name`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async view(id_login, id_salesman) {
        try {
            let sql

            if (id_salesman) {
                sql = `SELECT sa.name, DATE_FORMAT(gl.date, '%m/%Y') as date, sa.id_salesman, sa.code, sa.office, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines 
                FROM ansa.salesman sa
                CROSS JOIN ansa.goalline gl
                LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
                WHERE sa.id_salesman = ?
                group by sa.code, gl.date
                order by gl.date asc`

                const data = await query(sql, id_salesman)
                return data[0]
            } else {
                sql = `SELECT sa.name, sa.id_salesman, sa.code, sa.office, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines 
                FROM ansa.salesman sa
                CROSS JOIN ansa.goalline gl
                LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
                WHERE sa.id_login = ?
                group by sa.code
                order by sa.code asc `

                const data = await query(sql, id_login)
                return data
            }

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    goal(id_login, office, code) {
        try {
            let sql = `SELECT sa.name, sa.id_salesman, sa.code, sa.office, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines , sum(go.amount) * pr.price AS expected
            FROM ansa.salesman sa
            CROSS JOIN ansa.goalline gl
            INNER JOIN ansa.itemprice pr ON gl.itemcode = pr.code
            LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
            WHERE sa.status = 1
         `

            if (id_login) sql += ` AND sa.id_login = '${id_login}' `
            if (office) sql += ` AND sa.office IN ('${office}') `
            if (code) sql += ` AND sa.code = '${code}' `

            sql += `group by sa.code
         order by sa.code asc`

            return query(sql)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async listMonth(id_salesman) {
        try {

            let sql = `SELECT gl.itemgroup, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines 
            FROM ansa.salesman sa
            CROSS JOIN ansa.goalline gl
            LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
            WHERE sa.id_salesman = ?
            and gl.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            group by gl.itemgroup
            order by gl.date asc`

            const data = await query(sql, id_salesman)
            return data

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async listExpected(id_salesman, date) {
        try {

            let sql = `SELECT DATE_FORMAT(GL.date, '%m/%Y') as date, GL.date as datesql, GO.id_salesman, sum(GO.amount) as amount, sum(GO.amount) * PR.price AS expected
            FROM ansa.goalline GL
            INNER JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
            INNER JOIN ansa.salesman SA ON GO.id_salesman = SA.id_salesman
            INNER JOIN ansa.itemprice PR ON GL.itemcode = PR.code
            WHERE GL.application <> "DESCONSIDERAR"
            AND GL.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            AND SA.id_salesman = ?
            `

            if(date) sql += ` 
            AND GL.date >= NOW() - interval 1 month
            group by GL.date
            order by GL.date`

            return query(sql, id_salesman)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async listExpectedMonth(id_salesman, date) {
        try {

            let sql = `SELECT GL.itemgroup, GL.date as datesql, GO.id_salesman , sum(GO.amount) as amount, sum(GO.amount * PR.price) AS expected
            FROM ansa.goalline GL
            INNER JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
            INNER JOIN ansa.salesman SA ON GO.id_salesman = SA.id_salesman
            INNER JOIN ansa.itemprice PR ON GL.itemcode = PR.code
            WHERE GL.application <> "DESCONSIDERAR" 
            `

            if(date) sql+= ` AND GL.date = '${date}' `
            if(id_salesman) sql+= ` AND SA.id_salesman = ${id_salesman} `

            sql+= ` AND GL.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            group by GL.itemgroup
            order by GL.itemgroup `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Seller()