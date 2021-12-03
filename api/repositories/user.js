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
            const sql = 'UPDATE ansa.user SET name = ?, perfil = ?, dateBirthday = ?, mailenterprise = ? WHERE id_login = ?'
            await query(sql, [user.name, user.perfil, user.dateBirthday, user.mailenterprise, user.id_login])
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

    list(id) {
        try {
            let sql = `SELECT us.id_user, us.id_login, us.name, if(us.mailenterprise = null, "", us.mailenterprise) as mailenterprise , us.perfil, lo.mail, us.id_office, if( DATE_FORMAT(us.dateBirthday, '%d/%m/%Y') = "00/00/0000", "", DATE_FORMAT(us.dateBirthday, '%d/%m/%Y')) as dateBirthday, DATE_FORMAT(us.dateBirthday, '%Y-%m-%d') as dateBirthdayDesc, DATE_FORMAT(us.dateReg, '%H:%i %d/%m/%Y') as dateReg ,
                        CASE
                                    WHEN us.perfil = 1 THEN "Admin"
                                    WHEN us.perfil = 2 THEN "Vendedor"
                                    WHEN us.perfil = 3 THEN "Depositero"
                                    WHEN us.perfil = 4 THEN "Gerente"
                                    WHEN us.perfil = 5 THEN "Personal administrativo"
                                    WHEN us.perfil = 6 THEN "Encarregado de Sucursal"
                                    WHEN us.perfil = 7 THEN "Auditor"
                                    ELSE "Usuario"
                                END as perfilDesc
                        FROM ansa.user us
                        INNER JOIN ansa.login lo ON us.id_login = lo.id_login 
                        WHERE lo.id_login = us.id_login 
                        and us.status = 1 `

            if (id) sql += ` and lo.id_login = ${id}`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los usuarios')
        }
    }
}

module.exports = new User()