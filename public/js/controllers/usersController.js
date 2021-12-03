// import { View } from "../views/userView.js"
import { Connection } from '../services/connection.js'


const password = async (event) => {
    event.preventDefault()

    const id = event.currentTarget.id

    document.querySelector('[data-loading]').style.display = "block"

    const login = {
        password: event.currentTarget.password.value,
        passwordconf: event.currentTarget.passwordconf.value,
        id_login: id
    }

    const obj = await Connection.body('changepass', { login }, 'POST')

    document.querySelector('[data-loading]').style.display = "none"
    $('#modalpassword').modal('hide')

    alert(obj.msg)

    document.querySelector('[data-form-password]').removeEventListener('submit', password, false)
}


const del = async (event) => {
    event.preventDefault()

    const id = event.currentTarget.id

    document.querySelector('[data-loading]').style.display = "block"

    const obj = await Connection.noBody(`user/${id}`, 'DELETE')

    $("#delete").modal('hide')

    document.querySelector('[data-loading]').style.display = "none"
    alert(obj.msg)

    document.querySelector('[data-form-delete]').removeEventListener('submit', del, false)

}

const edit = async (eventsubmit, id_login, id_user) => {
    eventsubmit.preventDefault()

    const selectoffice = document.querySelectorAll('#office option:checked')
    const offices = Array.from(selectoffice).map(el => `${el.value}`);

    const newuser = {
        id_login: id_login,
        id_user: id_user,
        name: eventsubmit.currentTarget.name.value,
        dateBirthday: eventsubmit.currentTarget.dateBirthday.value,
        perfil: eventsubmit.currentTarget.perfil.value,
        perdilDesc: document.querySelector('#perfil option:checked').innerHTML,
        mail: eventsubmit.currentTarget.mail.value,
        mailenterprise: eventsubmit.currentTarget.mailenterprise.value,
        offices: offices
    }

    const obj = await Connection.body(`user/${id_user}`, { user: newuser }, 'PUT')

    document.querySelector('[data-view-mail]').innerHTML = `<strong>Acceso: </strong>${newuser.mail}`
    document.querySelector('[data-view-mailenterprise]').innerHTML = `<strong>E-mail Organização: </strong>${newuser.mailenterprise}`
    document.querySelector('[data-view-dateBirthday]').innerHTML = `<strong>Fecha de Nacimiento: </strong>${newuser.dateBirthday}`
    document.querySelector('[data-view-office]').innerHTML = `<strong>Sucursal: </strong>${newuser.offices}`
    document.querySelector('[data-view-profile]').innerHTML = `<strong>Perfil: </strong>${newuser.perdilDesc}`

    let session = JSON.parse(sessionStorage.getItem('user'))

    if (session.perfil !== 1) {
        document.querySelector('[data-back-manager]').remove()
        document.querySelector('[data-btn-powerbi]').remove()
        document.querySelector('[data-btn-stock]').remove()
    }

    const powerbis = await Connection.noBody(`powerbisuser/${id_login}`, 'GET')
    listBi(powerbis)

    const stocks = await Connection.noBody(`stocks/${id_login}`, 'GET')
    listStock(stocks)

    $('#edit').modal('hide')

    alert(obj.msg)
}

const list = async () => {
    const users = await Connection.noBody('users', 'GET');
    let dtusers = users.map(user => {
        return [
            `<a href="user/${user.id_login}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
            `${user.name}`,
            `${user.perfilDesc}`,
            `${user.mailenterprise}`,
            `${user.dateBirthday}`,
            `${user.dateReg}`
        ]
    });

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        destroy: true,
        data: dtusers,
        columns: [
            { title: "Opciones" },
            { title: "Nombre" },
            { title: "Perfil" },
            { title: "E-mail Organização" },
            { title: "Fecha de Nacimiento" },
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
}


const listBi = (powerbis) => {
    let dtview = [];

    powerbis.forEach(powerbi => {
        const line = [
            `
            <a onclick="viewBi(event)" href="" data-title="${powerbi.title}" data-url="${powerbi.url}"><i class="fas fa-eye" style="color:#666600;"></i></a>
            <a data-toggle="modal" data-target="#editpowerbi" onclick="modalEditBi(event)" data-id_powerbi="${powerbi.id_powerbi}" data-title="${powerbi.title}" data-url="${powerbi.url}" data-type="${powerbi.type}"><i class="fas fa-edit" style="color:#32CD32;"></i></a>
            <a data-toggle="modal" data-target="#deletepowerbi" onclick="modalDeleteBi(event)" data-id_powerbi="${powerbi.id_powerbi}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>
            `,
            `${powerbi.title}`,
            `${powerbi.typedesc}`,
            `${powerbi.dateReg}`,
        ]

        dtview.push(line)
    });

    if ($.fn.DataTable.isDataTable('#powerbi')) {
        $('#powerbi').dataTable().fnClearTable();
        $('#powerbi').dataTable().fnDestroy();
        $('#powerbi').empty();
    }

    $("#powerbi").DataTable({
        data: dtview,
        columns: [
            { title: "Opciones" },
            { title: "Nombre" },
            { title: "Tipo" },
            { title: "Fecha de Registro" }
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
        fixedHeader: false,
        searching: false
    })
}

const listStock = (stocks) => {
    let dtstock = [];

    stocks.forEach(stock => {
        const line = [
            `<a onclick="modalDeleteStock(event)" href="" data-id_stock="${stock.id_stock}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
            `${stock.name}`
        ]

        dtstock.push(line)
    });

    if ($.fn.DataTable.isDataTable('#stock')) {
        $('#stock').dataTable().fnClearTable();
        $('#stock').dataTable().fnDestroy();
        $('#stock').empty();
    }

    $("#stock").DataTable({
        data: dtstock,
        columns: [
            { title: "Opciones" },
            { title: "Depósito" }
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
        fixedHeader: false,
        searching: false
    })
}

const modalCreate = async () => {

    const offices = await Connection.noBody('offices', 'GET')

    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.id_office
        line.innerHTML = office.name

        document.querySelector('#office').appendChild(line)
    })

    $('#office').selectpicker("refresh");
}

const create = async (event) => {
    event.preventDefault()

    const selectoffice = document.querySelectorAll('#office option:checked')
    const offices = Array.from(selectoffice).map(el => `${el.value}`);

    const date = new Date()
    const user = {
        name: event.currentTarget.name.value,
        dateBirthday: event.currentTarget.dateBirthday.value,
        perfil: event.currentTarget.perfil.value,
        perfilDesc: document.querySelector('#perfil option:checked').innerHTML,
        mailenterprise: event.currentTarget.mailenterprise.value,
        offices: offices,
        login: {
            mail: event.currentTarget.mail.value,
            password: event.currentTarget.password.value
        },
        dateReg: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    document.querySelector('[data-form-create-user]').reset()

    const obj = await Connection.body('user', { user }, 'POST')

    user.id_login = obj.user.id_login
    user.id_user = obj.user.id_user

    const rowNode = $('#dataTable').DataTable()
        .row.add([
            `<a href="user/${user.id_login}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
            `${user.name}`,
            `${user.perfilDesc}`,
            `${user.mailenterprise}`,
            `${user.dateBirthday}`,
            `${user.dateReg}`
        ])
        .draw()
        .node();

    $(rowNode)
        .css('color', 'black')
        .animate({ color: '#4e73df' });

    $('#create').modal('hide')
    alert(obj.msg)
}

const view = async (event) => {
    document.querySelector('[data-loading]').style.display = "block"

    clean()

    const id_login = event.target.parentElement.getAttribute("data-id_login")
    const user = await Connection.noBody(`user/${id_login}`, 'GET')

    document.querySelector('[data-powerbi]').innerHTML = View.view(user)

    let session = JSON.parse(sessionStorage.getItem('user'))

    if (session.perfil !== 1) {
        document.querySelector('[data-back-manager]').remove()
        document.querySelector('[data-btn-powerbi]').remove()
        document.querySelector('[data-btn-stock]').remove()
    }

    const powerbis = await Connection.noBody(`powerbisuser/${id_login}`, 'GET')
    listBi(powerbis)

    const stocks = await Connection.noBody(`stocks/${id_login}`, 'GET')
    listStock(stocks)

    document.querySelector('[data-loading]').style.display = "none"

    document.querySelector('[data-modal]').appendChild(View.edit())
    document.querySelector('[data-modal]').appendChild(View.del())
    document.querySelector('[data-modal]').appendChild(View.password())
}

const modalEdit = async (id) => {
    document.querySelector('[data-loading]').style.display = "block"

    const user = await Connection.noBody(`user/${id}`, 'GET')
    const offices = await Connection.noBody('offices', 'GET')

    await $("#perfil").val(user.perfil);
    document.querySelector('#name').value = user.name
    document.querySelector('#mail').value = user.mail
    document.querySelector('#mailenterprise').value = user.mailenterprise
    document.querySelector('#dateBirthday').value = user.dateBirthday


    if (user.offices.length > 0) {
        offices.forEach(office => {
            let match = user.offices.find(obj => obj.id_office === office.id_office);

            const line = document.createElement('option');

            if (match) {
                line.selected = true;
            }

            line.value = office.id_office;
            line.innerHTML = office.name;

            document.querySelector('#office').appendChild(line);
        })
    } else {
        offices.forEach(office => {
            const line = document.createElement('option');
            line.value = office.id_office;
            line.innerHTML = office.name;
            document.querySelector('#office').appendChild(line);
        })
    }

    await $('#office').selectpicker("refresh");

    $('#edit').modal('show')

    document.querySelector('[data-loading]').style.display = "none"

    return user
}

const checkReturn = (event) => {
    if (event.target && event.target.matches("[data-menu-user]")) {
        dashboard()
        document.querySelector("#dataTable").addEventListener('click', openUser, false)
    }

    document.querySelector("#dataTable").removeEventListener('click', checkReturn, false)
}

const openEdit = async (event) => {
    const id = event.currentTarget.id

    const { id_login, id_user } = await modalEdit(id)

    document.querySelector('[data-form-edit]').addEventListener('submit', async (eventsubmit) => {
        edit(eventsubmit, id_login, id_user)
    })

    document.querySelector("[data-form-edit]").removeEventListener('click', openEdit, false)
}

const openUser = async (event) => {
    if (event.target && event.target.nodeName == "I") {
        const id = event.target.parentElement.getAttribute("data-id_login")

        clean()
        await view(event)
        document.querySelector('[data-loading]').style.display = "none"

        document.querySelector('[data-powerbi]').addEventListener('click', checkReturn, false)
        document.querySelector('[data-powerbi]').id = id

        document.querySelector('[data-btn-edit]').addEventListener('click', openEdit, false)
        document.querySelector('[data-btn-edit]').id = id

        document.querySelector('[data-form-delete]').addEventListener('submit', del, false)
        document.querySelector('[data-form-delete]').id = id

        document.querySelector('[data-form-password]').addEventListener('submit', password, false)
        document.querySelector('[data-form-password]').id = id
    }

    document.querySelector("#dataTable").removeEventListener('click', openUser, false)
}

modalCreate()
list()

//add user
document.querySelector('[data-form-create-user]').addEventListener('submit', create, false)

//view user
document.querySelector("#dataTable").addEventListener('click', openUser, false)
