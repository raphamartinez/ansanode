const Repositorie = require('../repositories/goal');
const RepositorieSeller = require('../repositories/seller');
const RepositorieSales = require('../repositories/sales');
const RepositorieOffice = require('../repositories/office');
const RepositorieHbs = require('../repositories/hbs');
const Queue = require('../infrastructure/redis/queue');
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs')
const { GoalMail } = require('./mail')
const nodemailer = require('nodemailer')

class Goal {

    async insert(goal) {
        let status = 3;

        try {
            const id_goalline = await Repositorie.search(goal)
            const obj = await Repositorie.validate(id_goalline, goal.id_salesman)

            if (obj) {
                goal.id_goal = obj.id_goal
                if (obj.amount !== parseInt(goal.amount)) {
                    await Repositorie.update(goal)
                    status = 1;
                } else {
                    status = 2;
                }
            } else {
                goal.id_goalline = id_goalline
                if (parseInt(goal.amount) > 0) {
                    await Repositorie.insert(goal)
                    status = 1;
                } else {
                    status = 2;
                }
            }

            return status;
        } catch (error) {
            return status;
        }
    }

    async upload(file, login) {
        try {
            let goals = excelToJson({
                sourceFile: `tmp/uploads/${file.key}`
            });

            let l;
            let i;
            let details = "";

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
                    if (goal.L > 0) table.push([goal.A, goal.H, date[0], goal.L]);
                    if (goal.M > 0) table.push([goal.A, goal.H, date[1], goal.M]);
                    if (goal.N > 0) table.push([goal.A, goal.H, date[2], goal.N]);
                    if (goal.O > 0) table.push([goal.A, goal.H, date[3], goal.O]);
                    if (goal.P > 0) table.push([goal.A, goal.H, date[4], goal.P]);
                    if (goal.Q > 0) table.push([goal.A, goal.H, date[5], goal.Q]);
                    if (goal.R > 0) table.push([goal.A, goal.H, date[6], goal.R]);
                    if (goal.S > 0) table.push([goal.A, goal.H, date[7], goal.S]);
                    if (goal.T > 0) table.push([goal.A, goal.H, date[8], goal.T]);
                    if (goal.U > 0) table.push([goal.A, goal.H, date[9], goal.U]);
                    if (goal.V > 0) table.push([goal.A, goal.H, date[10], goal.V]);
                    if (goal.W > 0) table.push([goal.A, goal.H, date[11], goal.W]);
                    if (goal.X > 0) table.push([goal.A, goal.H, date[12], goal.X]);
                } else {
                    if (goal.J > 0) table.push([goal.A, goal.H, date[0], goal.J]);
                    if (goal.K > 0) table.push([goal.A, goal.H, date[1], goal.K]);
                    if (goal.L > 0) table.push([goal.A, goal.H, date[2], goal.L]);
                    if (goal.M > 0) table.push([goal.A, goal.H, date[3], goal.M]);
                    if (goal.N > 0) table.push([goal.A, goal.H, date[4], goal.N]);
                    if (goal.O > 0) table.push([goal.A, goal.H, date[5], goal.O]);
                    if (goal.P > 0) table.push([goal.A, goal.H, date[6], goal.P]);
                    if (goal.Q > 0) table.push([goal.A, goal.H, date[7], goal.Q]);
                    if (goal.R > 0) table.push([goal.A, goal.H, date[8], goal.R]);
                    if (goal.S > 0) table.push([goal.A, goal.H, date[9], goal.S]);
                    if (goal.T > 0) table.push([goal.A, goal.H, date[10], goal.T]);
                    if (goal.U > 0) table.push([goal.A, goal.H, date[11], goal.U]);
                    if (goal.V > 0) table.push([goal.A, goal.H, date[12], goal.V]);
                };
            });

            const salesman = await Repositorie.listSalesman(table[0][0]);

            if (salesman && (login.perfil != 8 || (login.perfil == 8 && salesman.office == 11))) {

                for (let line of table) {

                    let year = line[2].split("-")[1];
                    let month = line[2].split("-")[0];

                    let obj = { itemcode: line[1], date: `${year}-${month}-01` };
                    const id_goalline = await Repositorie.search(obj);

                    if (id_goalline) {
                        let item = {
                            id_goalline: id_goalline,
                            id_salesman: salesman.id_salesman,
                            amount: line[3]
                        };

                        const validate = await Repositorie.validate(item);

                        if (validate) {
                            if (validate.amount != item.amount) {
                                item.id_goal = validate.id_goal;
                                details += `<tr><td>${obj.itemcode}</td><td>${obj.date}</td><td>${item.amount}</td></tr>`
                                await Repositorie.update(item);
                            }
                        } else {
                            details += `<tr><td>${obj.itemcode}</td><td>${obj.date}</td><td>${item.amount}</td></tr>`
                            await Repositorie.insert(item);
                        }
                    }
                }


                let dt = new Date();

                const attachment = {
                    filename: file.filename,
                    path: `tmp/uploads/${file.filename}`
                };

                const send = new GoalMail(attachment, details, table[0][0], login.name, `${dt.getHours()}:${dt.getMinutes()} ${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`, login.mailenterprise);

                const transport = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWORD
                    }
                })

                await transport.sendMail(send);

            } else {
                fs.unlinkSync(`tmp/uploads/${file.filename}`);
                return false
            }

            fs.unlinkSync(`tmp/uploads/${file.filename}`);

            return true
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

    async listStock(month, office = false, id = false) {
        try {
            let itemsdt;

            if (id) {
                itemsdt = await Repositorie.listGoalsItem(id, month);
            } else {
                itemsdt = await Repositorie.items(office, month, false);
            }

            let itemsAll = await RepositorieHbs.listStockItems(false, office);

            if(office){
                let itemsCity = await RepositorieHbs.listStockCityItems(false, office);

                itemsCity.map(item => {
                    let obj = itemsAll.find(obj => obj.itemcode == item.itemcode);
                    let goal = itemsdt.find(goal => goal.itemcode == item.itemcode);
    
                    item.goal = goal ? goal.amount : 0;
                    item.stockCity = item.Qty;
                    item.stockAnsa = obj.Qty;
    
                    return item
                });

                return itemsCity;
            } else{
                
                itemsAll.map(item => {
                    let goal = itemsdt.find(goal => goal.itemcode == item.itemcode);
                    item.goal = goal ? goal.amount : 0;
                    item.stockAnsa = item.Qty;
    
                    return item
                });

                return itemsAll;
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas.');
        }
    }

    async listComparation(months, office, id) {
        try {

            let data = [];
            for (let month of months) {
                let obj = {};
                let itemsdt;
                let code = false;

                if (id) {
                    itemsdt = await Repositorie.listGoalsItem(id, month);
                    let salesman = await RepositorieSeller.list(id, false);
                    code = salesman[0].code
                } else {
                    itemsdt = await Repositorie.items(parseInt(office), month);

                }
                let items = itemsdt.map(item => item.itemcode);

                if (items.length > 0) {
                    let revenueExpected = await RepositorieHbs.listPrices(items);
                    let goalEffective = await RepositorieSales.listOffice(items, office, month, code);
                    let goalExpected = await Repositorie.listGoalsOffice(office, month, false, id);
                    let sales = await RepositorieSales.graphSalesDayComparation(items, office, month, code);

                    let goals = goalExpected.map(goal => {
                        let group = revenueExpected.find(expected => expected.Name === goal.itemgroup);
                        let effective = goalEffective.find(effective => effective.name === goal.itemgroup);
                        if (group) goal.price = group.price;
                        if (effective) {
                            goal.effectiveAmount = effective.amount;
                            goal.effectivePrice = effective.price;
                        }
                        return goal;
                    });

                    const salesPerDay = sales.map(sale => {
                        return sale.qty;
                    });

                    let x = 0;

                    let salesAmount = sales.map(sale => {
                        x += sale.qty;
                        return x;
                    });

                    const days = sales.map(sale => {
                        return sale.TransDate;
                    });

                    obj['goals'] = goals;
                    obj['salesPerDay'] = salesPerDay;
                    obj['salesAmount'] = salesAmount;
                    obj['days'] = days;
                    obj['month'] = month
                }

                data.push(obj);
            }

            return data;
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas.');
        }
    }

    async listOffice(month, offices, group = false) {
        try {
            const data = await RepositorieOffice.offices(offices);
            let ofs = [];
            let revenueExpected = 0;

            for (let ofi of data) {

                let monthGoals = await Repositorie.month(parseInt(ofi.code), false);
                let itemsdt = await Repositorie.items(parseInt(ofi.code), month, group);
                let items = itemsdt.map(item => item.itemcode);

                if (items.length > 0) {

                    let itemsPrice = await RepositorieSales.listExpectedGoals(items);

                    itemsdt.forEach(item => {
                        let price = itemsPrice.find(price => price.ArtCode === item.itemcode);
                        if (price) revenueExpected += price.Price * item.amount;
                    })

                    let goalEffective = await RepositorieSales.listOffice(items, ofi.code, month);
                    let allEffective = await RepositorieSales.listOffice(false, ofi.code, month);
                    let goalExpected = await Repositorie.listGoalsOffice(ofi.code, month, group, false);
                    let sales = await RepositorieSales.graphSalesDayOffice(items, ofi.code, month, group);
                    let invoices;

                    if (group) {
                        invoices = await RepositorieHbs.listInvoice(month, group);
                        ofi.invoices = invoices;
                    };

                    let goals = goalExpected.map(goal => {
                        let effective = goalEffective.find(effective => effective.name === goal.itemgroup);
                        let all = allEffective.find(effective => effective.name === goal.itemgroup);

                        if (effective) {
                            goal.allPriceEffective = all.price;
                            goal.allEffective = all.amount;
                            goal.effectiveAmount = effective.amount;
                            goal.effectivePrice = effective.price;
                        }
                        return goal;
                    });

                    const salesPerDay = sales.map(sale => {
                        return sale.qty;
                    });

                    let x = 0;

                    let salesAmount = sales.map(sale => {
                        x += sale.qty;
                        return x;
                    });

                    const days = sales.map(sale => {
                        return sale.TransDate;
                    });

                    ofi.goals = goals;
                    ofi.salesPerDay = salesPerDay;
                    ofi.salesAmount = salesAmount;
                    ofi.days = days;
                    ofi.month = monthGoals;
                    ofi.revenueExpected = revenueExpected;
                }

                ofs.push(ofi);
            }

            return ofs;
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas.');
        }
    }

    async listAnsa(month, group = false) {
        try {
            let ansa = {};
            let revenueExpected = 0;

            let monthGoals = await Repositorie.month(false, false);
            let itemsdt = await Repositorie.items(false, month, group);
            let items = itemsdt.map(item => item.itemcode);

            if (items.length > 0) {

                let itemsPrice = await RepositorieSales.listExpectedGoals(items);
            
                itemsdt.forEach(item => {
                    let price = itemsPrice.find(price => price.ArtCode === item.itemcode);
                    if (price) revenueExpected += price.Price * item.amount;
                })
    
                let goalEffective = await RepositorieSales.listOffice(items, false, month);
                let allEffective = await RepositorieSales.listOffice(false, false, month);
                let goalExpected = await Repositorie.listGoalsOffice(false, month, group, false);
                let sales = await RepositorieSales.graphSalesDayOffice(items, false, month, group);
                let invoices;

                if (group) {
                    invoices = await RepositorieHbs.listInvoice(month, group);
                    ofi.invoices = invoices;
                };

                let goals = goalExpected.map(goal => {
                    let effective = goalEffective.find(effective => effective.name === goal.itemgroup);
                    let all = allEffective.find(effective => effective.name === goal.itemgroup);

                    if (effective) {
                        goal.allPriceEffective = all.price;
                        goal.allEffective = all.amount;
                        goal.effectiveAmount = effective.amount;
                        goal.effectivePrice = effective.price;
                    }
                    return goal;
                });

                const salesPerDay = sales.map(sale => {
                    return sale.qty;
                });

                let x = 0;

                let salesAmount = sales.map(sale => {
                    x += sale.qty;
                    return x;
                });

                const days = sales.map(sale => {
                    return sale.TransDate;
                });

                ansa["name"] = "Todas las Sucursais"
                ansa["goals"] = goals;
                ansa["salesPerDay"] = salesPerDay;
                ansa["salesAmount"] = salesAmount;
                ansa["days"] = days;
                ansa["month"] = monthGoals;
                ansa["revenueExpected"] = revenueExpected;
            }

            return ansa;
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

                let monthGoals = await Repositorie.month(false, obj.id_salesman);
                let goals = await Repositorie.listGoals(obj.id_salesman, month, group);
                let itemsdt = await Repositorie.listGoalsItem(obj.id_salesman, month, group);
                let items = itemsdt.map(item => item.itemcode);
                let allAmount = await RepositorieSales.list(false, obj.code, month, group);
                let amount = await RepositorieSales.list(items, obj.code, month, group);
                let sales = await RepositorieSales.graphSalesDay(items, obj.code, month, group);
                let invoices;

                if (group) {
                    invoices = await RepositorieHbs.listInvoice(month, group, obj.code);
                    obj.invoices = invoices;
                };

                const salesPerDay = sales.map(sale => {
                    return sale.qty;
                });

                let x = 0;

                let salesAmount = sales.map(sale => {
                    x += sale.qty;
                    return x;
                });

                const days = sales.map(sale => {
                    return sale.TransDate;
                });

                obj.goals = goals;
                obj.amount = amount;
                obj.allAmount = allAmount;
                obj.salesPerDay = salesPerDay;
                obj.salesAmount = salesAmount;
                obj.days = days;
                obj.month = monthGoals;

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