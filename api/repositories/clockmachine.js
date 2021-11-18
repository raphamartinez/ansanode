const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Clock {

    async insertClockMachine(data) {
        try {
            const sql = `INSERT INTO ansa.clockmachine set ?`
            await query(sql, data)

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el clockmachine en la base de datos')
        }
    }

    async lastClockMachine(code) {
        try {
            const sql = `SELECT DATE_FORMAT(TimestampDate, '%m-%d-%Y %H:%i:%s') as date FROM ansa.clockmachine WHERE EmployeeCode = ? ORDER BY TimestampDate DESC LIMIT 1`
            const data = await query(sql, code)

            return data[0].date
        } catch (error) {
            throw new InternalServerError('La última lista de control de punto falló')
        }
    }

    listClockMachineHbs() {
        try {
            const sql = `SELECT cl.EmployeeCode, CONCAT(DATE_FORMAT(cl.Date, '%d/%m/%Y')," ",cl.TIME) AS Date, CONCAT(cl.Date," ",cl.TIME) AS TimestampDate, cl.InOutType AS Type, cl.Office, wo.Name
            FROM ClockMachineRecord cl
            INNER JOIN Workers wo ON cl.EmployeeCode = wo.Code
            WHERE cl.Date > '2021-06-01'`

            return queryhbs(sql)

        } catch (error) {
            console.log(error);
        }
    }

    list(office, period, type, code) {
        try {
            let sql = `SELECT id, EmployeeCode, DATE_FORMAT(TimestampDate, '%H:%i %d/%m/%Y') as date, TimestampDate, IF(Type = 1, "Entrada", "Salida") as type, Office, Name 
            FROM ansa.clockmachine 
            WHERE EmployeeCode != 0 `

            if (office != 0) sql += ` AND office IN (${office}) `
            if (type != 0 ) sql += ` AND type = ${type} `
            if (code != 0) sql += ` AND code IN (${code}) `
            if (period && period.start != 0 && period.end != 0) sql += ` AND TimestampDate BETWEEN '${period.start}' AND '${period.end}' `

            return query(sql)
        } catch (error) {
            console.log(error);
        }
    }

    listWorkers(offices) {
        try {
            let sql = `SELECT DISTINCT EmployeeCode as id, Name as name FROM ansa.clockmachine `

            if (offices) sql += ` WHERE Office IN (${offices})`

            return query(sql)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Clock()