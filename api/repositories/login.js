const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Login {

    async insert(login) {
        try {
            const sql = 'INSERT INTO login (mail, password, mailVerify, status, dateReg ) values (?, ?, ?, ?, now() - interval 4 hour )'
            const result = await query(sql, [login.mail, login.password, login.mailVerify, login.status])

            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async delete(id_login) {
        try {
            const sql = `DELETE from login WHERE id_login = ${id_login}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el login en la base de datos')
        }
    }

    async update(login) {
        try {
            const sql = 'UPDATE login SET mail = ? WHERE id_login = ?'
            await query(sql, [login.mail, login.id_login])
            return true
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }

    }

    async updatePassword(password, id_login) {
        try {
            const sql = 'UPDATE login SET password = ? WHERE id_login = ?'
            await query(sql, [password, id_login])
            return 'Contraseña actualizada exitosamente'
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_login) {
        try {
            const sql = `SELECT us.name, us.perfil, us.mailenterprise, us.id_login 
            FROM login lo
            INNER JOIN user us ON lo.id_login = us.id_login
            where lo.id_login = ? and lo.status = 1`

            const result = await query(sql, id_login)

            return result[0]
        } catch (error) {
            throw new InternalServerError('Error en la vista previa del login')
        }
    }

    list() {
        try {
            const sql = 'SELECT * FROM login'
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async viewMail(mail) {
        try {
            const sql = `SELECT lo.mail, lo.password, lo.id_login FROM login lo, user us where lo.mail = '${mail}' and lo.status = 1 and us.id_login = lo.id_login`
            const result = await query(sql)

            if (!result[0]) {
                throw new InvalidArgumentError(`El nombre de usuario o la contraseña no son válidos`)
            }

            return result[0]
        } catch (error) {
            throw new InternalServerError('El nombre de usuario o la contraseña no son válidos')
        }
    }

    async viewMailEnterprise(mailenterprise) {
        try {
            const sql = `SELECT lo.mail, lo.password, lo.id_login, us.mailenterprise FROM login lo, user us where us.mailenterprise = '${mailenterprise}' and lo.status = 1 and us.id_login = lo.id_login`
            const result = await query(sql)

            if (!result[0]) {
                return false
            }

            return result[0]
        } catch (error) {
            throw new InternalServerError('El nombre de usuario o la contraseña no son válidos')
        }
    }

    async verifyMail(mail, id_login) {
        try {
            const sql = `UPDATE login SET mailVeify = ? WHERE id_login = ?`
            const result = await query(sql, [mail, id_login])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }


    async checkMail(mail) {
        try {
            const sql = `SELECT mail FROM login WHERE mail = '${mail}'`
            const result = await query(sql, mail)

            if (!result[0]) {
                return true
            }

            return false
        } catch (error) {
            throw new InternalServerError('El nombre de usuario o la contraseña no son válidos')
        }
    }

}

module.exports = new Login()