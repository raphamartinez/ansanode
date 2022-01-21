const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Crm {

    async insert(crm, id_login) {
        try {
            const sql = `INSERT INTO ansa.crm (contactdate, client, name, phone, mail, description, status, id_login, datereg ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now() - interval 3 hour)`
            const result = await query(sql, [crm.contactdate, crm.client, crm.name, crm.phone, crm.mail, crm.description, crm.status, id_login])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError(`Error on insert in database - ${error}`)
        }
    }

    async insertProduct(product) {
        try {
            const sql = `INSERT INTO ansa.crmproducts (code, name, type, classification, id_crm, dateReg) VALUES (?, ?, ?, ?, ?, NOW() - interval 3 hour)`
            const result = await query(sql, [product.code, product.name, product.type, product.classification, product.id_crm])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError(`Error on insert in database - ${error}`)
        }
    }

    async delete(status, id) {
        try {
            const sql = `UPDATE ansa.crm SET status = ? where id = ?`
            const result = await query(sql, [status, id])
            return result[0]
        } catch (error) {
            throw new InternalServerError('')
        }
    }
    
    async deleteProduct(id) {
        try {
            const sql = `DELETE FROM ansa.crmproducts where id = ?`
            const result = await query(sql, id)
            return result[0]
        } catch (error) {
            throw new InternalServerError('')
        }
    }

    async update(crm, id_crm) {  
        try {
            const sql = 'UPDATE ansa.crm SET client = ?, phone = ?, mail = ?, description = ?, contactdate = ? where id = ?'
            const result = await query(sql, [crm.client, crm.phone, crm.mail, crm.description, crm.contactdate, id_crm])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('')
        }
    }

    async updateProduct(classification, id) {  
        try {
            const sql = 'UPDATE ansa.crmproducts SET classification = ? WHERE id = ?'
            const result = await query(sql, [classification, id])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('')
        }
    }

    listProducts(id) {
        try {
            const sql = `SELECT id, code, name, type, dateReg, IF(dateReg < NOW() - interval 1 day, classification, "0") as classification,
            CASE
                        WHEN classification = 1 THEN "-50%"
                        WHEN classification = 2 THEN "50%"
                        WHEN classification = 3 THEN "75%"
                        WHEN classification = 4 THEN "100%"
                        ELSE "no clasificado"
            END as classificationdesc
            FROM ansa.crmproducts 
            WHERE id_crm = ?`

            return query(sql, id)

        } catch (error) {
            console.log(error);
            throw new InternalServerError('')
        }
    }

    list(search) {
        try {
            let sql = `SELECT cr.id, cr.client, cr.name, cr.phone, cr.mail, cr.description, DATE_FORMAT(cr.contactdate, '%d/%m/%Y') as contactdate, DATE_FORMAT(cr.contactdate, '%Y-%m-%d') as contactdatereg, DATE_FORMAT(cr.datereg, '%H:%i %d/%m/%Y') as datereg, cr.status, us.name as user
            FROM ansa.crm cr
            INNER JOIN ansa.user us ON cr.id_login = us.id_login 
            WHERE cr.status = 1 `

            if (search.offices && search.offices != "ALL") sql += ` AND cr.id_login IN ( SELECT ou.id_login FROM ansa.officeuser ou
                INNER JOIN ansa.office oi ON oi.id_office = ou.id_office
                WHERE oi.code IN (${search.offices})) `

            if (search.sellers && search.sellers != "ALL") sql += ` cr.id_login IN (${search.sellers}) `

            if (search.start && search.end) sql += ` AND cr.contactdate BETWEEN '${search.start}' AND '${search.end}' `

            if (search.id) sql += ` AND cr.id_login = ${search.id} `

            sql += ` ORDER BY cr.contactdate DESC`

            return query(sql)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('')
        }
    }

    listProductsDay(search) {
        try {
            let sql = `SELECT COUNT(cp.id) as products, DATE_FORMAT(cr.contactdate, '%d/%m/%Y') as date  
            FROM ansa.crm cr
            LEFT JOIN ansa.crmproducts cp ON cr.id = cp.id_crm
            WHERE cr.status = 1 AND cr.contactdate BETWEEN ? and ? `

            if (search.id) sql += ` AND cr.id_login = ${search.id} `

            if (search.offices && search.offices != "ALL") sql += ` AND cr.id_login IN (SELECT ou.id_login FROM ansa.officeuser ou
                INNER JOIN ansa.office oi ON oi.id_office = ou.id_office
                WHERE oi.code IN (${search.offices})) `

            sql += ` GROUP BY cr.contactdate; `

            return query(sql, [search.start, search.end])
        } catch (error) {
            console.log(error);
            throw new InternalServerError('')
        }
    }

    listProductsType(search) {
        try {
            let sql = `SELECT COUNT(cp.id) as products, IF(cp.type != "",cp.type,"No Definido") as type
            FROM ansa.crm cr
            LEFT JOIN ansa.crmproducts cp ON cr.id = cp.id_crm
            WHERE cr.status = 1 AND cr.contactdate BETWEEN ? and ? `

            if (search.id) sql += ` AND cr.id_login = ${search.id} `

            if (search.offices && search.offices != "ALL") sql += ` AND cr.id_login IN (SELECT ou.id_login FROM ansa.officeuser ou
                INNER JOIN ansa.office oi ON oi.id_office = ou.id_office
                WHERE oi.code IN (${search.offices})) `

            sql += ` GROUP BY cp.type; `

            return query(sql, [search.start, search.end])
        } catch (error) {
            console.log(error);
            throw new InternalServerError('')
        }
    }

    listProductsClient(search) {
        try {
            let sql = `SELECT COUNT(cr.client) as client, DATE_FORMAT(cr.contactdate, '%d/%m/%Y') as date  
            FROM ansa.crm cr
            WHERE cr.status = 1 AND cr.contactdate BETWEEN ? and ? `

            if (search.id) sql += ` AND cr.id_login = ${search.id} `

            if (search.offices && search.offices != "ALL") sql += ` AND cr.id_login IN (SELECT ou.id_login FROM ansa.officeuser ou
                INNER JOIN ansa.office oi ON oi.id_office = ou.id_office
                WHERE oi.code IN (${search.offices})) `

            sql += ` GROUP BY cr.contactdate; `

            return query(sql, [search.start, search.end])
        } catch (error) {
            console.log(error);
            throw new InternalServerError('')
        }
    }
}

module.exports = new Crm()