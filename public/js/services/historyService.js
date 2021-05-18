const context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const url = window.location.host;

const historyDashoard =  async () => {
    const data = await fetch(`http://${url}/history`)

    if (data.ok) {
        return data.json()
    }
    throw new Error('usuario o la contraseña no son válidos')
}

const listHistory =  async () => {
    const data = await fetch(`http://${url}/historys`)

    if (data.ok) {
        return data.json()
    }

    throw new Error('usuario o la contraseña no son válidos')
}

export const Service = {
    historyDashoard,
    listHistory
}