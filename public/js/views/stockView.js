const modaladd = (id_login) => {
    const div = document.createElement('div')

    const content = `

`
    div.innerHTML = content

    return div
}

const modaldelete = (id_stock, id_login) => {
    const div = document.createElement('div')

    const content = `

`
    div.innerHTML = content

    return div
}

const listStock = (stock, id_login) => {
    const content = [
        `<a onclick="modalDeleteStock(event)" href="" data-id_stock="${stock.id_stock}" data-id_login="${id_login}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${stock.name}`
    ]

    return content
}

const listOption = (doc) => {
    const line = document.createElement('option')

    line.value = doc

    const content = ` ${doc}</option>`

    line.innerHTML = content

    return line
}


export const ViewStock = {
    modaladd,
    modaldelete,
    listStock,
    listOption
}