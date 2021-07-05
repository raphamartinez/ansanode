const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const insertUser =  async (user) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/user` , {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            user: user
        })
    })

    if (data.ok === true) {
        return data.json()
    }
    
    throw new Error('error')
}

const listOffice =  async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/offices` , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}


const updateUser =  async (user,id_user) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/user/${id_user}` , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            user: user
        })
    })

    const result = await data.json()

    if (result === true) {
        return result
    }
    throw new Error('error')
}

const deleteUser =  async (id_user) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/user/${id_user}` , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const result = await data.json()

    if (result === true) {
        return result
    }
    throw new Error('error')
}

const viewUser =  async (id_user) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/user` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            id_user: id_user
        })
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}


const listUsers =  async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/users` , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

export const Service = {
    insertUser,
    updateUser,
    deleteUser,
    viewUser,
    listUsers,
    listOffice
}