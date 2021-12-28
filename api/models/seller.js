const Repositorie = require('../repositories/seller')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Seller {

    async insert(sellers) {
        try {
            let newSellers = []

            for (let index = 0; index < sellers.length; index++) {
                let salesman = await JSON.parse(sellers[index].toString())

                const check = await Repositorie.check(salesman.code)
                if (!check) {
                    const id = await Repositorie.insert(salesman)
                    salesman.id_salesman = id;
                }else{
                    salesman.id_salesman = false;
                }

                newSellers.push(salesman)
            }

            return newSellers
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear un nuevo vendedor.')
        }
    }

    async list(id_login, office) {
        try {
            const sellers = await Repositorie.list(id_login, office)
            return sellers
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    async listExpectedMonth(id_salesman, date) {
        try {
            const data = await Repositorie.listExpectedMonth(id_salesman, date)

            data.forEach(obj => {
                obj.expected = obj.expected.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            })
            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    async dashboard(id_login, office, code) {
        try {
            const goals = await Repositorie.goal(id_login, office, code)

            await goals.forEach(obj => {
                let tmp = obj.name.split(" ")

                if (obj.goalssum === null) obj.goalssum = 0

                obj.name = `${tmp[0]} ${tmp[1]}`
                obj.percentage = obj.goals * 100 / obj.countlines
                obj.percentage = obj.percentage.toFixed(0)
            })

            return goals
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    async view(id_login, id_salesman) {
        try {
            const data = await Repositorie.listMonth(id_salesman)
            await data.forEach(obj => {
                if (obj.goalssum === null) obj.goalssum = 0

                obj.percentage = obj.goals * 100 / obj.countlines
                obj.percentage = obj.percentage.toFixed(0)
            })

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    update(manager) {
        try {
            return Repositorie.update(manager)
        } catch (error) {
            throw new InternalServerError('No se pude actualizar lo vendedor.')
        }
    }

    delete(id_salesman) {
        try {
            return Repositorie.delete(id_salesman)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Seller