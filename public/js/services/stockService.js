const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]


const list =  async (id_login) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/stocks/${id_login}` , {
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

const add =  async (stock, id_login) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/stock` , {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            stock: stock,
            id_login: id_login
        })
    })

    if (data.ok === true) {
        return data.json()
    }
    
    throw new Error('error')
}

const deleteStock =  async (id_stock) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/stock/${id_stock}` , {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (data.ok === true) {
        return data
    }
    
    throw new Error('error')
}


export const ServiceStock = {
    list,
    add,
    deleteStock
}