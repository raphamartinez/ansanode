import { Connection } from '../services/connection.js'

const sellers = async () => {
    try {
        const sellers = await Connection.noBody('sellershbs', 'GET')

        sellers.forEach(salesman => {
            const option = document.createElement('option')
            option.value = `{"name":"${salesman.name}", "code":"${salesman.code}", "office":"${salesman.office}"}`
            option.innerHTML = `${salesman.code} - ${salesman.name}`

            document.getElementById('salesmanselect').appendChild(option)
        })

        $('#salesmanselect').selectpicker("refresh");

    } catch (error) {
        alert(error)
    }
}

const managers = async () => {
    try {
        const users = await Connection.noBody('users', 'GET')

        users.forEach(user => {
            const option = document.createElement('option')
            option.value = user.id_login
            option.innerHTML = user.name

            document.getElementById('managerselect').appendChild(option)
        })

        $('#managerselect').selectpicker("refresh");

    } catch (error) {
        alert(error)
    }
}

const list = async () => {

    try {


        if ($.fn.DataTable.isDataTable('#tablesalesman')) {
            $('#tablesalesman').dataTable().fnClearTable();
            $('#tablesalesman').dataTable().fnDestroy();
            $('#tablesalesman').empty();
        }

        const data = await Connection.noBody('sellers', 'GET')

        let dtview = data.map(salesman => {
            return [
                `<a><i data-view data-id="${salesman.id_salesman}" data-name="${salesman.name}" class="fas fa-user-circle" style="color:#cbccce; padding: 2px;"></i></a>
                <a><i data-drop data-id="${salesman.id_salesman}" class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>`,
                salesman.name,
                salesman.manager,
                salesman.dateReg
            ]
        });


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
        })

        sellers()
        managers()

    } catch (error) {
        alert(error)
    }
}

list()


const add = async (event) => {
    event.preventDefault()

    try {
        const arrsellers = document.querySelectorAll('#salesmanselect option:checked')
        const sellers = Array.from(arrsellers).map(el => `${el.value}`);

        $('#addsalesman').modal('hide')
        const obj = await Connection.body('salesman', { sellers }, 'POST')

        const rowNode = await $('#tablesalesman').DataTable()
        const date = new Date()

        obj.sellers.forEach(salesman => {
            rowNode
                .row
                .add([
                    `<a><i data-view data-id="${salesman.id_salesman}" data-name="${salesman.name}" class="fas fa-user-circle" style="color:#cbccce; padding: 2px;"></i></a>
                    <a><i data-drop data-id="${salesman.id_salesman}" class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>`,
                    salesman.name,
                    "",
                    `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
                ])
                .draw()
                .node();

            $(rowNode)
                .css('color', 'black')
                .animate({ color: '#4e73df' });

        })

        alert(obj.msg)

    } catch (error) {
        console.log(error);
        $('#addsalesman').modal('hide')
    }
}

document.querySelector('[data-add-salesman]').addEventListener('submit', add, false)


const drop = async (event) => {
    const tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    const id = event.target.getAttribute('data-id')

    $('#dropmodal').modal("show")

    const submit = async (event2) => {
        event2.preventDefault()

        const obj = await Connection.noBody(`salesman/${id}`, 'DELETE')

        $('#tablesalesman').DataTable()
            .row(tr)
            .remove()
            .draw();

        $('#dropmodal').modal('hide')

        document.querySelector('[data-drop-salesman]').removeEventListener('submit', submit, false)
        alert(obj.msg)
    }

    document.querySelector('[data-drop-salesman]').addEventListener('submit', submit, false)
}

const view = async (event) => {

    try {
        const tr = event.path[3]
        if (tr.className === "child") tr = tr.previousElementSibling

        const id = event.target.getAttribute('data-id')
        const name = event.target.getAttribute('data-name')

        $('#addManager').modal('show')

        const submit = async (event2) => {
            event2.preventDefault()

            const manager = {
                id_salesman: id,
                name: document.querySelector('#managerselect option:checked').innerHTML,
                id: event2.currentTarget.managerselect.value
            }

            $('#addManager').modal('hide')

            let date = new Date()

            const obj = await Connection.body(`salesman/${manager.id_salesman}`, { manager }, 'PUT')

            const rowNode = await $('#tablesalesman').DataTable()

            rowNode
                .row(tr)
                .remove()
                .draw();

            rowNode
                .row
                .add([
                    `<a><i data-view data-id="${id}" class="fas fa-user-circle" style="color:#cbccce; padding: 2px;"></i></a>
                    <a><i data-drop data-id="${id}" class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>`,
                    name,
                    manager.name,
                    `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
                ])
                .draw()
                .node();

            $(rowNode)
                .css('color', 'black')
                .animate({ color: '#4e73df' });


            document.querySelector('[data-add-manager]').removeEventListener('submit', submit, false)
            alert(obj.msg)
        }

        document.querySelector('[data-add-manager]').addEventListener('submit', submit, false)

    } catch (error) {

    }
}


const action = (event) => {
    if (event.target && event.target.matches('[data-view]')) return view(event)
    if (event.target && event.target.matches('[data-drop]')) return drop(event)
}

document.querySelector("#tablesalesman").addEventListener('click', action, false)
