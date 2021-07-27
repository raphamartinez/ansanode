const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const listBiUser =  async (type) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbis/${type}` , {
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

const listUser =  async (id) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbisuser/${id}` , {
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

const insertBi =  async (powerbi) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbi` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            powerbi: powerbi
        })
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}


const updateBi =  async (powerbi, id) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbi/${id}` , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            powerbi: powerbi
        })
    })

    const result = await data.json()

    if (result === true) {
        return result
    }
    throw new Error('error')
}

const deleteBi =  async (id) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbi/${id}` , {
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

const viewBi =  async (id) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbi/${id}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

const listComplete =  async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/powerbis` , {
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
    listBiUser,
    listUser,
    insertBi,
    updateBi,
    deleteBi,
    viewBi,
    listComplete
}