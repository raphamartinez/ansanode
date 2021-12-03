const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Office {

    async insert(id_login, id_office) {
        try {
            const sql = 'INSERT INTO officeuser (id_login, id_office) values (?, ?)'
            const result = await query(sql, [id_login, id_office])
            return result[0]
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async delete(id_login) {
        try {
            const sql = `DELETE from officeuser WHERE id_login = ?`
            const result = await query(sql, id_login)

            return result[0]
        } catch (error) {
            console.log(error);
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

    list(id_login) {
        try {
            let sql

            if (id_login) {
                sql = `SELECT FF.id_office, FF.code, FF.name, DATE_FORMAT(FF.dateReg, '%H:%i %d/%m/%Y') as dateReg 
            FROM ansa.office FF 
            INNER JOIN ansa.officeuser OS ON OS.id_office = FF.id_office
            WHERE FF.status = 1 and OS.id_login = '${id_login}'`
            } else {
                sql = `SELECT FF.id_office, FF.code, FF.name, DATE_FORMAT(FF.dateReg, '%H:%i %d/%m/%Y') as dateReg 
            FROM ansa.office FF WHERE FF.status = 1`
            }
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Office()