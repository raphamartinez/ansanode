const moment = require('moment')
const Repositorie = require('../repositories/hbs')
const RepositorieSeller = require('../repositories/seller')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const History = require('./history')

class Hbs {

    async init() {
        try {
            await this.listSalary()
            await this.listUsers()

            console.log('list hbs ok');
        } catch (error) {
            console.log('list hbs error' + error);
            return error
        }
    }

    listSalesman() {
        try {
            return Repositorie.listSalesMan()
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listUsers() {
        try {
            await Repositorie.dropUsers()

            const data = await Repositorie.listUsers()

            if (data.length !== 0) {
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
            }

            return true
        } catch (error) {
            console.log('consulta de usuario deu erro');
            return false
        }
    }

    async listSalary() {
        try {
            const data = await Repositorie.listSalary()

            if (data.length !== 0) {
                data.forEach(obj => {
                    const dt = `${obj.date} ${obj.time}`
                    const date = moment(dt).format("YYYY-MM-DD HH:mm:ss")
                    Repositorie.insertSalary(obj, date)
                });
            }

            return true
        } catch (error) {
            console.log('consulta de salario deu erro');
            return false
        }
    }


    async listReceivables() {
        try {
            await Repositorie.dropReceivable()

            const ncs = await Repositorie.listNcs()

            if (ncs.length !== 0) {
                await ncs.forEach(obj => {

                    if (obj.Office === "06") {
                        const date1 = new Date(obj.date)
                        const date2 = new Date('01-01-2020')
                        if (date1.getTime() < date2.getTime()) {
                            obj.Office = "13"
                        }
                    }
                    Repositorie.insertReceivable(obj)
                });
            }

            const inv = await Repositorie.listInvoices()
            if (inv.length !== 0) {
                await inv.forEach(obj => {

                    if (obj.Office === "06") {
                        const date1 = new Date(obj.date)
                        const date2 = new Date('01-01-2020')
                        if (date1.getTime() < date2.getTime()) {
                            obj.Office = "13"
                        }
                    }

                    Repositorie.insertReceivable(obj)
                });
            }

            const installs = await Repositorie.listInstalls()
            if (installs.length !== 0) {
                await installs.forEach(obj => {

                    if (obj.Office === "06") {
                        const date1 = new Date(obj.date)
                        const date2 = new Date('01-01-2020')
                        if (date1.getTime() < date2.getTime()) {
                            obj.Office = "13"
                        }
                    }

                    Repositorie.insertReceivable(obj)
                });
            }

            const cheques = await Repositorie.listCheque()
            if (cheques.length !== 0) {
                await cheques.forEach(obj => {

                    if (obj.Office === "06") {
                        const date1 = new Date(obj.date)
                        const date2 = new Date('01-01-2020')
                        if (date1.getTime() < date2.getTime()) {
                            obj.Office = "13"
                        }
                    }

                    Repositorie.insertReceivable(obj)
                });
            }

            console.log('finalizada a consulta')
            return true
        } catch (error) {
            console.log(error);
            console.log('consulta de inadimplencia deu erro');
            return false
        }
    }

    async listStock(search, id_login) {
        try {

            if (search.stock === "ALL") {
                const dataStock = await Repositorie.listStocks(id_login)
                const stocks = dataStock.map(obj => `'${obj.StockDepo}'`);
                search.stock = stocks
            }

            
            if (search.code === "ALL") {

                const dataItem = await Repositorie.listItemsComplete(search.stock)
                const items = dataItem.map(obj => `'${obj.ArtCode}'`);
                search.code = items
            }else{
                search.code = `'${search.code}'`
            }

            let history = `Listado de Deposito: ${search.stock} `
            if (search.itemgroup && search.itemgroup[0] != "ALL") history += `- Grupo: ${search.itemgroup} `
            if (search.name != "ALL") history += `- Nombre: '${search.name}' `
            History.insertHistory(history, id_login)

            return Repositorie.listItems(search)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listItemsComplete(id_login) {
        try {
            const data = await Repositorie.listStocks(id_login)

            var resultArray = data.map(v => Object.assign({}, v));

            var stocks = resultArray.map(function (text) {
                return `'${text['StockDepo']}'`;
            });

            return Repositorie.listItemsComplete(stocks)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listItemsLabel(code, office) {
        try {

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

            let data = await Repositorie.listItemsLabel(code)
            let city = await Repositorie.listItemsCity(code, arrstock)

            data.forEach(obj => {
                if (obj.Reserved > 0) obj.StockQty - obj.Reserved

                if (city.CityReserved > 0) {
                    obj.CityQty = city.CityQty - city.CityReserved
                } else {
                    obj.CityQty = city.CityQty
                }
            })

            return data

        } catch (error) {
            return [{ CityQty: 0, StockQty: 0 }]
        }
    }

    async listGoodyear(search, id_login) {
        try {

            let history = `Listado de Goodyear `

            if (search.datestart && search.dateend) history += `- Fecha: ${search.datestart} hasta que ${search.dateend} `
            if (search.office != "ALL" && search.office.length > 0) history += `- Sucursal: ${search.office}.`
            if (search.itemgroup != "ALL" && search.itemgroup.length > 0) history += `- Grupo: ${search.itemgroup} `

            History.insertHistory(history, id_login)

            const data = await Repositorie.listGoodyear(search)
            const sales = await Repositorie.listGoodyearSales(search)

           const items = await data.map(obj => {
                let sale = sales.find(sale => sale.ArtCode === obj.ArtCode)
                if (obj.Reserved > 0) obj.StockQty - obj.Reserved

                if (sale !== undefined) {
                    obj.SalesQty = sale.SalesQty
                } else {
                    obj.SalesQty = 0
                }

                return obj
            })

            return items
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error')
        }
    }

    async listPrice(search, id_login) {
        try {

            let history = `Listado de precios `

            if (search.pricelist) history += `- Promocion: ${search.pricelist} `
            if (search.artcode != "ALL") history += `- Cod: ${search.artcode} `
            if (search.itemgroup != "ALL" && search.itemgroup.length > 0) history += `- Grupo: ${search.itemgroup} `
            if (search.itemname != "ALL") history += `- Nombre: '${search.itemname}'.`

            History.insertHistory(history, id_login)

            return Repositorie.listPrice(search)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    listItemsGroups() {
        try {
            return Repositorie.listItemsGroups()

        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listStockByItem(artcode) {
        try {
            const stocks = await Repositorie.listStockbyItem(artcode)

            stocks.forEach(obj => {
                if (obj.Reserved > 0) obj.Qty - obj.Reserved
            })

            return stocks
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listSaleByItem(id_salesman, artcode) {
        try {
            const salesman = await RepositorieSeller.view(0, id_salesman)

            const data = await Repositorie.listSaleByItem(artcode, salesman)

            if (data.goal1 === null) {
                data.goal1 = 0
            }

            if (data.goal2 === null) {
                data.goal2 = 0
            }

            if (data.goal3 === null) {
                data.goal3 = 0
            }

            return data

        } catch (error) {
            throw new listSaleByItem('Error')
        }
    }


    async listStockandGroup() {
        try {
            const data = await Repositorie.listStocksHbs()

            var resultArray = data.map(v => Object.assign({}, v));

            var stocks = resultArray.map(function (text) {
                return `'${text['StockDepo']}'`;
            });

            const groups = await Repositorie.listItemGroup(stocks)
            const fields = {
                stocks: data,
                groups
            }

            return fields
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listStockbyUser(id_login) {
        try {
            const data = await Repositorie.listStocks(id_login)

            let resultArray = data.map(v => Object.assign({}, v));

            let stocks = resultArray.map(function (text) {
                return `'${text['StockDepo']}'`;
            });

            if (stocks.length > 0) {
                const groups = await Repositorie.listItemGroup(stocks)
                const fields = {
                    stocks: data,
                    groups
                }

                return fields
            }

            return false
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

}

module.exports = new Hbs