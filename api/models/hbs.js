const moment = require('moment')
const Repositorie = require('../repositories/hbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const History = require('./history')
const ZKLib = require('zklib');

class Hbs {

    async init() {
        try {
            await this.listReceivables()
            await this.listSalary()
            await this.listUsers()
            await this.listClockMachine()

            console.log('list hbs ok');
        } catch (error) {
            console.log('list hbs error' + error);
            return error
        }
    }

    async listUsers() {
        try {
            await Repositorie.dropUsers()
            await Repositorie.createTableUsersHbs()

            const data = await Repositorie.listUsers()

            if (data) {
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
            return error
        }
    }

    async listSalary() {
        try {
            const data = await Repositorie.listSalary()

            if (data) {
                data.forEach(obj => {
                    const dt = `${obj.date} ${obj.time}`
                    const date = moment(dt).format("YYYY-MM-DD HH:mm:ss")
                    Repositorie.insertSalary(obj, date)
                });
            }

            return true
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }


    async listReceivables() {
        try {
            await Repositorie.dropReceivable()
            await Repositorie.createTableReceivable()

            const ncs = await Repositorie.listNcs()
            ncs.forEach(obj => {

                if (obj.Office === "06") {
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if (date1.getTime() < date2.getTime()) {
                        obj.Office = "06FDM"
                    }
                }
                Repositorie.insertReceivable(obj)
            });

            const inv = await Repositorie.listInvoices()
            inv.forEach(obj => {

                if (obj.Office === "06") {
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if (date1.getTime() < date2.getTime()) {
                        obj.Office = "06FDM"
                    }
                }

                Repositorie.insertReceivable(obj)
            });

            const installs = await Repositorie.listInstalls()
            installs.forEach(obj => {

                if (obj.Office === "06") {
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if (date1.getTime() < date2.getTime()) {
                        obj.Office = "06FDM"
                    }
                }

                Repositorie.insertReceivable(obj)
            });

            const cheques = await Repositorie.listCheque()
            cheques.forEach(obj => {

                if (obj.Office === "06") {
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if (date1.getTime() < date2.getTime()) {
                        obj.Office = "06FDM"
                    }
                }

                Repositorie.insertReceivable(obj)
            });

            console.log('finalizada a consulta')
            return true
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listClockMachine() {
        try {

            const clocks = await Repositorie.listClocksOffice()
            clocks.forEach(clock => {

                const ZK = new ZKLib({
                    ip: clock.IPAddress,
                    inport: clock.PortNr,
                    timeout: 5000,
                    connectionType: 'tcp'
                  });
                   
                  // connect to access control device
                  ZK.connect(function(err) {
                    if (err) throw err;
                   
                    ZK.getTime(function(err, t) {
                   
                      if (err) throw err;
                   
                      console.log("Device clock's time is " + t.toString());

                      ZK.disconnect();
                    });
                  });

                // if (data.length > 0) {
                //     data.forEach(async obj => {
                //         const lastInsert = await Repositorie.lastClockMachine(obj.EmployeeCode)

                //         const date1 = new Date(obj.DateSql)
                //         const date2 = new Date(lastInsert)

                //         if (date1.getTime() > date2.getTime()) {

                //             delete obj.DateSql

                //             Repositorie.insertClockMachine(obj)
                //         }
                //     })
                // }
            })

            // const data = await Repositorie.listClockMachine()

        } catch (error) {
            console.log(error);
            throw new InternalServerError(error)
        }
    }

    async listItems(search, id_login) {
        try {
            let history = `Listado de Artículos `

            if (search.stock[0].length <= 2) {
                const data = await Repositorie.listStocks(id_login)
                let resultArray = data.map(v => Object.assign({}, v));

                let stocks = resultArray.map(function (text) {
                    return `'${text['StockDepo']}'`;
                });

                search.stock = stocks
            }
            history += `- Deposito: ${search.stock}.`

            if (!search.artcode) {

                const dataitem = await Repositorie.listItemsComplete(search.stock)

                let resultArrayitem = dataitem.map(v => Object.assign({}, v));

                let items = resultArrayitem.map(function (text) {
                    return `'${text['ArtCode']}'`;
                });

                search.artcode = items

            }
            history += `- Cod: ${search.artcode} `

            if (search.itemgroup != "''") history += `- Grupo: ${search.itemgroup} `
            if (search.itemname) history += `- Nombre: '${search.itemname}' `


            History.insertHistory(history, id_login)

            const data = await Repositorie.listItems(search)

            data.forEach(obj => {
                if (obj.Reserved > 0) obj.StockQty - obj.Reserved
            })

            return data
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

    async listGoodyear(search, id_login) {
        try {

            let history = `Listado de Goodyear `

            if (search.datestart && search.dateend) history += `- Fecha: ${search.datestart} hasta que ${search.dateend} `
            if (search.office != "''") history += `- Sucursal: ${search.office}.`

            History.insertHistory(history, id_login)

            return Repositorie.listGoodyear(search)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listPrice(search, id_login) {
        try {

            let history = `Listado de precios `

            if (search.pricelist) history += `- Promocion: ${search.pricelist} `
            if (search.artcode) history += `- Cod: ${search.artcode} `
            if (search.itemgroup != "''") history += `- Grupo: ${search.itemgroup} `
            if (search.itemname) history += `- Nombre: '${search.itemname}'.`

            History.insertHistory(history, id_login)

            return Repositorie.listPrice(search)
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

            var resultArray = data.map(v => Object.assign({}, v));

            var stocks = resultArray.map(function (text) {
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