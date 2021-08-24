const Repositorie = require('../repositories/label')
const RepositorieSeller = require('../repositories/seller')
const RepositorieGoal = require('../repositories/goalline')
const RepositorieHbs = require('../repositories/hbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class GoalLine {

    async create(date) {
        try {

            const items = await Repositorie.listItemLabel()
            const labels = await Repositorie.list()

            items.forEach(item => {
                let label = labels.find(label => label.code === item.labelcode)

                if (label) {

                    let goal = {
                        itemcode: item.itemcode,
                        itemname: item.itemname,
                        itemgroup: item.itemgroup,
                        labelname: item.labelname,
                        labelcode: label.code,
                        application: label.application,
                        provider: label.provider,
                        date: date
                    }

                    if (goal.application !== "DESCONSIDERAR") {
                        RepositorieGoal.insert(goal)
                    }

                }
            })


            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo crear un nuevo vendedor.')
        }
    }

    async list(id_salesman, date) {
        try {
            return RepositorieGoal.list(id_salesman, date)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    async listdashboard() {
        try {
            const countline = await RepositorieGoal.countLineGoal()

            const countsellersgoal = await RepositorieGoal.countSellersGoal()


        } catch (error) {

        }
    }

    update() {
        try {
            return Repositorie.update(goal)
        } catch (error) {
            throw new InternalServerError('No se pude actualizar lo vendedor.')
        }
    }

    delete(id_goal) {
        try {
            return Repositorie.delete(id_goal)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new GoalLine