const Repositorie = require('../repositories/goal');
const RepositorieSeller = require('../repositories/seller');
const RepositorieSales = require('../repositories/sales');

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

            let i;
            goals.Meta[3].J.match(/Stock ANSA*/) ? i = 2 : i = 0;

            let date;

            if (i == 2) {
                date = [
                    goals.Meta[3].L.replace("/", "-"),
                    goals.Meta[3].M.replace("/", "-"),
                    goals.Meta[3].N.replace("/", "-"),
                    goals.Meta[3].O.replace("/", "-"),
                    goals.Meta[3].P.replace("/", "-"),
                    goals.Meta[3].Q.replace("/", "-"),
                    goals.Meta[3].R.replace("/", "-"),
                    goals.Meta[3].S.replace("/", "-"),
                    goals.Meta[3].T.replace("/", "-"),
                    goals.Meta[3].U.replace("/", "-"),
                    goals.Meta[3].V.replace("/", "-"),
                    goals.Meta[3].W.replace("/", "-"),
                    goals.Meta[3].X.replace("/", "-")
                ]
            } else {
                date = [
                    goals.Meta[3].J.replace("/", "-"),
                    goals.Meta[3].K.replace("/", "-"),
                    goals.Meta[3].L.replace("/", "-"),
                    goals.Meta[3].M.replace("/", "-"),
                    goals.Meta[3].N.replace("/", "-"),
                    goals.Meta[3].O.replace("/", "-"),
                    goals.Meta[3].P.replace("/", "-"),
                    goals.Meta[3].Q.replace("/", "-"),
                    goals.Meta[3].R.replace("/", "-"),
                    goals.Meta[3].S.replace("/", "-"),
                    goals.Meta[3].T.replace("/", "-"),
                    goals.Meta[3].U.replace("/", "-"),
                    goals.Meta[3].V.replace("/", "-")
                ]
            }

            let table = []

            goals.Meta.shift()
            goals.Meta.shift()
            goals.Meta.shift()
            goals.Meta.shift()

            goals.Meta.forEach(goal => {
                if (i == 2) {
                    table.push([goal.A, goal.H, date[i], goal.L])
                    table.push([goal.A, goal.H, date[i + 1], goal.M])
                    table.push([goal.A, goal.H, date[i + 2], goal.N])
                    table.push([goal.A, goal.H, date[i + 3], goal.O])
                    table.push([goal.A, goal.H, date[i + 4], goal.P])
                    table.push([goal.A, goal.H, date[i + 5], goal.Q])
                    table.push([goal.A, goal.H, date[i + 6], goal.R])
                    table.push([goal.A, goal.H, date[i + 7], goal.S])
                    table.push([goal.A, goal.H, date[i + 8], goal.T])
                    table.push([goal.A, goal.H, date[i + 9], goal.U])
                    table.push([goal.A, goal.H, date[i + 10], goal.V])
                    table.push([goal.A, goal.H, date[i + 11], goal.W])
                    table.push([goal.A, goal.H, date[i + 12], goal.X])
                } else {
                    table.push([goal.A, goal.H, date[i], goal.J])
                    table.push([goal.A, goal.H, date[i + 1], goal.K])
                    table.push([goal.A, goal.H, date[i + 2], goal.L])
                    table.push([goal.A, goal.H, date[i + 3], goal.M])
                    table.push([goal.A, goal.H, date[i + 4], goal.N])
                    table.push([goal.A, goal.H, date[i + 5], goal.O])
                    table.push([goal.A, goal.H, date[i + 6], goal.P])
                    table.push([goal.A, goal.H, date[i + 7], goal.Q])
                    table.push([goal.A, goal.H, date[i + 8], goal.R])
                    table.push([goal.A, goal.H, date[i + 9], goal.S])
                    table.push([goal.A, goal.H, date[i + 10], goal.T])
                    table.push([goal.A, goal.H, date[i + 11], goal.U])
                    table.push([goal.A, goal.H, date[i + 12], goal.V])
                }
            })

            fs.unlinkSync(`tmp/uploads/${file.filename}`)

            console.log(table[0][0]);
            const id_salesman = await Repositorie.listSalesman(table[0][0])

            if (id_salesman) {
                for (let line of table) {

                    let year = line[2].split("-")[1];
                    let month = line[2].split("-")[0];

                    let i = { itemcode: line[1], date: `${year}-${month}-01` }
                    console.log(i);
                    const id_goalline = await Repositorie.search(i);

                    if (id_goalline) {
                        let item = {
                            id_goalline: id_goalline,
                            id_salesman: id_salesman,
                            amount: line[3]
                        }
                        console.log(id_goalline);
                        const obj = await Repositorie.validate(item)
                        console.log(obj);
                        if (obj && obj.amount && obj.amount !== item.amount) {
                            item.id_goal = obj.id_goal
                            await Repositorie.update(item)
                        } else {
                            if (item.amount > 0) await Repositorie.insert(item)
                        }
                    }

                }
            }

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
                let goals = await Repositorie.listGoals(obj.id_salesman, month);
                let amount = await RepositorieSales.list(obj.code, month);
                let sales = await RepositorieSales.graphSalesDay(obj.code, month);

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
                let amount = await RepositorieSales.list(obj.code, month, group);
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