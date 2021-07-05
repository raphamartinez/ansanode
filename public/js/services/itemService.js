const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const listItems =  async (search) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/items` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            search: search
        })
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

const listModal =  async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/stockandgroup` , {
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

const listStocks =  async (artcode) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/stockbyitem/${artcode}` , {
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

export const ServiceItem = {
    listItems,
    listModal,
    listStocks
}