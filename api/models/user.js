const Repositorie = require('../repositories/user')
const RepositorieLogin = require('../repositories/login')
const RepositorieOffice = require('../repositories/office')

const bcrypt = require('bcrypt')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class User {

    static generatePasswordHash(password) {
        const costHash = 12
        return bcrypt.hash(password, costHash)
    }

    async insertUser(data) {
        try {
            const password = await User.generatePasswordHash(data.user.login.password)
            const verifyMail = await RepositorieLogin.checkMail(data.user.login.mail)

            if (verifyMail === true) {
                const login = {
                    mail: data.user.login.mail,
                    password: password,
                    mailVerify: 1,
                    status: 1
                }

                const obj = await RepositorieLogin.insert(login)

                const user = {
                    name: data.user.name,
                    perfil: data.user.perfil,
                    mailenterprise: data.user.mailenterprise,
                    dateBirthday: data.user.dateBirthday,
                    status: 1,
                    offices: data.user.offices,
                    login: {
                        id_login: obj.id_login
                    }
                }

                const us = await Repositorie.insert(user)

                await data.user.offices.forEach(async office => {
                    await RepositorieOffice.insert(obj.id_login, office)
                })

                const result = {
                    id_login: obj.id_login,
                    id_user: us.id_user
                }

                return result
            } else {
                throw new InvalidArgumentError('Ya existe un usuario con este acceso, cámbielo.')
            }
        } catch (error) {
            throw new InvalidArgumentError('No se pudo registrar un nuevo usuario.')
        }
    }

    async deleteStatus(id_login) {
        try {
            const result = await Repositorie.deleteStatus(0, id_login)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario.')
        }
    }

    async updateUser(data, id) {

        try {

            const user = {
                id_login: id,
                name: data.name,
                mailenterprise: data.mailenterprise,
                perfil: data.perfil,
                dateBirthday: data.dateBirthday,
                offices: data.office
            }

            const login = {
                id_login: id,
                mail: data.mail
            }

            await Repositorie.update(user)
            await RepositorieLogin.update(login)

            await RepositorieOffice.delete(login.id_login)

            if (Array.isArray(user.offices)) {
                for (let office of user.offices) {
                    await RepositorieOffice.insert(login.id_login, office)
                }
            } else {
                await RepositorieOffice.insert(login.id_login, user.offices)
            }

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el usuario.')
        }
    }

    async listUsers(perfil, id, offices) {
        try {
            return Repositorie.list(perfil, id, offices)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los usuarios.')
        }
    }

    async viewUser(id_user) {
        try {
            const user = await Repositorie.view(id_user)

            return user
        } catch (error) {
            throw new NotFound('Usuario.')
        }
    }

    async view(id_login) {
        try {
            const user = await Repositorie.view(id_login)
            const offices = await RepositorieOffice.list(id_login)

            if (offices.length > 0) {
                user.offices = offices
            } else {
                user.offices = []
            }

            if (!user.mailenterprise) {
                user.mailenterpriseDesc = "No informado"
                user.mailenterprise = " "
            } else {
                user.mailenterpriseDesc = user.mailenterprise
            }

            return user
        } catch (error) {
            throw new NotFound('Usuario.')
        }
    }
}

module.exports = new User