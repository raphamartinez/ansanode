const Repositorie = require('../repositories/inventory')
const ExcelJS = require('exceljs');
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Inventory {

    async create(id_login, stock) {
        try {
            const status = 1
            const id = await Repositorie.create(id_login, stock, status)
            return id
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async archives() {
        try {
            let data = await Repositorie.archives()
            let archives = []
            for (let archive of data) {
                let qty = 0
                let count = await Repositorie.countStock(archive.stock)
                if (count.length > 0) qty = count[0].qty
                archive.porcent = (archive.total * 100 / qty).toFixed(2)
                archives.push(archive)
            }
            return archives
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    inventory(id) {
        try {
            return Repositorie.inventory(id)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    delete(id) {
        try {
            const status = 0
            return Repositorie.delete(id, status)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    list(stock) {
        try {
            return Repositorie.list(stock)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async items(itemsdt, id) {
        try {
            const inventoryItems = await Repositorie.items(id)
            if (inventoryItems.length === 0) return itemsdt
            const items = itemsdt.map(stock => {
                stock.amount = 0
                for (let index = 1; index <= 13; index++) {
                    let obj = inventoryItems.find(obj => stock.ArtCode === obj.item && obj.columnIndex === index)
                    if (obj) {
                        stock[`v${obj.columnIndex}`] = obj.amount
                        stock[`lastEditV${obj.columnIndex}`] = obj.lastEdit
                        stock.amount += obj.amount
                        stock.edit = obj.edit
                        stock.lastStock = obj.lastStock ? obj.lastStock : stock.lastStock
                    }
                }

                return stock
            })
            return items
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    copulateSheet(sheet, items, name, stock, inventoryItems) {
        const date = new Date()
        const date2 = new Date(date.getTime() - 14400000)
        const now = `${date2.getHours()}:${date2.getMinutes()} ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}`

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
        sheet.addRow([''])
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
            'Cod. Articulo',
            'Descripción',
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
            let arr = [item.ArtCode, item.ArtName, item.Labels, qty]
            if (inventoryItems) {
                item.amount = 0
                for (let index = 1; index <= 13; index++) {
                    let obj = inventoryItems.find(obj => item.ArtCode === obj.item && index === obj.columnIndex)
                    if (obj) {
                        item.amount += obj.amount
                        arr.push(obj.amount)
                    } else {
                        arr.push('')
                    }
                }
                arr.push(item.amount > 0 ? item.amount : '')
            }
            sheet.addRow(arr)
            rowIndex++
        })
    }

    async generate(items, name, stock, id) {
        try {
            const workbook = new ExcelJS.Workbook()
            workbook.creator = 'America Neumáticos S.A'
            workbook.created = new Date()
            const sheet = workbook.addWorksheet('Oficio', {
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
                    verticalCentered: false,
                    showGridLines: true
                },
                headerFooter: {
                    firstHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    firstFooter: '&L___________________________x000A_Firma Encargado de Deposito&C_____________________________x000A_Firma Encargado de Sucursal&R__________________x000A_Gerente de Sucursal',
                    evenHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    evenFooter: '&L___________________________x000A_Firma Encargado de Deposito&C_____________________________x000A_Firma Encargado de Sucursal&R__________________x000A_Gerente de Sucursal',
                    oddHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    oddFooter: '&L___________________________x000A_Firma Encargado de Deposito&C_____________________________x000A_Firma Encargado de Sucursal&R__________________x000A_Gerente de Sucursal',
                    alignWithMargins: true,
                    scaleWithDoc: true
                }
            })
            const image = workbook.addImage({
                filename: './public/img/ansalogomin.png',
                extension: 'png',
            });
            sheet.addImage(image, {
                tl: { col: 16, row: 1.5 },
                br: { col: 18, row: 5.5 },
            });

            let inventoryItems
            if (id) {
                inventoryItems = await Repositorie.items(id)
            }
            this.copulateSheet(sheet, items, name, stock, inventoryItems)

            const sheetA4 = workbook.addWorksheet('A4', {
                views: [{ showGridLines: true, zoomScale: 75 }],
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
                    paperSize: 9,
                    scale: 65,
                    horizontalCentered: true,
                    verticalCentered: false,
                    showGridLines: true
                },
                headerFooter: {
                    firstHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    firstFooter: '&L___________________________x000A_Firma Encargado de Deposito&C_____________________________x000A_Firma Encargado de Sucursal&R__________________x000A_Gerente de Sucursal',
                    evenHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    evenFooter: '&L___________________________x000A_Firma Encargado de Deposito&C_____________________________x000A_Firma Encargado de Sucursal&R__________________x000A_Gerente de Sucursal',
                    oddHeader: '&L&CAMÉRICA NEUMÁTICOS S.A._x000A_Avda. Dr. José Gaspar Rodriguez de Francia 374&RPagina &P de &N',
                    oddFooter: '&L___________________________x000A_Firma Encargado de Deposito&C_____________________________x000A_Firma Encargado de Sucursal&R__________________x000A_Gerente de Sucursal',
                    alignWithMargins: true,
                    scaleWithDoc: true
                }
            })
            const imageA4 = workbook.addImage({
                filename: './public/img/ansalogomin.png',
                extension: 'png',
            });
            sheetA4.addImage(imageA4, {
                tl: { col: 16, row: 1.5 },
                br: { col: 18, row: 5.5 },
            });
            this.copulateSheet(sheetA4, items, name, stock, inventoryItems)


            return workbook
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async insert(item, id_login) {
        let status = 3
        try {
            const exists = await Repositorie.validate(item)
            if (exists.length > 0) {
                const lastDate = new Date(exists[0].datereg)
                const now = new Date()
                const difference = now.getTime() - lastDate.getTime()
                item.id = exists[0].id
                if (difference > (72000000 + 14400000)) item.lastEdit = exists[0].amount
                if (exists[0].amount !== parseInt(item.amount)) {
                    await Repositorie.update(item)
                    status = 1
                } else {
                    status = 2
                }
            } else {
                if (parseInt(item.amount) > 0) {
                    await Repositorie.insert(item, id_login)
                    status = 1
                } else {
                    status = 2
                }
            }

            return status
        } catch (error) {
            return status
        }
    }
}

module.exports = new Inventory