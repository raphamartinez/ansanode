const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Prosegur {

    async insertHistory(description) {
        try {
            const sql = "INSERT INTO webscrapinghistory (description, dateReg) values ( ?, now() - interval 4 hour )"
            const result = await query(sql, description)
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el historial en la base de datos')

        }
    }

    async listHistoryWebscraping() {
        try {
            const sql = `SELECT description, DATE_FORMAT(dateReg, '%H:%i %d/%m/%Y') as date FROM webscrapinghistory ORDER BY dateReg DESC LIMIT 1 `
            const result = await query(sql)

            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].date
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el historial de webscraping')
        }
    }

    async insertDistance(plate, km) {
        try {
            const sql = "INSERT INTO prosegurdistance (plate, km, dateReg) values ( ?, ?, now() - interval 4 hour )"
            const result = await query(sql, [plate, km])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar la distancia en la base de datos')
        }
    }

    async listDistance() {
        try {
            const sql = `SELECT DATE_FORMAT(dateReg, '%m-%d-%Y %H:%i:%s') as date FROM prosegurdistance ORDER BY dateReg DESC LIMIT 1 `
            const result = await query(sql)

            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].date
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar la distancia')
        }
    }


    async insertMaintenance(car, brand, kmNow, currentLocation, maintenanceDate, kmMaintenance, typeWarning, kmElapsed, remaining, work, state) {
        try {
            const sql = 'INSERT INTO prosegurmaintenance (car, brand, kmNow, currentLocation, maintenanceDate, kmMaintenance, typeWarning, kmElapsed, remaining, work, state) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            const result = await query(sql, [car, brand, kmNow, currentLocation, maintenanceDate, kmMaintenance, typeWarning, kmElapsed, remaining, work, state])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el mantenimiento en la base de datos')
        }
    }

    async listMaintenance(plate) {
        try {
            const sql = `SELECT DATE_FORMAT(maintenanceDate, '%m-%d-%Y %H:%i:%s') as maintenanceDate FROM prosegurmaintenance WHERE car='${plate}' ORDER BY maintenanceDate DESC LIMIT 1 `
            const result = await query(sql)
            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].maintenanceDate
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el mantenimiento')
        }
    }

    async insertPower(values) {
        try {
            const sql = 'INSERT INTO prosegurpower (dateStart, dateEnd, plate, alias, type, stoppedTime, direction, detentionDistance, coordinates) values (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            const result = await query(sql, values)
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('OnOff no se pudo enviar a la base de datos')
        }
    }

    async listPower(plate) {
        try {
            const sql = `SELECT DATE_FORMAT(dateEnd, '%m-%d-%Y %H:%i:%s') as dateEnd FROM prosegurpower WHERE plate='${plate}' ORDER BY dateEnd DESC LIMIT 1 `
            const result = await query(sql)

            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].dateEnd
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el OnOff')
        }
    }

    async insertArrest(dateStart, dateEnd, plate, alias, stoppedTime, direction, detentionDistance, coordinates, office) {

        try {
            const sql = 'INSERT INTO prosegurarrest (dateStart, dateEnd, plate, alias, stoppedTime, direction, detentionDistance, coordinates, office) values (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            const result = await query(sql, [dateStart, dateEnd, plate, alias, stoppedTime, direction, detentionDistance, coordinates, office])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo enviar la ubicación a la base de datos')
        }
    }

    async listArrest(plate) {
        try {
            const sql = `SELECT DATE_FORMAT(dateEnd, '%m-%d-%Y %H:%i:%s') as dateEnd FROM prosegurarrest WHERE plate='${plate}' ORDER BY dateEnd DESC LIMIT 1 `
            const result = await query(sql)

            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].dateEnd
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar la ubicación')
        }
    }

    async insertInviolavel(title, date, desc, office) {
        try {
            const sql = 'INSERT INTO inviolaveloffice (title, date, description, office) values (?, ?, ?, ?)'
            const result = await query(sql, [title, date, desc, office])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo enviar el inviolavel a la base de datos')
        }
    }

    async listInviolavel(office) {
        try {
            const sql = `SELECT DATE_FORMAT(date, '%m-%d-%Y %H:%i:%s') as date FROM inviolaveloffice WHERE office = ? ORDER BY date DESC LIMIT 1 `
            const result = await query(sql, office)

            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].date
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar el inviolavel')
        }
    }

    async insertOffice(event) {
        try {
            const sql = 'INSERT INTO proseguroffice (date, office, type, contract, user) values (?, ?, ?, ?, ?)'
            const result = await query(sql, [event.date, event.office, event.type, event.contract, event.user])
            return result[0]
        } catch (error) {
            console.log(error);
            return error
        }
    }

    async listOffice(office) {
        try {
            const sql = `SELECT DATE_FORMAT(date, '%m-%d-%Y %H:%i:%s') as date FROM proseguroffice WHERE office = ? ORDER BY date DESC LIMIT 1 `
            const result = await query(sql, office)

            if (!result[0]) {
                return '01-01-1999 00:00:00'
            }

            return result[0].date
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }
}

module.exports = new Prosegur()