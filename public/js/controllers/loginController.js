import { LoginService } from '../services/loginService.js'

window.onSubmit = onSubmit

async function onSubmit() {

    const mail = document.querySelector('[data-mail]').value
    const password = document.querySelector('[data-password]').value

    try {

        const data = await LoginService.login(mail, password)

        const accessToken = data.accessToken
        const refreshToken = data.refreshToken

        const user = data.user

        sessionStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('accessToken', JSON.stringify(accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken))

        window.location.href = data.url

    } catch (error) {
        alert(error)
    }
}

window.onLogout = onLogout

async function onLogout() {

    try {
        const data = await LoginService.logout()

        sessionStorage.clear()
        localStorage.clear()

        window.location.href = data.url
    } catch (error) {
        alert(error)
    }
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
            const data = await LoginService.password(pass, token)
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

        const data = await LoginService.forgot(mail)
        alert(data.message)
        window.location.href = data.url
    } catch (error) {
        alert(error)
    }
}