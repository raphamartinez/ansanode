const Repositorie = require('../repositories/login')
const { InvalidArgumentError, NotFound } = require('./error')
const bcrypt = require('bcrypt')
const Token = require('./token')
const Mail = require('./mail')

class Login {

    async viewLogin(id_login) {
        try {
            const login = await Repositorie.view(id_login)
            return login
        } catch (error) {
            throw new NotFound('Login not found')
        }
    }

    async generateTokens(id) {
        try {
            const accessToken = Token.access.create(id)
            const refreshToken = await Token.refresh.create(id)
            const token = { accessToken, refreshToken }

            return token
        } catch (error) {
            throw new InternalServerError('Error on generated Tokens')
        }
    }

    async logout(token) {
        try {
            await Token.access.invalid(token)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async searchMail(mail) {
        try {
            const login = await Repositorie.viewMail(mail)
            return login
        } catch (error) {
            throw new NotFound('Mail not found')
        }
    }

    async listLogin() {
        try {
            return Repositorie.list()

        } catch (error) {
            throw new InternalServerError('Error on list')
        }
    }

    async insertLogin(data) {
        try {
            const password = generatePasswordHash(data.password)

            const login = {
                mail: data.mail,
                password: password,
                mailVerify: 1,
                status: 1
            }

            const result = await Repositorie.insert(login)

            return result
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    async forgotPassword(mail) {
        try {
            const login = await Repositorie.viewMail(mail)
            const token = await Token.resetPassword.create(login.id_login)
            Mail.ResetPasswordMail(login, token)
        } catch (error) {
            throw new NotFound('Mail not found')
        }
    }

    async changePassword(token, password) {
        try {
            if (typeof token !== 'string' || token.lenght === 0) {
                throw new InvalidArgumentError('O token está inválido')
            }

            const id = await Token.resetPassword.verify(token)
            await Login.viewLogin(id)
            await Login.updatePassword(password, id)
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    async updatePassword(data, id_login) {
        try {
            const passwordHash = await Login.generatePasswordHash(data.password)

            const passwordValid = await bcrypt.compare(data.passwordconf, passwordHash)
            if (!passwordValid) {
                throw new NotAuthorized()
            }

            const result = await Repositorie.updatePassword(passwordHash, id_login)

            return result
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }

    }

    async verifyMail(id_login) {
        try {
            const mail = true

            const result = await Repositorie.verifyMail(mail, id_login)

            return result
        } catch (error) {
            throw new NotFound('Not Found')
        }
    }

    static generatePasswordHash(password) {
        const costHash = 12
        return bcrypt.hash(password, costHash)
    }

}

module.exports = new Login