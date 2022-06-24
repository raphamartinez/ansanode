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
        AND StockDepo.Code = '01IMPPJC'`
            return queryhbs(sql, stock)

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }


    items(id) {
        try {
            const sql = `SELECT *, IF(datereg BETWEEN NOW() - interval 7 day and NOW(), '', 'disabled') as edit FROM inventory WHERE id_inventoryfile = ?`
            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    validate(item) {
        try {
            const sql = `SELECT id, amount FROM inventory WHERE item = ? and id_inventoryfile = ? and columnIndex = ?`
            return query(sql, [item.code, item.inventory, item.index])

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    update(item) {
        try {
            const sql = `UPDATE inventory SET amount = ? WHERE item = ? and id_inventoryfile = ? and columnIndex = ?`
            return query(sql, [item.amount, item.code, item.inventory, item.index])

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    insert(item, id_login) {
        try {
            const sql = `INSERT INTO inventory (amount, item, columnIndex, id_inventoryfile, id_login, datereg) VALUES (?, ?, ?, ?, ?, now() - interval 4 hour)`
            return query(sql, [item.amount, item.code, item.index, item.inventory, id_login])

        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    async create(id_login, stock, status) {
        try {
            const sql = `INSERT INTO inventoryfile (id_login, stock, status, datereg) VALUES (?, ?, ?, now() - interval 4 hour)`
            const result = query(sql, [id_login, stock, status])
            return result.insertId
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    inventory(id) {
        try {
            const sql = `SELECT * FROM inventoryfile WHERE id = ?`
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

    archives() {
        try {
            const sql = `SELECT il.id, il.stock, il.status, us.name, DATE_FORMAT(il.datereg, '%h:%m %d/%m/%Y') as date, count(iv.amount) as total,
            IF(il.datereg BETWEEN NOW() - interval 7 day and NOW(), '', 'disabled') as edit
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