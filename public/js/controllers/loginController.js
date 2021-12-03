import { Connection } from '../services/connection.js'

window.onSubmit = onSubmit

async function onSubmit() {
    document.querySelector('[data-form]').submit()
}


window.onPassword = onPassword

async function onPassword(event) {
    event.preventDefault()
    try {

        var url = window.location.pathname
        var token = url.substring(13)

        const pass = document.getElementById("password").value;
        const passconf = document.getElementById("passwordconf").value;

        if (pass === passconf) {
            const data = await Connection.noBearer('resetPassword', { pass, token }, 'POST')

            alert(data.message)
            window.location.href = data.url
        }
    } catch (error) {
        alert(error)
    }
}

window.onForgot = onForgot

async function onForgot(event) {
    event.preventDefault()
    try {

        const mail = document.querySelector('[data-mail]').value

        const data = await Connection.noBearer('forgotPassword', { mail }, 'POST')

        alert(data.message)
        window.location.href = data.url
    } catch (error) {
        alert(error)
    }
}