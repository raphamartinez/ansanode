import { Connection } from '../services/connection.js'
import { Loading } from './loadingController.js'

const adjustModalDatatable = () => {
    $('#dataCrm').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
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

const submitNewProduct = (event) => {
    event.preventDefault()

    const product = {
        name: document.querySelector('#newproduct').value,
        type: '',
        code: '',
        classification: document.querySelector('#newclassification').value
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

    document.querySelector('#newproducts').appendChild(option)
    document.querySelector('#newproduct').value = ""
    document.querySelector('#newclassification').selectedIndex = 0
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

    try {
        let selectproducts = document.querySelectorAll('[data-products] option');
        let products = Array.from(selectproducts).map(el => JSON.parse(el.value));

        if (products.length == 0) return alert("Se debe describir al menos un artículo ofrecido.");

        Loading.enable('[data-btn-add]');

        const crm = {
            contactdate: event.currentTarget.contactdate.value,
            client: event.currentTarget.client.value,
            name: event.currentTarget.name.value,
            phone: event.currentTarget.phone.value,
            mail: event.currentTarget.mail.value,
            description: event.currentTarget.description.value,
            products: products
        };

        document.querySelector('[data-products]').innerHTML = "";
        document.querySelector('[data-form-crm]').reset();

        const obj = await Connection.body('crm', { crm }, 'POST');

        Loading.disable('[data-btn-add]', 'Agregar Contacto');

        alert(obj.msg);
    } catch (error) {
        Loading.disable('[data-btn-add]', 'Agregar Contacto');
    }
}

const viewSearch = async () => {
    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.code
        line.innerHTML = office.name

        document.querySelector('[data-office]').appendChild(line)
    })

    $('[data-office]').selectpicker("refresh");

    const workers = await Connection.noBody('clock/workers', 'GET')
    workers.forEach(worker => {
        const line = document.createElement('option')
        line.value = worker.code
        line.innerHTML = worker.name

        document.querySelector('[data-code]').appendChild(line)
    })

    $('[data-code]').selectpicker("refresh");

}

const table = async (data) => {

    let crms = data.map(crm => {
        let options = `
        <a><i data-action data-id="${crm.id}" class="btn-view fas fa-eye"></i></a>
        <a><i data-action data-id="${crm.id}" class="btn-add fas fa-plus" style="color: #6495ED;"></i></a>
        <a><i data-action data-id="${crm.id}" data-user="${crm.user}" data-client="${crm.client}" data-description="${crm.description}" data-name="${crm.name}" data-phone="${crm.phone}" data-mail="${crm.mail}" data-contactdate="${crm.contactdatereg}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${crm.id}" class="btn-delete fas fa-trash"></i></a>`
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

    $("#dataCrm").DataTable()
        .columns
        .adjust()
        .draw();
}

const changeProbability = async (event) => {
    if (event.target && event.target.matches('[data-classification-edit]')) {
        const id = event.target.getAttribute('data-classification-edit')
        const value = event.target.value

        await Connection.body(`crm/products/${id}`, { value }, "PUT")
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

        let div = `<div class="container-fluid text-center"><div class="card card-shadow shadow text-center"><h4><strong>Productos</strong></h4><div class="form-row justify-content-md-center"><div class="align-self-center text-center mb-4">
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
            <option value="${product.classification}" disabled selected>${product.classificationdesc} - Seleccionado</option>
            </select>`

            return [
                `<a><i onclick="modalDeleteProduct(event)" data-id="${product.id}" class="btn-delete fas fa-trash"></i></a>`,
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
                { title: "Opciones" },
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

const addNewProduct = (event) => {
    const tr = event.path[3];
    if (tr.className === "child") tr = tr.previousElementSibling;

    const id = event.target.getAttribute('data-id');

    $('#addProduct').modal('show');

    const submit = async (event2) => {
        event2.preventDefault();

        let selectproducts = document.querySelectorAll('#newproducts option');
        let products = Array.from(selectproducts).map(el => JSON.parse(el.value));

        if (products.length == 0) return alert("Se debe describir al menos un artículo ofrecido.");

        const obj = await Connection.body(`crm/products/${id}`, { products }, 'POST');

        document.querySelector('#newproducts').innerHTML = "";
        $('#addProduct').modal('hide');

        alert(obj.msg);
        document.querySelector('[data-add-new-crmproduct]').removeEventListener('submit', submit, false);
    }

    document.querySelector('[data-add-new-crmproduct]').addEventListener('submit', submit, false);
}

const modalDeleteProduct = (event) => {
    try {
        const tr = event.path[3];
        if (tr.className === "child") tr = tr.previousElementSibling;

        const id = event.target.getAttribute('data-id');

        $('#dropProduct').modal('show');

        const submit = async (event2) => {
            event2.preventDefault();

            const obj = await Connection.noBody(`crm/products/${id}`, 'DELETE');

            $('#dropProduct').modal('hide');

            tr.remove();

            alert(obj.msg);
            document.querySelector('[data-drop-crmproduct]').removeEventListener('submit', submit, false);
        }

        document.querySelector('[data-drop-crmproduct]').addEventListener('submit', submit, false);

    } catch (error) {

    }

}
window.modalDeleteProduct = modalDeleteProduct

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
    event.preventDefault();

    try {
        Loading.enable('[data-btn-search]')

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

        const data = await Connection.noBody(`crm/${search.start}/${search.end}/${search.offices}/${search.sellers}`, 'GET')

        if (data.crms.length < 1) {
            document.querySelector('[data-div-table-crms]').classList.add('d-none')
            document.querySelector('[data-div-chart-crms]').classList.add('d-none')

            Loading.disable('[data-btn-search]', 'Buscar')

            return alert('No hay contactos en el período informado.')
        }


        document.querySelector('[data-div-chart-crms]').classList.remove('d-none')
        document.querySelector('[data-div-table-crms]').classList.remove('d-none')

        table(data.crms)
        graphClient(data.clients)
        graphType(data.types)
        graphDate(data.days)

        Loading.disable('[data-btn-search]', 'Buscar')

        $('html,body').animate({
            scrollTop: $('[data-div-chart-crms]').offset().top - 100
        }, 'slow');
    } catch (error) {
        Loading.disable('[data-btn-search]', 'Buscar')
    }
}



viewCreate()
viewSearch()


document.querySelector('[data-add-product]').addEventListener('click', addProduct, false)
document.querySelector('[data-add-new-product]').addEventListener('click', submitNewProduct, false)
document.querySelector('[data-form-crm]').addEventListener('submit', create, false)
document.querySelector('[data-search-crm]').addEventListener('submit', search, false)

const edit = (event) => {

    let tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    const id = event.target.getAttribute('data-id');
    const user = event.target.getAttribute('data-user');

    let crm = {
        id: event.target.getAttribute('data-id'),
        contactdate: event.target.getAttribute('data-contactdate'),
        client: event.target.getAttribute('data-client'),
        name: event.target.getAttribute('data-name'),
        phone: event.target.getAttribute('data-phone'),
        mail: event.target.getAttribute('data-mail'),
        description: event.target.getAttribute('data-description'),
    }

    document.querySelector('#contactdateedit').value = crm.contactdate
    document.querySelector('#clientedit').value = crm.client
    document.querySelector('#nameedit').value = crm.name
    document.querySelector('#phoneedit').value = crm.phone
    document.querySelector('#mailedit').value = crm.mail
    document.querySelector('#descriptionedit').value = crm.description

    $('#editCrm').modal('show');

    const submit = async (event2) => {
        event2.preventDefault();

        let newCrm = {
            id: id,
            contactdate: event2.currentTarget.contactdate.value,
            client: event2.currentTarget.client.value,
            name: event2.currentTarget.name.value,
            phone: event2.currentTarget.phone.value,
            mail: event2.currentTarget.mail.value,
            description: event2.currentTarget.description.value,
        }

        const obj = await Connection.body(`crm/${id}`, { newCrm }, 'PUT');

        $(`#dataCrm`).DataTable()
            .row(tr)
            .remove()
            .draw();

        let date = new Date(newCrm.contactdate);
        let dateReg = new Date(newCrm.contactdate);

        const rowNode = $(`#dataCrm`).DataTable()
            .row
            .add(
                [
                    `
        <a><i data-action data-id="${id}" class="btn-view fas fa-eye"></i></a>
        <a><i data-action data-id="${id}" class="btn-add fas fa-plus" style="color: #6495ED;"></i></a>
        <a><i data-action data-id="${id}" data-client="${newCrm.client}" data-description="${newCrm.description}" data-name="${newCrm.name}" data-phone="${newCrm.phone}" data-mail="${newCrm.mail}" data-contactdate="${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${id}" class="btn-delete fas fa-trash"></i></a>`,
                    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                    newCrm.client,
                    newCrm.name,
                    newCrm.phone,
                    newCrm.mail,
                    newCrm.description,
                    user,
                    `${dateReg.getDate()}/${dateReg.getMonth() + 1}/${dateReg.getFullYear()}`
                ])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });

        $("#editCrm").modal('hide');

        document.querySelector('[data-edit-crm]').removeEventListener('submit', submit, false);

        alert(obj.msg);
    }

    document.querySelector('[data-edit-crm]').addEventListener('submit', submit, false);
}

const drop = (event) => {
    const tr = event.path[3];
    if (tr.className === "child") tr = tr.previousElementSibling;

    const id = event.target.getAttribute('data-id');

    $('#dropCrm').modal('show');

    const submit = async (event2) => {
        event2.preventDefault();
        const obj = await Connection.noBody(`crm/${id}`, 'DELETE');

        $(`#dataCrm`).DataTable()
            .row(tr)
            .remove()
            .draw();

        $("#dropCrm").modal('hide');

        document.querySelector('[data-drop-crm]').removeEventListener('submit', submit, false);

        alert(obj.msg);
    }

    document.querySelector('[data-drop-crm]').addEventListener('submit', submit, false);
}

document.querySelector('#dataCrm').addEventListener('click', (event) => {
    if (event.target && (event.target.nodeName === "I" || event.target.nodeName === "SPAN") && event.target.matches("[data-action]")) {
        if (event.target.classList[0] === 'btn-view') return view(event)
        if (event.target.classList[0] === 'btn-edit') return edit(event)
        if (event.target.classList[0] === 'btn-delete') return drop(event)
        if (event.target.classList[0] === 'btn-add') return addNewProduct(event)
    }
})


