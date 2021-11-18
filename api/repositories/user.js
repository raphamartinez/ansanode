const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class User {
    async insert(user) {
        try {
            const sql = `INSERT INTO ansa.user (name, mailenterprise, perfil, dateBirthday, status, id_login, dateReg) values (?, ?, ?, ?, ?, ?, now() - interval 3 hour )`
            await query(sql, [user.name, user.mailenterprise, user.perfil, user.dateBirthday, user.status, user.login.id_login])

            const sqlId = 'select LAST_INSERT_ID() as id_user from ansa.user LIMIT 1'
            const obj = await query(sqlId)
            return obj[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el usuario en la base de datos')
        }
    }

    async delete(id_user) {
        try {
            const sql = `DELETE from ansa.user WHERE id_user = ${id_user}`
            await query(sql)
            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario en la base de datos')
        }
    }

    async deleteStatus(status, id_login) {
        try {
            const sql = `UPDATE ansa.user set status = ? WHERE id_login = ?`
            await query(sql, [status, id_login])
            
            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario en la base de datos')
        }
    }

    async update(user) {
        try {
            const sql = 'UPDATE ansa.user SET name = ?, perfil = ?, dateBirthday = ?, mailenterprise = ? WHERE id_user = ?'
            await query(sql, [user.name, user.perfil, user.dateBirthday, user.mailenterprise, user.id_user])
            return true
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_user) {
        try {
            const sql = `SELECT US.name, US.mailenterprise, US.perfil, DATE_FORMAT(US.dateBirthday, '%d/%m/%Y') as dateBirthday, DATE_FORMAT(US.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.login LO, ansa.user US WHERE 
            US.id_login = LO.id_login and LO.id_login = ${id_user}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del usuario')
        }
    }

    async viewAdm(id_login) {
        try {
            const sql = `SELECT US.id_user, US.id_login, US.name, US.mailenterprise, US.perfil, LO.mail, DATE_FORMAT(US.dateBirthday, '%d/%m/%Y') as dateBirthdayDesc, DATE_FORMAT(US.dateBirthday, '%Y-%m-%d') as dateBirthday, DATE_FORMAT(US.dateReg, '%H:%i %d/%m/%Y') as dateReg FROM ansa.login LO, ansa.user US WHERE 
            US.id_login = LO.id_login  and LO.id_login = ${id_login}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del usuario')
        }
    }

    list() {
        try {
            const sql = `SELECT US.id_user, US.id_login, US.name, US.mailenterprise, US.perfil, LO.mail, US.id_office, DATE_FORMAT(US.dateBirthday, '%d/%m/%Y') as dateBirthday, DATE_FORMAT(US.dateBirthday, '%Y-%m-%d') as dateBirthdayDesc, DATE_FORMAT(US.dateReg, '%H:%i %d/%m/%Y') as dateReg 
            FROM ansa.user US, ansa.login LO WHERE LO.id_login = US.id_login and US.status = 1 `
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los usuarios')
        }
    }
}

module.exports = new User()