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
                throw new InvalidArgumentError('Ya existe un usuario con este acceso, cámbielo.')
            }
        } catch (error) {
            throw new InvalidArgumentError('No se pudo registrar un nuevo usuario.')
        }
    }

    async deleteStatus(id_user) {
        try {
            const status = 0
            const result = await Repositorie.deleteStatus(status, id_user)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario.')
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
                throw new InvalidArgumentError('Ya existe un usuario con este acceso, cámbielo.')
            }
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el usuario.')
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

    async viewUserAdm(id_login) {
        try {
            const user = await Repositorie.viewAdm(id_login)

            switch (user.perfil) {
                case 1: user.perfilDesc = "Admin"
                    break

                case 2: user.perfilDesc = "Vendedor"
                    break

                case 3: user.perfilDesc = "Depositero"
                    break

                case 4: user.perfilDesc = "Gerente"
                    break

                case 5: user.perfilDesc = "Personal administrativo"
                    break

                default: user.perfilDesc = "Usuario"
                    break
            }

            if (!user.mailenterprise) {
                user.mailenterpriseDesc = "No informado" 
                user.mailenterprise = " "
            } else{
                user.mailenterpriseDesc = user.mailenterprise
            }
            if(user.dateBirthday === '00/00/0000'){
                user.dateBirthdayDesc = "No informado"
                user.dateBirthday = " "
            } else{
                user.dateBirthdayDesc = user.dateBirthday
            }

            
            return user
        } catch (error) {
            throw new NotFound('Usuario.')
        }
    }
}

module.exports = new User