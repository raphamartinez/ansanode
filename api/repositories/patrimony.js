const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class SurveyMonkey {

    async insert(asset, id_login) {
        try {
            const sql = 'INSERT INTO patrimony (responseId, name, plate, office, title, type, description, note, id_login, datereg, status) values (?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour, 1)'
            const result = await query(sql, [asset.responseId, asset.name, asset.plate, asset.office, asset.title, asset.type, asset.description, asset.note, id_login])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async insertImage(url, id) {
        try {
            const sql = 'INSERT INTO patrimonyimage (url, id_patrimony, datereg) values (?, ?, now() - interval 4 hour )'
            await query(sql, [url, id])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async insertDetails(description, title, id_patrimony) {
        try {
            const sql = 'INSERT INTO patrimonydetails (description, title, id_patrimony, datereg) values (?, ?, ?, now() - interval 4 hour )'
            await query(sql, [description, title, id_patrimony])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }


    async validateImage(url) {
        try {
            const sql = 'SELECT id FROM patrimonyimage where url = ?'
            const result = await query(sql, url)

            return result[0]
        } catch (error) {
            return false
        }
    }

    async validatePatrimony(plate) {
        try {
            const sql = 'SELECT id FROM patrimony where plate = ?'
            const result = await query(sql, plate)

            return result[0]
        } catch (error) {
            return false
        }
    }

    async validateDetails(plate, title) {
        try {
            const sql = `select co.id 
            from patrimonyassets co
            inner join patrimonydetails pa
            where co.plate = ? and pa.title = ?`

            const result = await query(sql, [plate, title])

            return result[0]
        } catch (error) {
            return false
        }
    }

    list(offices, types) {
        try {
            let sql = `
            SELECT pa.type, pa.office, pa.name, pa.plate, pa.id,  pa.note, pa.description, pa.title 
            FROM patrimony pa 
            WHERE plate <> "" AND pa.status = 1 `

            if (offices && offices != "ALL" && offices.length > 0) sql += ` AND pa.office IN (${offices})`
            if (types && types != "ALL" && types.length > 0) sql += ` AND pa.type IN (${types})`

            sql += ` GROUP BY plate 
            ORDER BY name desc`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listImages(id) {
        try {
            const sql = `
            SELECT pi.id, pi.url, DATE_FORMAT(pi.datereg, '%H:%i %d/%m/%Y') as datereg, pi.id_patrimony, replace(pi.url, 'https://ansarepositorie.s3.amazonaws.com/', '') as name
            FROM patrimonyimage pi
            WHERE pi.id_patrimony = ? 
            GROUP BY pi.url`
            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listDetails(id) {
        try {
            const sql = `
            SELECT pd.title, pd.description, DATE_FORMAT(pd.datereg, '%H:%i %d/%m/%Y') as datereg, pd.id
            FROM patrimonydetails pd
            WHERE pd.id_patrimony = ? 
            GROUP BY pd.title`
            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listTypes(offices) {
        try {
            let sql = `
            SELECT DISTINCT(pa.type) as name
            FROM patrimony pa 
            WHERE pa.type NOT LIKE "%'%" AND pa.status = 1 `

            if (offices) sql += ` AND pa.office IN (${offices}) `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    update(patrimony) {
        try {
            const sql = ` UPDATE patrimony SET name = ?, plate = ?, description = ?, note = ?, office = ? WHERE id = ?`

            return query(sql, [patrimony.name, patrimony.plate, patrimony.description, patrimony.note, patrimony.office, patrimony.id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    updateDetail(detail) {
        try {
            const sql = ` UPDATE patrimonydetails SET description = ? WHERE id = ?`

            return query(sql, [detail.description, detail.id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    delete(id) {
        try {
            const sql = `UPDATE patrimony SET status = 0 WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }
    
    deleteImage(id) {
        try {
            const sql = `DELETE from patrimonyimage WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }
}

module.exports = new SurveyMonkey()