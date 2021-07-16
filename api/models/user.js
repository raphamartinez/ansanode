const Repositorie = require('../repositories/user')
const RepositorieLogin = require('../repositories/login')
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
                    office: {
                        id_office: data.user.office.id_office
                    },
                    login: {
                        id_login: obj.id_login
                    }
                }

                const result = await Repositorie.insert(user)

                return result
            } else {
                throw new InvalidArgumentError('Error, ya existe este email!')
            }
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    async deleteStatus(id_user) {
        try {
            const status = 0
            const result = await Repositorie.deleteStatus(status, id_user)
            return result
        } catch (error) {
            throw new NotFound('Error')
        }
    }

    async updateUser(data, id_user) {

        try {
            const verifyMail = await RepositorieLogin.checkMail(data.user.mail)

            if (verifyMail !== true) {
                const user = {
                    id_user: id_user,
                    name: data.user.name,
                    mailenterprise: data.user.mailenterprise,
                    perfil: data.user.perfil,
                    dateBirthday: data.user.dateBirthday,
                    office: {
                        id_office: data.user.id_office
                    }
                }

                const login = {
                    id_login: data.user.id_login,
                    mail: data.user.mail
                }

                await Repositorie.update(user)
                await RepositorieLogin.update(login)
                return true
            } else {
                throw new InvalidArgumentError('Ya existe Este email!')
            }
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    async listUsers() {
        try {
            let data = await Repositorie.list()

            data.forEach(obj => {
                switch (obj.perfil) {
                    case 1: obj.perfilDesc = "Admin"
                        break

                    case 2: obj.perfilDesc = "Vendedor"
                        break

                    case 3: obj.perfilDesc = "Depositero"
                        break

                    case 4: obj.perfilDesc = "Gerente"
                        break

                    case 5: obj.perfilDesc = "Personal administrativo"
                        break

                    default: obj.perfilDesc = "Usuario"
                        break
                }

                if (!obj.mailenterprise) obj.mailenterprise = "" 
                if(obj.dateBirthday === '00/00/0000') obj.dateBirthday = ""
            })

            return data

        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async viewUser(id_user) {
        try {
            const user = await Repositorie.view(id_user)
            return user
        } catch (error) {
            throw new NotFound('Error')
        }
    }
}

module.exports = new User