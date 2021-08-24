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

    async list(id_salesman) {
        try {
            const data = await RepositorieGoal.list(id_salesman)

            const stocks = [
                ["01AUTOPJC", 1],
                ["01CAFE", 11],
                ["01DOSRUED", 11],
                ["01IMPPJC", 1],
                ["02AUTOCDE", 2],
                ["03AUTOBVIS", 3],
                ["04AUTOENC", 4],
                ["05AUTOSAL", 5],
                ["06AUTOFDO", 11],
                ["06AUTOSHCH", 6],
                ["07AUTOBADO", 7],
                ["10TRUCK", 10],
                ["12AUTORITA", 12],
                ["13AUTOMRA", 13],
                ["DCCDE", 2],
                ["DEPTRANIMP", 11],
                ["MATRIZ", 11],
            ]

            const salesman = await RepositorieSeller.view(id_salesman)
            let arrstock = " "

            await stocks.forEach(stock => {
                if (stock[1] === salesman.office) {
                    const st = stock[0]

                    if (arrstock.length > 1) {
                        arrstock += ` ,'${st}' `
                    } else {
                        arrstock += `'${st}' `
                    }
                }
            })

            await data.forEach(async obj => {
                let stocksCity = await RepositorieHbs.listItemsCity(obj.itemcode, arrstock)

                if(stocksCity.length > 2){
                    await stocksCity.forEach(stock => {
                        if (stock.CityReserved > 0) {
                            obj.CityQty = stock.CityQty - stock.CityReserved
                        } else {
                            obj.CityQty = stock.CityQty
                        }
                    })
                }
            })

            await data.forEach(async obj => {

                let stocksLabel = await RepositorieHbs.listItemsLabel(obj.itemcode)

                await stocksLabel.forEach(stock => {
                    if (stock.Reserved > 0) {
                        obj.StockQty = stock.StockQty - stock.Reserved
                    } else {
                        obj.StockQty = stock.StockQty
                    }
                })
            })

            return data
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