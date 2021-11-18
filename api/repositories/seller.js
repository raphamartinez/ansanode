const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Seller {

    async insert(salesman) {
        try {
            const sql = 'INSERT INTO salesman (code, name, office, dateReg) values (?, ?, ?, now() - interval 3 hour )'
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

    async view(id_login, id_salesman) {
        try {
            let sql

            if (id_salesman) {
                sql = `SELECT sa.name, DATE_FORMAT(gl.date, '%m/%Y') as date, sa.id_salesman, sa.code, sa.office, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines 
                FROM ansa.salesman sa
                CROSS JOIN ansa.goalline gl
                LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
                WHERE sa.id_salesman = ${id_salesman}
                group by sa.code, gl.date
                order by gl.date asc`

                const data = await query(sql)
                return data[0]
            } else {
                sql = `SELECT sa.name, sa.id_salesman, sa.code, sa.office, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines 
                FROM ansa.salesman sa
                CROSS JOIN ansa.goalline gl
                LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
                WHERE sa.id_login = ${id_login}
                group by sa.code
                order by sa.code asc `

                const data = await query(sql)
                return data
            }

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async listMonth(id_salesman) {
        try {

            let sql = `SELECT gl.itemgroup, COUNT(go.amount) as goals, SUM(go.amount) as goalssum, COUNT(gl.id_goalline) AS countlines 
            FROM ansa.salesman sa
            CROSS JOIN ansa.goalline gl
            LEFT JOIN ansa.goal go ON go.id_salesman = sa.id_salesman and go.id_goalline = gl.id_goalline
            WHERE sa.id_salesman = ${id_salesman}
            and gl.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            group by gl.itemgroup
            order by gl.date asc`

            const data = await query(sql)
            return data

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async listExpected(id_salesman) {
        try {

            let sql = `SELECT DATE_FORMAT(GL.date, '%m/%Y') as date, GL.date as datesql, GO.id_salesman, sum(GO.amount) as amount, sum(GO.amount * PR.price) AS expected
            FROM ansa.goalline GL
            INNER JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
            INNER JOIN ansa.salesman SA ON GO.id_salesman = SA.id_salesman
            INNER JOIN ansa.itemprice PR ON GL.itemcode = PR.code
            WHERE GL.application <> "DESCONSIDERAR"
            AND GL.date >= NOW() - interval 1 month
            AND SA.id_salesman = ${id_salesman}
            AND GL.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            group by GL.date
            order by GL.date`

            return query(sql)
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
            AND GL.date = ?
            AND SA.id_salesman = ?
            AND GL.itemgroup IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            group by GL.itemgroup
            order by GL.itemgroup`

            return query(sql, [date, id_salesman])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Seller()