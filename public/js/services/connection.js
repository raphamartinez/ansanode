const host = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const noBody = async (method, url) => {
    let count = 1
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (result.status === 401) {
            do {
                count = 0
                refresh()
                noBody(url)
            } while (count)
        }

        return result.json()
    } catch (error) {
        return error
    }
}

const body = async (url, data, method) => {
    let count = 1
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        })

        if (result.status === 401) {
            do {
                count = 0
                refresh()
                noBody(url, data, method)
            } while (count)
        }

        return result.json()

    } catch (error) {
        return error
    }
}

const noBearer = async (url, data, method) => {
    const result = await fetch(`${protocol}//${host}/${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (result.ok) {
        return result.json()
    }

    throw new Error('Usuario o la contraseña no son válidos')
}


const refresh = async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))

    const data = await fetch(`${protocol}//${host}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: refreshToken,
            accessToken: accessToken
        })
    })

    if (data.status === 401) {
        sessionStorage.clear()
        localStorage.clear()

        window.location.href = '../public/login.html'

        alert('Acceso Caducado')
    }

    if (data.ok) {
        const token = data.json()

        localStorage.setItem('accessToken', JSON.stringify(token.accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(token.refreshToken))

        return true
    }

    throw new Error('error')
}

export const Connection = {
    noBody,
    body,
    noBearer,
    refresh
}


