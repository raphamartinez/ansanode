const Repositorie = require('../repositories/clockmachine')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Clock {
    async listClockMachineHbs() {
        try {
            const data = await Repositorie.listClockMachineHbs()

            data.forEach(async obj => {

                const dt = await Repositorie.lastClockMachine(obj.EmployeeCode)

                let date = new Date(obj.TimestampDate)
                let lastDate = new Date(dt)

                if (lastDate.getTime() < date.getTime()) Repositorie.insertClockMachine(obj)
            })
        } catch (error) {
            console.log(error);
        }
    }

    list(office, period, type, code){
        try {
            return Repositorie.list(office, period, type, code)
        } catch (error) {
            console.log(error);
        }
    }

    listWorkers(offices){
        try {
            return Repositorie.listWorkers(offices)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Clock