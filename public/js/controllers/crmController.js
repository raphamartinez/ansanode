import { View } from "../views/crmView.js"
import { Connection } from '../services/connection.js'

const adjustModalDatatable = () => {
    $('#dataCrm').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}


const clean = () => {
    document.querySelector('[data-card]').style.display = 'none';

    document.querySelector('[data-title]').innerHTML = `CRM - Gestión de relaciones con el cliente`;
    document.querySelector('[data-powerbi]').innerHTML = ""
    document.querySelector('[data-modal]').innerHTML = ""
    document.querySelector('[data-settings]').innerHTML = ""
    document.querySelector('[data-features]').innerHTML = ""

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }
}

const adm = async () => {
    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.code
        line.innerHTML = office.name

        document.querySelector('[data-office]').appendChild(line)
    })

    $('[data-office]').selectpicker();

    const workers = await Connection.noBody('clock/workers', 'GET')
    workers.forEach(worker => {
        const line = document.createElement('option')
        line.value = worker.code
        line.innerHTML = worker.name

        document.querySelector('[data-code]').appendChild(line)
    })

    $('[data-code]').selectpicker();
    $('[data-type]').selectpicker();
}

const addProduct = (event) => {
    event.preventDefault()

    const product = {
        name: document.querySelector('#product').value,
        type: '',
        code: '',
        classification: document.querySelector('#classification').value
    }

    Array.from(document.querySelector('[data-product]').children).forEach(option => {
        if (option.value == product.name) {
            let type = option.innerHTML
            let split = type.split("-")

            product.code = split[0]
            product.type = split[1]
        }
    })

    if (!product.name) return alert('Necesita informar el producto para agregar a la lista.')
    if (!product.classification) return alert('Classifique el contacto.')

    const option = document.createElement('option')

    option.value = JSON.stringify(product)
    option.innerHTML = product.name

    document.querySelector('[data-products]').appendChild(option)
    document.querySelector('#product').value = ""
    document.querySelector('#classification').selectedIndex = 0
}

const viewCreate = async () => {
    const items = await Connection.noBody('items/all', 'GET')
    items.forEach(item => {
        const line = document.createElement('option')

        line.value = item.name
        line.innerHTML = `${item.code} - ${item.type}`

        document.querySelector('[data-product]').appendChild(line)
    })

    const clients = await Connection.noBody('clients', 'GET')
    clients.forEach(client => {
        const line = document.createElement('option')
        line.value = client.CustName
        line.innerHTML = client.CustCode

        document.querySelector('[data-client]').appendChild(line)
    })
}

const create = async (event) => {
    event.preventDefault();

    let selectproducts = document.querySelectorAll('[data-products] option');
    let products = Array.from(selectproducts).map(el => JSON.parse(el.value));

    if (products.length == 0) return alert("Se debe describir al menos un artículo ofrecido.")

    const crm = {
        contactdate: event.currentTarget.contactdate.value,
        client: event.currentTarget.client.value,
        name: event.currentTarget.name.value,
        phone: event.currentTarget.phone.value,
        mail: event.currentTarget.mail.value,
        description: event.currentTarget.description.value,
        products: products
    };

    document.querySelector('[data-products]').innerHTML = ""
    document.querySelector('[data-form-crm]').reset();

    const obj = await Connection.body('crm', { crm }, 'POST')

    alert(obj.msg)
}

const viewSearch = async () => {
    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.code
        line.innerHTML = office.name

        document.querySelector('[data-office]').appendChild(line)
    })

    $('[data-office]').selectpicker();

    const workers = await Connection.noBody('clock/workers', 'GET')
    workers.forEach(worker => {
        const line = document.createElement('option')
        line.value = worker.code
        line.innerHTML = worker.name

        document.querySelector('[data-code]').appendChild(line)
    })

    $('[data-code]').selectpicker();

}

const table = async (data) => {

    document.querySelector('[data-div-table-crms]').classList.remove('d-none')

    let crms = data.map(crm => {
        let options = `<a><i data-action data-id="${crm.id}" class="btn-view fas fa-eye"></i></a>`
        let line = [
            options,
            crm.contactdate,
            crm.client,
            crm.name,
            crm.phone,
            crm.mail,
            crm.description,
            crm.user,
            crm.datereg
        ]

        return line
    })

    if ($.fn.DataTable.isDataTable('#dataCrm')) {
        $('#dataCrm').dataTable().fnClearTable();
        $('#dataCrm').dataTable().fnDestroy();
        $('#dataCrm').empty();
    }

    const table = $("#dataCrm").DataTable({
        destroy: true,
        data: crms,
        columns: [
            { title: "Opciones" },
            { title: "Fecha de Contacto" },
            { title: "Cliente" },
            { title: "Nombre" },
            { title: "Teléfono" },
            { title: "E-mail" },
            { title: "Descripción Adicionale" },
            { title: "Vendedor" },
            { title: "Fecha de Registro" }
        ],
        paging: true,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        pagingType: "numbers",
        searchPanes: true,
        searching: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    })

    document.querySelector('#dataCrm').addEventListener('click', (event) => {
        if (event.target && (event.target.nodeName === "I" || event.target.nodeName === "SPAN") && event.target.matches("[data-action]")) {
            if (event.target.classList[0] === 'btn-view') return view(event)
        }
    })

}
//
const view = async (event) => {

    document.querySelector('[data-loading]').style.display = "block"

    const id = event.target.getAttribute('data-id')
    let i = event.target
    let tr = event.path[3]

    if (tr.className === "child") tr = tr.previousElementSibling

    const products = await Connection.noBody(`crm/products/${id}`, "GET")

    if (products.length === 0) {
        document.querySelector('[data-loading]').style.display = "none"

        return alert('No hay articulos ofrecidos.')
    }

    let row = $('#dataCrm').DataTable()
        .row(tr)

    if (row.child.isShown()) {
        tr.classList.remove('bg-dark', 'text-white')
        i.classList.remove('fas', 'fa-eye-slash', 'text-white')
        i.classList.add('fas', 'fa-eye')

        row.child.hide();
        tr.classList.remove('shown')
        document.querySelector('[data-loading]').style.display = "none"

        adjustModalDatatable()
    } else {

        tr.classList.add('bg-dark', 'text-white')
        i.classList.add('fas', 'fa-eye-slash', 'text-white')

        let div = `<div class="container-fluid text-center"><div class="card card-shadow shadow"><h4><strong>Productos</strong></h4><div class="form-row justify-content-md-center"><div class="align-self-center text-center mb-4">
        <table data-products-${id} id="dataproducts" style="background-color: rgba(90, 159, 236, .1); padding-top: 0.3rem; left: 50%" class="table text-center table-hover table-bordered " cellpadding="0" cellspacing="0" border="0">
        </table></div></div></div></div>`

        row.child(div).show()

        let productsdata = products.map(product => {
            return [
                product.code,
                product.name,
                product.type,
                product.classification
            ]
        })

        if ($.fn.DataTable.isDataTable(`[data-products-${id}]`)) {
            $(`[data-products-${id}]`).dataTable().fnClearTable();
            $(`[data-products-${id}]`).dataTable().fnDestroy();
            $(`[data-products-${id}]`).empty();
        }

        $(`[data-products-${id}]`).DataTable({
            data: productsdata,
            columns: [
                { title: "Code" },
                { title: "Nombre" },
                { title: "Tipo" },
                { title: "Probabilidad de Venta" }
            ],
            paging: false,
            ordering: true,
            info: false,
            scrollY: false,
            scrollCollapse: true,
            scrollX: true,
            autoHeight: true,
            pagingType: "numbers",
            searchPanes: false,
            searching: false,
            fixedHeader: false
        })


        tr.classList.add('shown')
        i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
        i.classList.add('fas', 'fa-eye-slash', 'text-white')
        document.querySelector('[data-loading]').style.display = "none"
        adjustModalDatatable()
    }
}

const search = async (event) => {
    event.preventDefault()

    let selectoffice = document.querySelectorAll('#office option:checked')
    let offices = Array.from(selectoffice).map(el => `'${el.value}'`);
    if (offices.length === 0) offices[0] = "ALL"

    let selectsellers = document.querySelectorAll('#code option:checked')
    let sellers = Array.from(selectsellers).map(el => `'${el.value}'`);
    if (sellers.length === 0) sellers[0] = "ALL"

    const search = {
        start: event.currentTarget.start.value,
        end: event.currentTarget.end.value,
        offices: offices,
        sellers: sellers
    };

    if (!search.start || !search.end) {
        return alert("¡El período es obligatorio!")
    }

    document.querySelector('[data-loading]').style.display = "block"

    const data = await Connection.noBody(`crm/${search.start}/${search.end}/${search.offices}/${search.sellers}`, 'GET')
    table(data)

    document.querySelector('[data-loading]').style.display = "none"
}

const dashboard = async () => {
    document.querySelector('[data-loading]').style.display = "block"

    //clean the page
    clean()

    // let user = JSON.parse(sessionStorage.getItem('user'))
    document.querySelector('[data-features]').appendChild(View.header())
    document.querySelector('[data-features]').appendChild(View.table())

    viewCreate()
    viewSearch()

    document.querySelector('[data-loading]').style.display = "none"

    document.querySelector('[data-add-product]').addEventListener('click', addProduct, false)
    document.querySelector('[data-form-crm]').addEventListener('submit', create, false)
    document.querySelector('[data-search-crm]').addEventListener('submit', search, false)
}

document.querySelector('[data-menu-crm]').addEventListener('click', dashboard, false)