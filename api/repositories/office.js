const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Office {

    async insert(office) {
        try {
            const sql = 'INSERT INTO office (name, status, dateReg) set (?, ?, now() - interval 4 hour )'
            const result = await query(sql, [office.name, office.status])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async delete(id_office) {
        try {
            const sql = `DELETE from office WHERE id_office = ${id_office}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    async update(office) {
        try {
            const sql = 'UPDATE office SET name = ?  WHERE id_office = ?'
            const result = await query(sql, [office.name, office.id_office])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_office) {
        try {
            const sql = `SELECT * FROM office where id_office = ${id_office}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new NotFound('Error de vista previa de la sucursal')
        }
    }

    list(office) {
        try {
            let sql = `SELECT FF.id_office, FF.code, FF.name, DATE_FORMAT(FF.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.office FF WHERE FF.status = 1`

            if(office) sql += ` and FF.code = '${office}'`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Office()