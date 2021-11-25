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

    const clients = await Connection.noBody('clients/hbs', 'GET')
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

    $("#dataCrm").DataTable({
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

    $("#dataCrm").DataTable().columns.adjust();
}

const changeProbability = async (event) => {
    if (event.target && event.target.matches('[data-classification-edit]')) {
        const id = event.target.getAttribute('data-classification-edit')
        const value = event.target.value

        await Connection.body(`crm/products/${id}`, {value}, "PUT")
    }
}
window.changeProbability = changeProbability

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

            let classification = product.classificationdesc
            if (product.classification != "0") classification = `<select onchange="changeProbability(event)" data-classification-edit="${product.id}" class="form-control" id="classificationedit">
            <option value="" disabled>Editar</option>
            <option value="1">-50%</option>
            <option value="2">50%</option>
            <option value="3">75%</option>
            <option value="4">100%</option>
            <option value="${product.classification}" disabled selected>${product.classificationdesc} - Selecionado</option>
            </select>`

            return [
                product.code,
                product.name,
                product.type,
                classification
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

const graphClient = (clients) => {

    const canvas = document.createElement('canvas')
    canvas.style.maxHeight = "600px"
    canvas.classList.add('flex', 'd-inline')
    canvas.setAttribute('data-chart-client', '0')

    document.querySelector('[div-chart-client]').innerHTML = ''
    document.querySelector('[div-chart-client]').appendChild(canvas)

    const ctxclient = document.querySelector('[data-chart-client]')

    let days = Array.from(clients).map(obj => obj.date)
    let client = Array.from(clients).map(obj => obj.client)

    if (days.length < 1) days = 'Sin clientes'
    if (client.length < 1) client = 0

    new Chart(ctxclient, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Clientes por dia',
                data: client,
                backgroundColor: [
                    'rgba(89, 171, 227, 1)',
                ],
                borderColor: [
                    'rgba(44, 130, 201, 1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
}

const graphDate = (dates) => {

    const canvas = document.createElement('canvas')
    canvas.style.maxHeight = "600px"
    canvas.classList.add('flex', 'd-inline')
    canvas.setAttribute('data-chart-date', '0')

    document.querySelector('[div-chart-date]').innerHTML = ''
    document.querySelector('[div-chart-date]').appendChild(canvas)

    const ctxdate = document.querySelector('[data-chart-date]')

    let days = Array.from(dates).map(obj => obj.date)
    let products = Array.from(dates).map(obj => obj.products)

    if (days.length < 1) days = 'Sin productos'
    if (products.length < 1) products = 0

    new Chart(ctxdate, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Productos por dia',
                data: products,
                backgroundColor: [
                    'rgba(30, 139, 195, 0.5)',
                ],
                borderColor: [
                    'rgba(137, 196, 244, 1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });

}

const graphType = (types) => {

    const canvas = document.createElement('canvas')
    canvas.style.maxHeight = "300px"
    canvas.classList.add('flex', 'd-inline')
    canvas.setAttribute('data-chart-type', '0')

    document.querySelector('[div-chart-type]').innerHTML = ''
    document.querySelector('[div-chart-type]').appendChild(canvas)

    const ctxtype = document.querySelector('[data-chart-type]')

    let type = Array.from(types).map(obj => obj.type)
    let products = Array.from(types).map(obj => obj.products)

    if (type.length < 1) type = 'Sin productos'
    if (products.length < 1) products = 0

    new Chart(ctxtype, {
        type: 'doughnut',
        data: {
            labels: type,
            datasets: [{
                label: 'Productos por Tipo',
                data: products,
                backgroundColor: [
                    'rgba(30, 139, 195, 0.5)',
                    'rgba(3, 201, 169, 0.5)',
                    'rgba(245, 229, 27, 0.5)',
                ],
                borderColor: [
                    'rgba(137, 196, 244, 1)',
                    'rgba(183, 244, 216, 1)',
                    'rgba(255, 255, 204, 1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "#000",
                    fontSize: 18,
                    fontStyle: "bold"
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            },
        }
    });
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

    if (data.crms.length < 1) {
        document.querySelector('[data-div-table-crms]').classList.add('d-none')
        document.querySelector('[data-div-chart-crms]').classList.add('d-none')

        return alert('No hay contactos en el período informado.')
    }

    table(data.crms)
    graphClient(data.clients)
    graphType(data.types)
    graphDate(data.days)

    document.querySelector('[data-div-chart-crms]').classList.remove('d-none')
    document.querySelector('[data-div-table-crms]').classList.remove('d-none')


    $('html,body').animate({
        scrollTop: $('[data-div-chart-crms]').offset().top - 100
    }, 'slow');

    document.querySelector('[data-loading]').style.display = "none"
}

const dashboard = async () => {
    document.querySelector('[data-loading]').style.display = "block"
    clean()

    document.querySelector('[data-features]').appendChild(View.header())
    document.querySelector('[data-features]').appendChild(View.table())

    viewCreate()
    viewSearch()

    document.querySelector('[data-loading]').style.display = "none"

    document.querySelector('[data-add-product]').addEventListener('click', addProduct, false)
    document.querySelector('[data-form-crm]').addEventListener('submit', create, false)
    document.querySelector('[data-search-crm]').addEventListener('submit', search, false)

    document.querySelector('#dataCrm').addEventListener('click', (event) => {
        if (event.target && (event.target.nodeName === "I" || event.target.nodeName === "SPAN") && event.target.matches("[data-action]")) {
            if (event.target.classList[0] === 'btn-view') return view(event)
        }
    })
}

document.querySelector('[data-menu-crm]').addEventListener('click', dashboard, false)