const Repositorie = require('../repositories/clockmachine')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Clock {

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