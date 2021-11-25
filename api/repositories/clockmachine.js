const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Clock {

    async list(office, period, type, code) {
        try {
            let sql = `SELECT cl.EmployeeCode, cl.Date, cl.Time, IF(cl.InOutType = 1, "Entrada", "Salida") as type, cl.Office, wo.Name
            FROM ClockMachineRecord cl
            INNER JOIN Workers wo ON cl.EmployeeCode = wo.Code
            WHERE cl.EmployeeCode != 0 `

            if (office != 0) sql += ` AND cl.Office IN (${office}) `
            if (type != 0 ) sql += ` AND cl.InOutType = ${type} `
            if (code != 0) sql += ` AND cl.EmployeeCode IN (${code}) `
            if (period && period.start != 0 && period.end != 0) sql += ` AND cl.Date BETWEEN '${period.start}' AND '${period.end}' `

            const data = await queryhbs(sql)

            return data
        } catch (error) {
            console.log(error);
        }
    }

    listWorkers(offices) {
        try {
            let sql = `SELECT DISTINCT cl.EmployeeCode as id, wo.Name as name 
            FROM ClockMachineRecord cl
            INNER JOIN Workers wo ON cl.EmployeeCode = wo.Code `

            if (offices) sql += ` WHERE cl.Office IN (${offices})`

            return queryhbs(sql)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Clock()