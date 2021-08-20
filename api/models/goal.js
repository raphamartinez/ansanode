const Repositorie = require('../repositories/goal')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Goal {

    async insert(goal) {
        try {
            const obj = await Repositorie.validate(goal)

            if (obj.amount && obj.amount !== goal.amount) {
                goal.id_goal = obj.id_goal
                await Repositorie.update(goal)
            }else {
                await Repositorie.insert(goal)
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

    delete(id_goal) {
        try {
            return Repositorie.delete(id_goal)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Goal