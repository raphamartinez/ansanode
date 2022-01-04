const Repositorie = require('../repositories/goal');
const RepositorieSeller = require('../repositories/seller');
const RepositorieSales = require('../repositories/sales');
const RepositorieHbs = require('../repositories/hbs');
const Queue = require('../infrastructure/redis/queue');
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const excelToJson = require('convert-excel-to-json')
const fs = require('fs')

class Goal {

    async insert(goal) {
        try {
            const item = await Repositorie.search(goal)
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

    async upload(file) {
        try {
            let goals = excelToJson({
                sourceFile: `tmp/uploads/${file.key}`
            });

            let l;
            let i;

            if (goals.Meta[3].J) {
                i = 0
                l = 3
            } else {
                l = 4
                goals.Meta[4].K.match(/Stock ANSA*/) ? i = 2 : i = 0;
            }

            let date;

            if (i == 2) {
                date = [
                    goals.Meta[l].L.replace("/", "-"),
                    goals.Meta[l].M.replace("/", "-"),
                    goals.Meta[l].N.replace("/", "-"),
                    goals.Meta[l].O.replace("/", "-"),
                    goals.Meta[l].P.replace("/", "-"),
                    goals.Meta[l].Q.replace("/", "-"),
                    goals.Meta[l].R.replace("/", "-"),
                    goals.Meta[l].S.replace("/", "-"),
                    goals.Meta[l].T.replace("/", "-"),
                    goals.Meta[l].U.replace("/", "-"),
                    goals.Meta[l].V.replace("/", "-"),
                    goals.Meta[l].W.replace("/", "-"),
                    goals.Meta[l].X.replace("/", "-")
                ]
            } else {
                date = [
                    goals.Meta[l].J.replace("/", "-"),
                    goals.Meta[l].K.replace("/", "-"),
                    goals.Meta[l].L.replace("/", "-"),
                    goals.Meta[l].M.replace("/", "-"),
                    goals.Meta[l].N.replace("/", "-"),
                    goals.Meta[l].O.replace("/", "-"),
                    goals.Meta[l].P.replace("/", "-"),
                    goals.Meta[l].Q.replace("/", "-"),
                    goals.Meta[l].R.replace("/", "-"),
                    goals.Meta[l].S.replace("/", "-"),
                    goals.Meta[l].T.replace("/", "-"),
                    goals.Meta[l].U.replace("/", "-"),
                    goals.Meta[l].V.replace("/", "-")
                ]
            }

            let table = [];

            goals.Meta.shift();
            goals.Meta.shift();
            goals.Meta.shift();
            goals.Meta.shift();

            if (!goals.Meta[3].J) goals.Meta.shift();

            goals.Meta.forEach(goal => {
                if (i == 2) {
                    if (goal.L > 0) table.push([goal.A, goal.H, date[0], goal.L])
                    if (goal.M > 0) table.push([goal.A, goal.H, date[1], goal.M])
                    if (goal.N > 0) table.push([goal.A, goal.H, date[2], goal.N])
                    if (goal.O > 0) table.push([goal.A, goal.H, date[3], goal.O])
                    if (goal.P > 0) table.push([goal.A, goal.H, date[4], goal.P])
                    if (goal.Q > 0) table.push([goal.A, goal.H, date[5], goal.Q])
                    if (goal.R > 0) table.push([goal.A, goal.H, date[6], goal.R])
                    if (goal.S > 0) table.push([goal.A, goal.H, date[7], goal.S])
                    if (goal.T > 0) table.push([goal.A, goal.H, date[8], goal.T])
                    if (goal.U > 0) table.push([goal.A, goal.H, date[9], goal.U])
                    if (goal.V > 0) table.push([goal.A, goal.H, date[10], goal.V])
                    if (goal.W > 0) table.push([goal.A, goal.H, date[11], goal.W])
                    if (goal.X > 0) table.push([goal.A, goal.H, date[12], goal.X])
                } else {
                    if (goal.J > 0) table.push([goal.A, goal.H, date[0], goal.J])
                    if (goal.K > 0) table.push([goal.A, goal.H, date[1], goal.K])
                    if (goal.L > 0) table.push([goal.A, goal.H, date[2], goal.L])
                    if (goal.M > 0) table.push([goal.A, goal.H, date[3], goal.M])
                    if (goal.N > 0) table.push([goal.A, goal.H, date[4], goal.N])
                    if (goal.O > 0) table.push([goal.A, goal.H, date[5], goal.O])
                    if (goal.P > 0) table.push([goal.A, goal.H, date[6], goal.P])
                    if (goal.Q > 0) table.push([goal.A, goal.H, date[7], goal.Q])
                    if (goal.R > 0) table.push([goal.A, goal.H, date[8], goal.R])
                    if (goal.S > 0) table.push([goal.A, goal.H, date[9], goal.S])
                    if (goal.T > 0) table.push([goal.A, goal.H, date[10], goal.T])
                    if (goal.U > 0) table.push([goal.A, goal.H, date[11], goal.U])
                    if (goal.V > 0) table.push([goal.A, goal.H, date[12], goal.V])
                }
            })


            const id_salesman = await Repositorie.listSalesman(table[0][0])

            if (id_salesman) {

                for (let line of table) {

                    let year = line[2].split("-")[1];
                    let month = line[2].split("-")[0];

                    let obj = { itemcode: line[1], date: `${year}-${month}-01` }

                    console.log(obj);
                    const id_goalline = await Repositorie.search(obj);

                    if (id_goalline) {
                        let item = {
                            id_goalline: id_goalline,
                            id_salesman: id_salesman,
                            amount: line[3]
                        }

                        const validate = await Repositorie.validate(item)

                        if (validate && validate.amount && validate.amount !== item.amount) {
                            item.id_goal = obj.id_goal
                            await Repositorie.update(item)
                        } else {
                            await Repositorie.insert(item)
                        }
                    }

                }
            }

            fs.unlinkSync(`tmp/uploads/${file.filename}`)

        } catch (error) {
            console.log(error);
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

    async listOffice(month, offices) {
        try {
            const data = await RepositorieSeller.list(false, offices);
            let sellers = [];

            for (let obj of data) {

                let dtItemsExpected = await Repositorie.listGoalsItem(obj.id_salesman, month);
                let itemsExpected = dtItemsExpected.map(item => `${item.itemcode}`);
                let revenueExpected = await RepositorieHbs.listPrices(itemsExpected)

                let dtItemsEffective = await RepositorieSales.listItem(obj.code, month);
    
                const salesPerDay = sales.map(sale => {
                    return sale.qty
                });

                let x = 0;

                let salesAmount = sales.map(sale => {
                    x += sale.qty
                    return x
                });

                const days = sales.map(sale => {
                    return sale.TransDate
                });

                obj.goals = goals;
                obj.amount = amount;
                obj.salesPerDay = salesPerDay;
                obj.salesAmount = salesAmount;
                obj.days = days;

                sellers.push(obj);
            }


            let goals = []

            for (let seller of sellers) {

            }

            return sellers;
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas.');
        }
    }

    async listSeller(month, salesman, offices, group) {
        try {
            const data = await RepositorieSeller.list(salesman, offices);
            let sellers = [];

            for (let obj of data) {

                let goals = await Repositorie.listGoals(obj.id_salesman, month, group);
                let itemsdt = await Repositorie.listGoalsItem(obj.id_salesman, month, group);
                let items = itemsdt.map(item => item.itemcode);
                let amount = await RepositorieSales.list(items, obj.code, month, group);
                let sales = await RepositorieSales.graphSalesDay(obj.code, month, group);

                const salesPerDay = sales.map(sale => {
                    return sale.qty
                });

                let x = 0;

                let salesAmount = sales.map(sale => {
                    x += sale.qty
                    return x
                });

                const days = sales.map(sale => {
                    return sale.TransDate
                });

                obj.goals = goals;
                obj.amount = amount;
                obj.salesPerDay = salesPerDay;
                obj.salesAmount = salesAmount;
                obj.days = days;

                sellers.push(obj);
            }

            return sellers;
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas.');
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