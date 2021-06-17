const moment = require('moment')
const Repositorie = require('../repositories/hbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Hbs {

    async init() {
        try {
            console.log('list hbs ok');
        } catch (error) {
            console.log('list hbs error' - error);
            throw new InternalServerError(error)
        }
    }

    async listUsers() {
        try {
            const data = await Repositorie.listUsers()
            data.forEach(user => {

                if (user.phone) {
                    user.phone = `${user.phone} - ${user.mobile}`
                } else {
                    user.phone = user.mobile
                }

                if (user.sex === 1) {
                    user.sex = 'H'
                } else {
                    user.sex = 'M'
                }

                switch (user.modalidad) {
                    case 1: "IPS"
                        break
                    case 2: "Sem Contrato"
                        break
                    case 3: "Contrato"
                        break
                }

                Repositorie.insertUser(user)
            });
            return true
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listSalary() {
        try {
            const data = await Repositorie.listSalary()
            data.forEach(obj => {
                const dt = `${obj.date} ${obj.time}`
                const date = moment(dt).format("YYYY-MM-DD HH:mm:ss")
                Repositorie.insertSalary(obj, date)
            });

            return true
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listReceive() {
        try {
            const data = await Repositorie.listReceive()
            data.forEach(obj => {

                if (obj.rowNr <= 2) {
                    obj.rowNr = 1
                }

                if (obj.Currency === "GS") {
                    obj.d15USD = obj.d15 / obj.BaseRate
                    obj.d30USD = obj.d30 / obj.BaseRate
                    obj.d60USD = obj.d60 / obj.BaseRate
                    obj.d90USD = obj.d90 / obj.BaseRate
                    obj.d120USD = obj.d120 / obj.BaseRate
                    obj.dm120USD = obj.dm120 / obj.BaseRate
                } else {
                    if (obj.Currency === "RE") {
                        obj.d15USD = obj.d15 * obj.FromRate / obj.BaseRate
                        obj.d30USD = obj.d30 * obj.FromRate / obj.BaseRate
                        obj.d60USD = obj.d60 * obj.FromRate / obj.BaseRate
                        obj.d90USD = obj.d90 * obj.FromRate / obj.BaseRate
                        obj.d120USD = obj.d120 * obj.FromRate / obj.BaseRate
                        obj.dm120USD = obj.dm120 * obj.FromRate / obj.BaseRate
                    }
                }

                Repositorie.insertReceive(obj)

            });

            return true
        } catch (error) {
            throw new InternalServerError(error)
        }
    }
}

module.exports = new Hbs