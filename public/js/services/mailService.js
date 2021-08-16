const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const listMails =  async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/mails` , {
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

const insertMailSchedule =  async (mailschedule) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/mail` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            mailschedule: mailschedule
        })
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

const insertAttachment =  async (attachment) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/attachment` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            attachment: attachment
        })
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

const insertSchedule =  async (scheduling) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/scheduling` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            scheduling: scheduling
        })
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

const viewMail =  async (id_mailpowerbi) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/mail/${id_mailpowerbi}` , {
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

const deleteMailSchedule =  async (id_mailpowerbi) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/mail/${id_mailpowerbi}` , {
        method: 'DELETE',
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

const deleteSchedule =  async (id_mailscheduling) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/scheduling/${id_mailscheduling}` , {
        method: 'DELETE',
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

const deleteAttachment =  async (id_mailattachment) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/attachment/${id_mailattachment}` , {
        method: 'DELETE',
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


export const ServiceMail= {
    listMails,
    insertMailSchedule,
    insertAttachment,
    insertSchedule,
    viewMail,
    deleteMailSchedule,
    deleteSchedule,
    deleteAttachment
}