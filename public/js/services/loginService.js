const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const login = async (mail, password) => {
    const data = await fetch(`${protocol}//${url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mail: mail,
            password: password
        })
    })

    if (data.ok) {
        return data.json()
    }

    throw new Error('usuario o la contraseña no son válidos')
}

const refresh = async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))

    const data = await fetch(`${protocol}//${url}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: refreshToken,
            accessToken: accessToken
        })
    })

    if (data.ok) {
        const token = data.json()

        localStorage.setItem('accessToken', JSON.stringify(token.accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(token.refreshToken))
    }

    throw new Error('error')
}

const logout = async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))

    const data = await fetch(`${protocol}//${url}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            refreshToken: refreshToken
        })
    })

    if (data.ok) {
        return data.json()
    }

    throw new Error('error')
}

const password = async (password,token) => {

    const data = await fetch(`${protocol}//${url}/resetPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: password,
            token: token
        })
    })

    if (data.ok) {
        return data.json()
    }

    throw new Error('error')
}

const forgot = async (mail) => {

    const data = await fetch(`${protocol}//${url}/forgotPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mail: mail
        })
    })

    if (data.ok) {
        return data.json()
    }

    throw new Error('error')
}

export const LoginService = {
    login,
    logout,
    refresh,
    password,
    forgot
}