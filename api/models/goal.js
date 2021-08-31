const Repositorie = require('../repositories/goal')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Goal {

    async insert(goal) {
        try {
            const item = await Repositorie.search(goal)
            console.log(item);
            const obj = await Repositorie.validate(item)

            if (obj && obj.amount && obj.amount !== goal.amount) {
                item.id_goal = obj.id_goal
                await Repositorie.update(item)
            } else {
                await Repositorie.insert(item)
            }

            return true
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }

    list(goal) {
        try {
            return Repositorie.list(goal)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }

    update(goal) {
        try {
            return Repositorie.update(goal)
        } catch (error) {
            throw new InternalServerError('No se pude actualizar los goals.')
        }
    }

    async listGoalsByManager(id_login) {

        try {
            const data = await Repositorie.listGoalsByManager(id_login)

            await data.forEach(obj => {
                obj.percentage = obj.goals * 100 / obj.countlines
                obj.percentage = obj.percentage.toFixed(2)
            })

            return data

        } catch (error) {
            throw new InternalServerError('No se pude listar los goals.')
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

module.exports = new Goal