import { ViewSalesman } from "../views/salesmanView.js"
import { Connection } from '../services/connection.js'

window.salesmanList = salesmanList

async function salesmanList(event) {
    event.preventDefault()

    try {

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        if ($.fn.DataTable.isDataTable('#tablesalesman')) {
            $('#tablesalesman').dataTable().fnClearTable();
            $('#tablesalesman').dataTable().fnDestroy();
            $('#tablesalesman').empty();
        }

        const data = await Connection.noBody('sellers', 'GET')

        let dtview = [];
        data.forEach(obj => {
            const field = ViewSalesman.newLine(obj)
            dtview.push(field)
        });

        let user = JSON.parse(sessionStorage.getItem('user'))

        if (user.perfil !== 1) {
            $(document).ready(function () {
                $("#tablesalesman").DataTable({
                    data: dtview,
                    columns: [
                        { title: "Opciones" },
                        { title: "Nombre del Vendedor" },
                        { title: "Gerente" },
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
                    fixedHeader: false
                }
                )
            })
        } else {
            $(document).ready(function () {
                $("#tablesalesman").DataTable({
                    data: dtview,
                    columns: [
                        { title: "Opciones" },
                        { title: "Nombre del Vendedor" },
                        { title: "Gerente" },
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
                    fixedHeader: false,
                    dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
                        "<'row'<'col-sm-12'B>>",
                    buttons: [
                        'copy', 'csv', 'excel', 'pdf', 'print'
                    ]
                }
                )
            })
        }

    } catch (error) {
        console.log(error);
        alert(error)
    }
}

window.modalAddSalesman = modalAddSalesman

async function modalAddSalesman(event) {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ''
        modal.appendChild(ViewSalesman.modalAddSalesman(search))

        const salesmanselect = document.getElementById('salesmanselect')
        const sellers = await Connection.noBody('sellershbs', 'GET')

        sellers.forEach(salesman => {
            salesmanselect.appendChild(ViewSalesman.optionSellers(salesman))
        })
        loading.innerHTML = " "

        $('#modalsalesman').modal('show')
    } catch (error) {
        loading.innerHTML = " "
        alert(error)
    }
}

window.addSalesman = addSalesman

async function addSalesman(event) {
    event.preventDefault()
    $('#modalsalesman').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `

    try {
        const arrsellers = document.querySelectorAll('#salesmanselect option:checked')
        const sellers = Array.from(arrsellers).map(el => `${el.value}`);

        await Connection.body('salesman', { sellers }, 'POST')

        salesmanList(event)

        loading.innerHTML = " "
        alert('Vendedor agregado con éxito!')

    } catch (error) {
        loading.innerHTML = " "
        alert(error)
    }
}

window.modalDeleteSalesman = modalDeleteSalesman

async function modalDeleteSalesman(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_salesman = btn.getAttribute("data-id_salesman")

        modal.innerHTML = ''
        modal.appendChild(ViewSalesman.deleteSalesman(id_salesman))

        $('#deleteSalesman').modal('show')

    } catch (error) {

    }
}

window.deleteSalesman = deleteSalesman

async function deleteSalesman(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_salesman = btn.getAttribute("data-id_salesman")

        await Connection.noBody(`salesman/${id_salesman}`, 'DELETE')

        salesmanList(event)

        $('#deleteSalesman').modal('hide')
        modal.innerHTML = ''

        alert('Vendedor eliminado con éxito!')
    } catch (error) {
        $('#deleteSalesman').modal('hide')
        modal.innerHTML = ''
    }
}

window.modalAddManager = modalAddManager

async function modalAddManager(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_salesman = btn.getAttribute("data-id_salesman")

        modal.innerHTML = ''
        modal.appendChild(ViewSalesman.modalAddManager(id_salesman))

        const users = await Connection.noBody('users', 'GET')
        const managerselect = document.getElementById('managerselect')

        users.forEach(obj => {
            managerselect.appendChild(ViewSalesman.optionManager(obj))
        })

        $('#modalAddManager').modal('show')

    } catch (error) {

    }
}

window.AddManager = AddManager

async function AddManager(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const manager = {
            id_login: document.getElementById('managerselect').value,
            id_salesman: btn.getAttribute("data-id_salesman")
        }

        await Connection.body(`salesman/${manager.id_salesman}`, { manager }, 'PUT')

        salesmanList(event)

        $('#modalAddManager').modal('hide')
        modal.innerHTML = ''

        alert('Gerente agregado con éxito!')
    } catch (error) {
        $('#modalAddManager').modal('hide')
        modal.innerHTML = ''
    }
}