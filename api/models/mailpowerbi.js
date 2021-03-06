const Repositorie = require('../repositories/mail')
const { InvalidArgumentError, InternalServerError } = require('./error')
const Mail = require('./mail')
const Webscraping = require('./webscraping')
const nodemailer = require('nodemailer')
const fs = require('fs')
const PDFMerger = require('pdf-merger-js');

class MailPowerBi {

    async insertMailPowerBi(mail, id_login) {
        try {
            const id_mailpowerbi = await Repositorie.insertMail(mail, id_login)

            return id_mailpowerbi
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el mail.')
        }
    }

    async insertMailAttachment(mail) {
        try {
            let objs = []

            for (let url of mail.urls) {
                let id = await Repositorie.insertAttachment(url, mail.id_mailpowerbi)

                let attachment = {
                    id,
                    url
                }

                objs.push(attachment)
            }

            return objs
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo crear el attachment.')
        }
    }

    async insertMailScheduling(mail) {
        try {
            let objs = []

            for (let obj of mail.schedule) {
                const date = new Date(obj)
                const formatDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00:00`
                let id = await Repositorie.insertScheduling(formatDate, mail.id_mailpowerbi)

                let schedule = {
                    date,
                    id
                }

                objs.push(schedule)
            }

            return objs
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el attachment.')
        }
    }

    async insertMailPeriod(mail) {
        try {
            let objs = []

            for (let weekday of mail.weekday) {
                let id = await Repositorie.insertPeriod(weekday, mail)

                let period = {
                    weekday,
                    id
                }

                objs.push(period)
            }

            return objs
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el periodo.')
        }
    }

    async updateMailPowerBi(mail) {
        try {
            const result = await Repositorie.updateMail(mail)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    async updateMailAttachment(attachment) {
        try {
            const result = await Repositorie.updateAttachment(attachment)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    async deleteMailPowerBi(id_mailpowerbi) {
        try {
            const result = await Repositorie.deleteMail(id_mailpowerbi)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    async deleteMailAttachment(id_mailattachment) {
        try {
            const result = await Repositorie.deleteAttachment(id_mailattachment)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    async deleteMailScheduling(id_mailscheduling) {
        try {
            const result = await Repositorie.deleteScheduling(id_mailscheduling)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    listMailPowerBi(id_login) {
        try {
            return Repositorie.listMail(id_login)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi.')
        }
    }

    async listMailtoSend() {
        try {

            const mails = await Repositorie.listMailtoSend()

            for (const mail of mails) {
                const objects = await Repositorie.listAttachment(mail.id_mailpowerbi)
                let attachments = []

                for (const obj of objects) {

                    let path = `./informes${obj.id_mailattachment}`
                    await Webscraping.printPowerBi(obj.url, path)

                    const attachment = {
                        filename: `informes-${obj.id_mailattachment}.pdf`,
                        path: `${path}.pdf`
                    }
                    attachments.push(attachment)
                }

                let send

                if (mail.type === 1) {

                    const merger = new PDFMerger();

                    for (const attachment of attachments) {
                        merger.add(attachment.path)
                    }

                    await merger.save(attachments[0].path);

                    send = new Mail.AttachmentBi(mail.title, mail.body, mail.recipients, mail.cc, mail.cco, attachments[0])

                } else {
                    send = new Mail.AttachmentBi(mail.title, mail.body, mail.recipients, mail.cc, mail.cco, attachments)
                }

                const transport = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWORD
                    }
                })

                await transport.sendMail(send)

                for (const obj of objects) {
                    fs.unlinkSync(`./informes${obj.id_mailattachment}.pdf`)
                }

                console.log("enviado com sucesso");
            }

        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async viewMail(id_mailpowerbi) {
        try {
            const details = await Repositorie.viewMail(id_mailpowerbi)

            details.forEach(obj => {
                if (obj.type === 1) {
                    obj.type = "Reunir"
                } else {
                    obj.type = "Mant??ngase separado"
                }
            })
            const attachment = await Repositorie.listAttachment(id_mailpowerbi)

            const scheduling = await Repositorie.listScheduling(id_mailpowerbi)

            const mail = {
                details,
                attachment,
                scheduling
            }

            return mail

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi.')
        }
    }
}

module.exports = new MailPowerBi