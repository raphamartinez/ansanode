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

    async list(id_salesman, office, group, checkstock) {
        try {
            const data = await RepositorieGoal.list(id_salesman, group)

            const stocks = [
                ["01AUTOPJC", "1"],
                ["01CAFE", "11"],
                ["01DOSRUED", "11"],
                ["01IMPPJC", "1"],
                ["02AUTOCDE", "2"],
                ["03AUTOBVIS", "3"],
                ["04AUTOENC", "4"],
                ["05AUTOSAL", "5"],
                ["06AUTOFDO", "11"],
                ["06AUTOSHCH", "6"],
                ["07AUTOBADO", "7"],
                ["10TRUCK", "10"],
                ["12AUTORITA", "12"],
                ["13AUTOMRA", "13"],
                ["DCCDE", "2"],
                ["DEPTRANIMP", "11"],
                ["MATRIZ", "11"],
            ]

            let arrstock = " "

            stocks.forEach(stock => {
                if (stock[1] === office) {
                    const st = stock[0]

                    if (arrstock.length > 1) {
                        arrstock += ` ,'${st}' `
                    } else {
                        arrstock += `'${st}' `
                    }
                }
            })


            let arr = []
            for (let obj of data) {

                const stock = await RepositorieHbs.listItemsStock(obj.itemcode, arrstock)

                if (stock.Reserved > 0) stock.Qty -= stock.Reserved
                if (stock.CityReserved > 0) stock.CityQty -= stock.CityReserved
                if (stock.CityQty === null) stock.CityQty = 0

                obj.CityQty = stock.CityQty
                obj.Qty = stock.Qty

                if (checkstock === 1) {
                    arr.push(obj)
                } else {
                    if (obj.Qty > 0) arr.push(obj)
                }
            }

            return arr
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