

const header = () => {
    const div = document.createElement('div')

    div.innerHTML = `
`

    return div
}


const table = () => {
    const div = document.createElement('div')
    div.innerHTML = `
`

    return div
}

export const View = {
    header,
    table
}