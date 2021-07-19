const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]


const listfile =  async (details) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/files/${details.type}/${details.title}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (data.ok) {
        return data.json()
    }

    throw new Error('Usuario o la contraseña no son válidos')
}

const upload =  async (formData) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/file` , {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

const deleteFile =  async (id_file) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    const data = await fetch(`${protocol}//${url}/file/${id_file}` , {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (data.ok) {
        return data.json()
    }
    throw new Error('error')
}

export const ServiceFile = {
    listfile,
    upload,
    deleteFile
}