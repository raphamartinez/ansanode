const moment = require('moment')
const Repositorie = require('../repositories/hbs')
const RepositorieSeller = require('../repositories/seller')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const History = require('./history')
const xl = require('excel4node')
const ExcelJS = require('exceljs');

class Hbs {

    async init() {
        try {
            await this.listSalary()
            await this.listUsers()
            // await this.listPriceToInsert()
            // await this.listStockToInsert()

            console.log('list hbs ok');
        } catch (error) {
            console.log('list hbs error' + error);
            return error
        }
    }

    listSalesman(id_login, offices) {
        try {
            return Repositorie.listSalesMan(id_login, offices)
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

            const invoices = await Repositorie.listUnionReceivable()
            if (invoices.length > 0) await Repositorie.dropReceivable()

            for (let invoice of invoices) {
                await Repositorie.insertReceivable(invoice)
            }

            console.log('finalizada a consulta')
            return true
        } catch (error) {
            console.error(error);
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
            } else {
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
            return Repositorie.listItemsComplete()
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listDote(stock, name) {
        try {
            const items = await Repositorie.listDote(stock)
            const wb = new xl.Workbook({
                author: 'America Neumáticos S.A',
                defaultFont: {
                    size: 11,
                    name: 'Calibri',
                    color: '#000000',
                },
            })

            const headerStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#002060',
                },
                font: {
                    color: '#FFFFFF',
                    size: 11,
                    name: 'Calibri'
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }
            })

            const groupStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#4e73df',
                },
                font: {
                    color: '#FFFFFF',
                    size: 11,
                    name: 'Calibri'
                }
            })

            const ws = wb.addWorksheet('Dote', {
                margins: {
                    bottom: 1.18110236220472,
                    footer: 0.511811023622047,
                    header: 0.31496062992126,
                    left: 0.511811023622047,
                    right: 0.511811023622047,
                    top: 0.78740157480315
                },
                printOptions: {
                    printGridLines: true
                },
                headerFooter: {
                    firstHeader: '&L&G&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    firstFooter: '&L___________________________x000A_Firma Encargado de Estoque&C_____________________________x000A_Firma Encargado da Sucursal&R__________________x000A_Gerente de Sucursal',
                    evenHeader: '&L&G&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    evenFooter: '&L___________________________x000A_Firma Encargado de Estoque&C_____________________________x000A_Firma Encargado da Sucursal&R__________________x000A_Gerente de Sucursal',
                    oddHeader: '&L&G&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    oddFooter: '&L___________________________x000A_Firma Encargado de Estoque&C_____________________________x000A_Firma Encargado da Sucursal&R__________________x000A_Gerente de Sucursal',
                    alignWithMargins: true,
                    scaleWithDoc: true
                },
                pageSetup: {
                    firstPageNumber: 1,
                    orientation: 'landscape',
                    pageOrder: 'downThenOver',
                    paperSize: 'LEGAL_PAPER',
                    scale: 72,
                    printTitlesColumn: '7:8'
                },
                sheetView: {
                    zoomScale: 84
                },
                sheetFormat: {
                    defaultColWidth: 8,
                    defaultRowHeight: 19
                }
            })

            const date = new Date();
            const date2 = new Date(date.getTime() - 14400000);
            const now = `${date2.getHours()}:${date2.getMinutes()} ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}`;

            // ws.addImage({
            //     path: './public/img/ansalogomin.png',
            //     type: 'picture',
            //     position: {
            //         type: 'oneCellAnchor',
            //         from: {
            //             col: 1,
            //             colOff: '0.5in',
            //             row: 2,
            //             rowOff: 0,
            //         },
            //     },
            // });

            const infoValueStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#FFFFFF',
                },
                font: {
                    size: 11
                }
            })

            const infoStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#FFFFFF',
                },
                font: {
                    size: 11,
                    bold: true
                },
            })

            ws.setPrintArea(1, 17, 1, 35)

            ws.cell(1, 1, 1, 17, true).string('Toma de Inventario').style(wb.createStyle({
                font: {
                    bold: true,
                    color: '#FFFFFF',
                    size: 28,
                    name: 'Calibri',
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#002060',
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }
            }));

            ws.cell(2, 1, 2, 1, true).string('Suc.:').style(infoStyle)
            ws.cell(3, 1, 3, 1, true).string('Fecha y Hora de emisión:').style(infoStyle)
            ws.cell(4, 1, 4, 1, true).string('Usuario:').style(infoStyle)
            ws.cell(5, 1, 5, 17, true).string('Fecha de impresion').style(infoStyle)

            ws.cell(2, 2, 2, 17, true).string(stock).style(infoValueStyle)
            ws.cell(3, 2, 3, 17, true).string(now).style(infoValueStyle)
            ws.cell(4, 2, 4, 17, true).string(name).style(infoValueStyle)
            ws.row(1).setHeight(36);
            ws.column(1).setWidth(21);
            ws.column(2).setWidth(54);
            ws.row(7).freeze().group(1)
            ws.row(8).freeze().group(1)
            let firstTitles = [
                'Depósito Stock',
                stock,
                'Stock',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote'
            ]

            firstTitles.forEach((title, i) => {
                ws.cell(6, i + 1).string(title).style(headerStyle);
            })

            const secondTitles = [
                'Artigo',
                'Descrição',
                '',
                '________',
                '________',
                date.getFullYear() - 10,
                date.getFullYear() - 9,
                date.getFullYear() - 8,
                date.getFullYear() - 7,
                date.getFullYear() - 6,
                date.getFullYear() - 5,
                date.getFullYear() - 4,
                date.getFullYear() - 3,
                date.getFullYear() - 2,
                date.getFullYear() - 1,
                date.getFullYear()
            ]
            secondTitles.forEach((title, i) => {
                i + 1 < 6 ? ws.cell(7, i + 1).string(title).style(headerStyle) : ws.cell(7, i + 1).number(Number.parseInt(title)).style(headerStyle)
            })
            ws.cell(6, 17, 7, 17, true).string('Total').style(headerStyle)

            let rowIndex = 8
            let lastGroup = ''
            items.forEach(item => {
                let cellIndex = 1
                if (lastGroup != item.ItemGroup) {
                    ws.cell(rowIndex, cellIndex, rowIndex, 17, true).string(`Grp. Item: ${item.GroupDesc}`).style(groupStyle)
                    lastGroup = item.ItemGroup
                    rowIndex++
                }
                const qty = item.Qty ? item.Qty : 0 + item.Reserved ? item.Reserved : 0

                ws.cell(rowIndex, cellIndex++).number(Number.parseInt(item.ArtCode))
                ws.cell(rowIndex, cellIndex++).string(item.ArtName)
                ws.cell(rowIndex, cellIndex++).number(qty)
                rowIndex++
            })

            ws.setPrintArea(1, 1, rowIndex, 17);

            return wb
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listDoteXs(stock, name) {
        try {
            const items = await Repositorie.listDote(stock)

            const workbook = new ExcelJS.Workbook()
            workbook.creator = 'America Neumáticos S.A'
            workbook.created = new Date()
            const sheet = workbook.addWorksheet('Dote', {
                views: [{ showGridLines: true, zoomScale: 84 }],
                properties: {
                    defaultColWidth: 8,
                    defaultRowHeight: 19
                },
                pageSetup: {
                    margins: {
                        bottom: 1.18110236220472,
                        footer: 0.511811023622047,
                        header: 0.31496062992126,
                        left: 0.511811023622047,
                        right: 0.511811023622047,
                        top: 0.78740157480315
                    },
                    printTitlesRow: '7:8',
                    firstPageNumber: 1,
                    orientation: 'landscape',
                    pageOrder: 'downThenOver',
                    paperSize: 5,
                    scale: 72,
                    horizontalCentered: true,
                    verticalCentered: false
                },
                headerFooter: {
                    firstHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    firstFooter: '&L___________________________x000A_Firma Encargado de Estoque&C_____________________________x000A_Firma Encargado da Sucursal&R__________________x000A_Gerente de Sucursal',
                    evenHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    evenFooter: '&L___________________________x000A_Firma Encargado de Estoque&C_____________________________x000A_Firma Encargado da Sucursal&R__________________x000A_Gerente de Sucursal',
                    oddHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    oddFooter: '&L___________________________x000A_Firma Encargado de Estoque&C_____________________________x000A_Firma Encargado da Sucursal&R__________________x000A_Gerente de Sucursal',
                    alignWithMargins: true,
                    scaleWithDoc: true
                },

            })

            const date = new Date()
            const date2 = new Date(date.getTime() - 14400000)
            const now = `${date2.getHours()}:${date2.getMinutes()} ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}`

            const image = workbook.addImage({
                filename: './public/img/ansalogomin.png',
                extension: 'png',
            });
            sheet.addImage(image, {
                tl: { col: 16, row: 1.5 },
                br: { col: 18, row: 5.5 },
            });

            const styleAlignment = { vertical: 'center', horizontal: 'center' }

            const styleFontHeader = { color: { argb: '000000' }, size: 11 }
            const styleFillHeader = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF' },
                bgColor: { argb: 'FFFFFF' }
            }
            const styleFontTitle = { color: { argb: 'FFFFFF' }, size: 11 }
            const styleFillTitle = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '002060' },
                bgColor: { argb: '002060' }
            }
            const styleFontGroup = { color: { argb: 'FFFFFF' }, size: 11, name: 'Calibri' }
            const styleFillGroup = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4e73df' },
                bgColor: { argb: '4e73df' }
            }

            const title = sheet.getRow(1)
            title.height = 36
            title.width = 21
            title.getCell(1).value = 'Toma de Inventario'
            title.getCell(1).alignment = { vertical: 'center', horizontal: 'center' }
            title.getCell(1).font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 28,
                name: 'Calibri',
            }
            title.getCell(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '002060' },
                bgColor: { argb: '002060' }
            }

            sheet.mergeCells(1, 1, 1, 18)
            sheet.addRow(['Suc.:', stock])
            sheet.addRow(['Fecha y Hora de emisión:', now])
            sheet.addRow(['Usuario:', name])
            sheet.addRow(['Fecha de impresion'])
            sheet.getColumn(1).width = 21
            sheet.getColumn(2).width = 54
            sheet.getRow(2).font = styleFontHeader
            sheet.getRow(2).fill = styleFillHeader
            sheet.getRow(2).getCell(1).font = { bold: true }
            sheet.getRow(3).font = styleFontHeader
            sheet.getRow(3).fill = styleFillHeader
            sheet.getRow(3).getCell(1).font = { bold: true }
            sheet.getRow(4).font = styleFontHeader
            sheet.getRow(4).fill = styleFillHeader
            sheet.getRow(4).getCell(1).font = { bold: true }
            sheet.getRow(5).font = styleFontHeader
            sheet.getRow(5).fill = styleFillHeader
            sheet.getRow(5).getCell(1).font = { bold: true }
            sheet.addRow()
            sheet.getRow(6).font = styleFontHeader
            sheet.getRow(6).fill = styleFillHeader
            sheet.addRow([
                'Depósito Stock',
                stock,
                '',
                'Stock',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Dote',
                'Total'
            ])
            sheet.addRow([
                'Artigo',
                'Descrição',
                'Etiqueta',
                '',
                '________',
                '________',
                date.getFullYear() - 10,
                date.getFullYear() - 9,
                date.getFullYear() - 8,
                date.getFullYear() - 7,
                date.getFullYear() - 6,
                date.getFullYear() - 5,
                date.getFullYear() - 4,
                date.getFullYear() - 3,
                date.getFullYear() - 2,
                date.getFullYear() - 1,
                date.getFullYear()
            ])

            sheet.mergeCells(7, 18, 8, 18)
            for (let index = 1; index <= 18; index++) {
                sheet.getRow(7).getCell(index).font = styleFontTitle
                sheet.getRow(7).getCell(index).fill = styleFillTitle
                sheet.getRow(7).getCell(index).alignment = styleAlignment
                sheet.getRow(8).getCell(index).font = styleFontTitle
                sheet.getRow(8).getCell(index).fill = styleFillTitle
                sheet.getRow(8).getCell(index).alignment = styleAlignment
            }

            let rowIndex = 9
            let lastGroup = ''
            items.forEach(item => {
                if (lastGroup != item.ItemGroup) {
                    sheet.addRow([`Grp. Item: ${item.GroupDesc}`])
                    lastGroup = item.ItemGroup
                    const rowNow = sheet.getRow(rowIndex)
                    rowNow.height = 19
                    for (let index = 1; index <= 18; index++) {
                        rowNow.getCell(index).font = styleFontGroup
                        rowNow.getCell(index).fill = styleFillGroup
                    }
                    rowIndex++
                }
                const qty = item.Qty ? item.Qty : 0 + item.Reserved ? item.Reserved : 0
                sheet.addRow([item.ArtCode, item.ArtName, item.Labels, qty])
                rowIndex++
            })

 

            return workbook
        } catch (error) {
            throw new InternalServerError(error)
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

    async listStockbyUser(office, perfil) {
        try {
            const dtStock = [
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


            let data = []
            if (perfil == 1) {
                data = dtStock.map(stock => {
                    return stock[0]
                })
            } else {
                dtStock.forEach(stock => {
                    if (stock[1] === office) {
                        const st = stock[0]

                        if (data.length > 1) {
                            data += ` ,'${st}' `
                        } else {
                            data += `'${st}' `
                        }
                    }
                })
            }


            if (data.length > 0 || perfil === 1) {
                const groups = await Repositorie.listItemGroup(data)
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


    async listPriceToInsert() {
        try {
            const itemPrices = await Repositorie.listPriceToInsert();

            for (let items of itemPrices) {
                await Repositorie.insertPrice(items);
            }

            return true;
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listStockToInsert() {
        try {
            const itemStocks = await Repositorie.listStockToInsert();

            for (let items of itemStocks) {
                await Repositorie.insertStock(items);
            }

            return true;
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }
}

module.exports = new Hbs