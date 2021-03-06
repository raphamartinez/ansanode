const queryhbs = require('../infrastructure/database/querieshbs')
const query = require('../infrastructure/database/queries')

const { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized } = require('../models/error')

class Inventory {
    list(stock) {
        try {
            const sql = `SELECT Item.Code as ArtCode,Item.ItemGroup ,SUM(Stock.Qty) as Qty, SUM(Stock.Reserved) as Reserved, Item.Unit as Unit, Item.Unit2 as Unit2,Item.Labels,Item.DefaultPos as ItemPos,Item.DefaultShelf ItemShelf,Item.SupCode, Stock.StockDepo,
            Item.BarCode, Item.AlternativeCode, ItemGroup.Name as GroupDesc, Stock.StockDepo as StockDepo, Stock.StockPos as StockPos, Stock.SerialNr as SerialNr, StockDepo.Name as DepoName, Item.Name as ArtName
            FROM Item
            INNER JOIN Stock ON Item.Code = Stock.ArtCode
            INNER JOIN ItemGroup ON ItemGroup.Code = Item.ItemGroup
            INNER JOIN StockDepo ON Stock.StockDepo = StockDepo.Code
            LEFT JOIN Supplier ON Item.SupCode = Supplier.CODE
            WHERE (Item.Closed= 0 OR Item.Closed IS NULL)
            AND Item.ItemType= 2
            AND IF(Stock.Qty,Stock.Qty,0) + IF(Stock.Reserved,Stock.Reserved,0) > 0
            AND StockDepo.Code = ?
            GROUP BY ArtCode
            ORDER BY ItemGroup, ArtName`
            return queryhbs(sql, stock)

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    countStock(stock) {
        try {
            const sql = `SELECT COUNT(Item.Code) AS qty
            FROM Item
        INNER JOIN Stock ON Item.Code = Stock.ArtCode
        INNER JOIN StockDepo ON Stock.StockDepo = StockDepo.Code
        WHERE (Item.Closed= 0 OR Item.Closed IS NULL)
        AND Item.ItemType= 2
        AND IF(Stock.Qty,Stock.Qty,0) + IF(Stock.Reserved,Stock.Reserved,0) > 0
        AND StockDepo.Code = ?`
            return queryhbs(sql, stock)

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }


    items(id) {
        try {
            const sql = `SELECT iv.*, IF(iv.datereg BETWEEN NOW() - interval 7 day and NOW(), '', 'disabled') as edit, ivv.stock as lastStock
            FROM ANSA.inventory as iv
            LEFT JOIN ANSA.inventory as ivv on iv.item = ivv.item and iv.stock = ivv.stock and ivv.datereg < iv.datereg
            WHERE iv.id_inventoryfile = ?
            GROUP BY id 
            HAVING iv.id_inventoryfile = ?`
            return query(sql, [id, id])
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    validate(item) {
        try {
            const sql = `SELECT id, amount, datereg FROM inventory WHERE item = ? and id_inventoryfile = ? and columnIndex = ?`
            return query(sql, [item.code, item.inventory, item.index])

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    update(item) {
        try {
            const sql = `UPDATE inventory SET lastEdit = ?, amount = ? WHERE item = ? and id_inventoryfile = ? and columnIndex = ?`
            return query(sql, [item.lastEdit, item.amount, item.code, item.inventory, item.index])

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    insert(item, id_login) {
        try {
            const sql = `INSERT INTO inventory (stock, amount, item, columnIndex, id_inventoryfile, id_login, datereg) VALUES (?, ?, ?, ?, ?, ?, now() - interval 4 hour)`
            return query(sql, [item.stock, item.amount, item.code, item.index, item.inventory, id_login])

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    async create(id_login, stock, token, status) {
        try {
            const sql = `INSERT INTO inventoryfile (id_login, token, stock, status, datereg) VALUES (?, ?, ?, ?, now() - interval 4 hour)`
            const result = await query(sql, [id_login, token, stock, status])
            return result.insertId
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    inventory(id) {
        try {
            const sql = `SELECT *, DATE_FORMAT(datereg, '%h:%m %d/%m/%Y') as date FROM inventoryfile WHERE id = ?`
            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    delete(id, status) {
        try {
            const sql = `UPDATE inventoryfile set status = ? where id = ?`
            return query(sql, [status, id])
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    } 

    end(id, date) {
        try {
            const sql = `UPDATE inventoryfile set datefinished = ? where id = ?`
            return query(sql, [date, id])
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    } 

    verifyToken(token) {
        try {
            const sql = `SELECT id FROM ANSA.inventoryfile where token = ? `
            return query(sql, token)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    archives() {
        try {
            const sql = `SELECT il.id, il.stock, il.status, DATE_FORMAT(il.datefinished, '%h:%m %d/%m/%Y') as datefinished, us.name, DATE_FORMAT(il.datereg, '%h:%m %d/%m/%Y') as date, count(DISTINCT(iv.item)) as total,
            IF(il.datereg BETWEEN NOW() - interval 7 day and NOW() AND il.datefinished IS NULL, '', 'disabled') as edit
            FROM ANSA.inventoryfile as il
            INNER JOIN ANSA.user as us on il.id_login = us.id_login
            LEFT JOIN ANSA.inventory as iv on il.id = iv.id_inventoryfile
            WHERE il.status = 1
            GROUP BY il.id`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }
}

module.exports = new Inventory()