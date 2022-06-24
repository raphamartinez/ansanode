import { Connection } from '../services/connection.js'

const formInventoryOnline = document.querySelector('[data-form-inventory-online]')

const listInventory = async (id) => {
    document.querySelector('[data-loading]').style.display = "block"
    const items = await Connection.noBody(`inventory/${id}`, 'GET')
    document.querySelector('[data-loading]').style.display = "none"
    return items
}


const createInventory = async (event) => {
    event.preventDefault()
    const stock = event.target.stock.value
    document.querySelector('[data-loading]').style.display = "block"
    const inventory = await Connection.noBody(`inventory/new/${stock}`, 'GET')
    document.querySelector('[data-loading]').style.display = "none"
    const date = new Date()
    transformArr(inventory.items)
    generateCard(inventory.id, stock, date)
    generateHtml(inventory.id, stock, date)
    $('.selectpicker').selectpicker('refresh')
}

const generateHtml = (id, stock, date, edit = '') => { 
    document.querySelector('[data-generate-report-online]').setAttribute('action', `/report/inventory/${id}`)
    document.querySelector('[data-generate-report-online]').innerHTML = `<input type="hidden" name="stock" value="${stock}">
    <button type="submit" class="btn btn-info">Generar Informe</button>`
    document.querySelector('[data-inventory]').dataset.id = id
    document.querySelector('[data-inventory]').innerHTML = `Stock: ${stock}`
    document.querySelector('[data-inventory-subtitle]').innerHTML = `Fecha: ${date.toLocaleString()}`
    if(edit == ''){
        document.querySelector('[data-inventory-delete]').innerHTML = `<form action='/inventory/delete/${id}' method='POST'><button type="submit" class="btn btn-danger">Borrar Archivo</button></form><br>`
    }else{
        document.querySelector('[data-inventory-delete]').innerHTML = ''
    }
}

const generateCard = (id, stock, date) => {
    document.querySelector('[data-no-archives]').innerHTML = ''

    const div = document.createElement('div')
    div.classList.add('card', 'border', 'border-success', 'rounded-3', 'col-md-3', 'text-success', 'mb-2', 'mr-2', 'ml-2')
    div.innerHTML = ` <a data-inventory-view="${id}" data-stock="${stock}" data-date="${date}" data-edit="">
    <div class="card-body">
        <h5 class="card-title">Stock: ${stock}
        </h5>
        <h6 class="card-subtitle mb-2">
         Creado ahora por ti
        </h6>
        <h6 class="card-subtitle mb-2">0% Concluído</h6>
        <p class="card-text">Fecha de Registro: ${date.toLocaleString()}
        </p>
    </div>
    </a>`

    document.querySelector('[data-inventories]').appendChild(div)
}

const transformArr = (itemsdt) => {
    const date = new Date()
    let items = itemsdt.map((item, i) => {
        const qty = item.Qty ? item.Qty : 0 + item.Reserved ? item.Reserved : 0

        return [
            item.GroupDesc,
            item.ArtCode,
            item.ArtName,
            item.Labels,
            qty,
            `<input ${item.edit} tabindex="${i + 1}" data-item="${item.ArtCode}"  data-column="" data-index="1" value="${item.v1}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 2}" data-item="${item.ArtCode}"  data-column="" data-index="2" value="${item.v2}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 3}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 10}" data-index="3" value="${item.v3}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 4}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 9}" data-index="4" value="${item.v4}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 5}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 8}" data-index="5" value="${item.v5}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 6}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 7}" data-index="6" value="${item.v6}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 7}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 6}" data-index="7" value="${item.v7}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 8}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 5}" data-index="8" value="${item.v8}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 9}" data-item="${item.ArtCode}"  data-column="${date.getFullYear() + 4}" data-index="9" value="${item.v9}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 10}" data-item="${item.ArtCode}" data-column="${date.getFullYear() + 3}"   data-index="10" value="${item.v10}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 11}" data-item="${item.ArtCode}" data-column="${date.getFullYear() + 2}"   data-index="11" value="${item.v11}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 12}" data-item="${item.ArtCode}" data-column="${date.getFullYear() + 1}"   data-index="12" value="${item.v12}" type="number" class="form-control goal text-center">`,
            `<input ${item.edit} tabindex="${i + 13}" data-item="${item.ArtCode}" data-column="${date.getFullYear()}"   data-index="13" value="${item.v13}" type="number" class="form-control goal text-center">`
        ]
    })
    showTable(items)
}

const showTable = (items = []) => {
    const date = new Date()
    if ($.fn.DataTable.isDataTable('#tableInventory')) {
        $('#tableInventory').dataTable().fnClearTable();
        $('#tableInventory').dataTable().fnDestroy();
        $('#tableInventory').empty();
    }

    $("#tableInventory").DataTable({
        data: items,
        columns: [
            { title: 'Grupo' },
            { title: 'Cod. Articulo' },
            { title: 'Descripción' },
            { title: 'Etiqueta' },
            { title: 'Stock' },
            { title: '________' },
            { title: '________' },
            { title: date.getFullYear() - 10 },
            { title: date.getFullYear() - 9 },
            { title: date.getFullYear() - 8 },
            { title: date.getFullYear() - 7 },
            { title: date.getFullYear() - 6 },
            { title: date.getFullYear() - 5 },
            { title: date.getFullYear() - 4 },
            { title: date.getFullYear() - 3 },
            { title: date.getFullYear() - 2 },
            { title: date.getFullYear() - 1 },
            { title: date.getFullYear() }
        ],
        orderFixed: [[0, 'desc']],
        rowGroup: {
            startRender: function (rows, group) {
                return $('<tr/>').append(`<td colspan="18" style="background-color:#4E73DF !important; color:#FFFFFF !important; font-size: 1em; !important">${group}</td>`)
            },
            dataSrc: 0,
        },
        paging: true,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoWidth: true,
        pagingType: "numbers",
        fixedHeader: false,
        order: false
    })
}

$(document).on('keypress', '.goal', async function (event) {
    if (event.which == 13) {
        event.preventDefault()
        let next = $('[tabIndex=' + (+this.tabIndex + 1) + ']')
        if (!next.length) next = $('[tabIndex=1]')
        next.focus()
        let status = 3
        const btn = event.currentTarget
        const item = {
            inventory: document.querySelector('[data-inventory]').getAttribute('data-id'),
            code: btn.getAttribute('data-item'),
            column: btn.getAttribute('data-column'),
            index: btn.getAttribute('data-index'),
            amount: btn.value
        }
        if (item.amount && item.amount > -1) status = await Connection.body(`inventory/item`, { item }, 'POST')
        toast(status, item)
    }
})

const toast = (status, item) => {
    switch (status) {
        case 1: {
            toastr.success(`Cod Articulo: ${item.code}<br>Valor: ${item.amount}`, "Inventario agregado con éxito!", {
                progressBar: true
            })
        }
            break
        case 2: {
            toastr.warning(`No fue cambiado ya que no hay modificaciones.`, "Aviso!", {
                progressBar: true
            })
        }
            break
        case 3: {
            toastr.error(`Verifique lo valor insertado, uno erro fue generado.<br>Si el error persiste, actualice la página.`, "Erro en lo Inventario!", {
                progressBar: true
            })
        }
            break
    }
}

const viewInventory = async (event) => {
    for (let index = 0; index < 4; index++) {
        const obj = event.path[index];
        if (obj.nodeName == 'A') {
            const id = obj.getAttribute('data-inventory-view')
            const stock = obj.getAttribute('data-stock')
            const date = obj.getAttribute('data-date')
            const edit = obj.getAttribute('data-edit')
            const items = await listInventory(id)
            generateHtml(id, stock, date, edit)
            transformArr(items)
        }
    }
}


document.querySelector('[data-inventories]').addEventListener('click', viewInventory)

formInventoryOnline.addEventListener('submit', createInventory)
