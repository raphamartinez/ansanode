import { View } from "../views/userView.js"
import { ViewStock } from "../views/stockView.js"
import { Connection } from '../services/connection.js'

const btn = document.querySelector('[data-btn-users]')
const cardHistory = document.querySelector('[data-card]')

window.modalCreateUser = modalCreateUser
async function modalCreateUser(event){
    event.preventDefault()
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');

        modal.innerHTML = " "
        settings.innerHTML = " "

        const offices = await Connection.noBody('offices', 'GET')

        modal.appendChild(View.createUser())

        const divoffice = document.getElementById('office')

        offices.forEach(office => {
            divoffice.appendChild(View.listOffice(office))
        });

        loading.innerHTML = " "
        $('#createuser').modal('show')

    } catch (error) {
        $('#createuser').modal('hide')

        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI!')
    }
}


btn.addEventListener('click', async (event) => {
    event.preventDefault()

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');


        title.innerHTML = "Listado de Usuarios"
        powerbi.innerHTML = " "
        modal.innerHTML = ""
        settings.innerHTML = " "
        title.appendChild(View.buttons())

        const data = await Connection.noBody('users', 'GET')
        let dtview = [];

        data.forEach(user => {
            const field = View.showTable(user)
            dtview.push(field)
        });

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        let user = JSON.parse(sessionStorage.getItem('user'))

        let perfil = user.perfil

        if (perfil !== 1) {
            $(document).ready(function () {
                $("#dataTable").DataTable({
                    data: dtview,
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
                    fixedHeader: false
                }
                )
            })
        } else {
            $(document).ready(function () {
                $("#dataTable").DataTable({
                    destroy: true,
                    data: dtview,
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
            })
        }

        loading.innerHTML = " "

    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI!')
    }
})


window.editUser = editUser

async function editUser(event) {
    event.preventDefault()
    $('#edituser').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const btn = event.currentTarget
        const id_user = btn.getAttribute("data-id_user")
        const id_login = btn.getAttribute("data-id_login")
        const name = btn.form.name.value
        const dateBirthday = btn.form.dateBirthday.value
        const perfil = btn.form.perfil.value
        const office = btn.form.office.value
        const mail = btn.form.mail.value
        const mailenterprise = btn.form.mailenterprise.value

        const user = {
            id_user: id_user,
            id_login: id_login,
            name: name,
            mailenterprise: mailenterprise,
            dateBirthday: dateBirthday,
            perfil: perfil,
            id_office: office,
            mail: mail
        }

        await Connection.body(`user/${id_user}`, { user }, 'PUT')

        loading.innerHTML = " "
        listUsersFunction(id_login)
        alert('Usuario actualizado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}

window.modalEditUser = modalEditUser

async function modalEditUser(event) {
    event.preventDefault()
    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``

        modal.appendChild(View.showModalEdit())

        const btn = event.currentTarget
        const id_user = btn.getAttribute("data-id_user")
        const id_login = btn.getAttribute("data-id_login")
        const name = btn.getAttribute("data-name")
        const dateBirthday = btn.getAttribute("data-dateBirthday")
        const perfil = btn.getAttribute("data-perfil")
        const office = btn.getAttribute("data-office")
        const mail = btn.getAttribute("data-mail")
        const mailenterprise = btn.getAttribute("data-mailenterprise")


        $("#iddbtnedituser").attr("data-id_user", id_user);
        $("#iddbtnedituser").attr("data-id_login", id_login);
        $("#nameedit").val(name);
        $("#dateBirthdayedit").val(dateBirthday);
        $("#perfiledit").val(perfil);
        $("#officeedit").val(office);
        $("#mailedit").val(mail);
        $("#mailenterpriseedit").val(mailenterprise);

        const data = await Connection.noBody('offices', 'GET')
        const divofficeedit = document.getElementById('officeedit')
        data.forEach(obj => {
            divofficeedit.appendChild(View.listOffice(obj))
        });

        $('#edituser').modal('show')
    } catch (error) {
        $('#edituser').modal('hide')
    }
}

window.deleteUser = deleteUser

async function deleteUser(event) {
    event.preventDefault()
    $('#deleteuser').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const form = event.currentTarget
        const id_user = form.getAttribute("data-id_user")
        const id_login = form.getAttribute("data-id_login")

        await Connection.noBody(`user/${id_user}`, 'DELETE')

        loading.innerHTML = " "
        await listUsers()
        alert('Usuario discapacitado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')

    }

}


window.modalDeleteUser = modalDeleteUser

async function modalDeleteUser(event) {
    event.preventDefault()
    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``

        modal.appendChild(View.showModalDelete())

        const btn = event.currentTarget
        const id_user = btn.getAttribute("data-id_user")
        const id_login = btn.getAttribute("data-id_login")

        $("#iddbtndeleteuser").attr("data-id_user", id_user);
        $("#iddbtndeleteuser").attr("data-id_login", id_login);
        $('#deleteuser').modal('show')
    } catch (error) {
    }
}

window.modalChangePass = modalChangePass

async function modalChangePass(event) {
    event.preventDefault()
    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = " "

        const btn = event.currentTarget
        const name = btn.getAttribute("data-name")
        const id_login = btn.getAttribute("data-id_login")

        modal.appendChild(View.showModalChangePass(name, id_login))
        $('#changepass').modal('show')
    } catch (error) {
    }
}


window.changePassword = changePassword

async function changePassword(event) {
    event.preventDefault()
    $('#changepass').modal('hide')
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `

    try {

        const btn = event.currentTarget
        const id_login = btn.getAttribute("data-id_login")
        const name = btn.getAttribute("data-name")
        const password = btn.form.password.value
        const passwordconf = btn.form.passwordconf.value

        const user = {
            password: password,
            passwordconf: passwordconf,
            id_login: id_login,
            name: name
        }

        const data = await Connection.body('changepass', { user }, 'POST')
        loading.innerHTML = " "
        alert(data)
    } catch (error) {
        loading.innerHTML = " "
        alert(error)
    }
}


window.createUser = createUser

async function createUser(event) {
    event.preventDefault()
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `

    try {
        const btn = event.currentTarget
        const name = btn['name'].value
        const dateBirthday = btn['dateBirthday'].value
        const perfil = btn['perfil'].value
        const id_office = btn['office'].value
        const mail = btn['mail'].value
        const password = btn['password'].value
        const mailenterprise = btn['mailenterprise'].value

        const user = {
            name: name,
            dateBirthday: dateBirthday,
            perfil: perfil,
            mailenterprise: mailenterprise,
            office: {
                id_office: id_office
            },
            login: {
                mail: mail,
                password: password
            },
            dateReg: Date.now()
        }

        await Connection.body('user', { user }, 'POST')
        loading.innerHTML = " "
        $('#createuser').modal('hide')

        await listUsers()
    } catch (error) {
        loading.innerHTML = " "
        alert(error)
    }
}


async function listUsers() {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');


        title.innerHTML = "Listado de Usuarios"
        powerbi.innerHTML = " "
        modal.innerHTML = ""
        settings.innerHTML = " "

        const data = await Connection.noBody('users', 'GET')
        let dtview = [];

        data.forEach(user => {
            const field = View.showTable(user)
            dtview.push(field)
        });

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        let user = JSON.parse(sessionStorage.getItem('user'))

        let perfil = user.perfil

        if (perfil !== 1) {
            $(document).ready(function () {
                $("#dataTable").DataTable({
                    data: dtview,
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
                    fixedHeader: false
                }
                )
            })
        } else {
            $(document).ready(function () {
                $("#dataTable").DataTable({
                    destroy: true,
                    data: dtview,
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
            })
        }

        loading.innerHTML = " "
        alert('Usuario agregado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert(error)
    }
}


async function listUsersFunction(id_login) {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        if ($.fn.DataTable.isDataTable('#powerbiuserlist')) {
            $('#powerbiuserlist').dataTable().fnClearTable();
            $('#powerbiuserlist').dataTable().fnDestroy();
            $('#powerbiuserlist').empty();
        }

        if ($.fn.DataTable.isDataTable('#stock')) {
            $('#stock').dataTable().fnClearTable();
            $('#stock').dataTable().fnDestroy();
            $('#stock').empty();
        }

        let powerbi = document.querySelector('[data-powerbi]')
        let title = document.querySelector('[data-title]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');

        modal.innerHTML = " "
        title.innerHTML = " "
        settings.innerHTML = " "

        const user = await Connection.noBody(`user/${id_login}`, 'GET')

        powerbi.innerHTML = View.viewUser(user)

        const powerbis = await Connection.noBody(`powerbisuser/${id_login}`, 'GET')

        let dtview = [];

        powerbis.forEach(obj => {
            const field = View.listPowerBiAdmin(obj, id_login)
            dtview.push(field)
        });

        $(document).ready(function () {
            $("#powerbiuserlist").DataTable({
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
        })

        const stocks = await Connection.noBody(`stocks/${id_login}`, 'GET')

        let dtstock = [];

        stocks.forEach(obj => {
            const fieldstock = ViewStock.listStock(obj, id_login)
            dtstock.push(fieldstock)
        });

        $(document).ready(function () {
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
        })
        loading.innerHTML = ``
    } catch (error) {
        loading.innerHTML = ``
        alert(error)
    }
}

window.viewUser = viewUser

async function viewUser(event) {
    event.preventDefault()
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }
        let cardHistory = document.querySelector('[data-card]')
        let powerbi = document.querySelector('[data-powerbi]')
        let title = document.querySelector('[data-title]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');

        modal.innerHTML = " "
        settings.innerHTML = " "
        title.innerHTML = " "
        cardHistory.style.display = 'none';

        const btn = event.currentTarget
        const id_login = btn.getAttribute("data-id_login")

        const user = await Connection.noBody(`user/${id_login}`, 'GET')

        powerbi.innerHTML = View.viewUser(user)

        let us = JSON.parse(sessionStorage.getItem('user'))

        if (us.perfil !== 1) {
            let divBack = document.querySelector('[data-back-manager]')
            let btnPowerbi = document.querySelector('[data-btn-powerbi]')
            let btnStock = document.querySelector('[data-btn-stock]')
            divBack.remove()
            btnPowerbi.remove()
            btnStock.remove()
        }

        const powerbis = await Connection.noBody(`powerbisuser/${id_login}`, 'GET')

        let dtview = [];

        powerbis.forEach(obj => {
            const field = View.listPowerBiAdmin(obj, id_login)
            dtview.push(field)
        });

        $(document).ready(function () {
            $("#powerbiuserlist").DataTable({
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
        })

        const stocks = await Connection.noBody(`stocks/${id_login}`, 'GET')

        let dtstock = [];

        stocks.forEach(obj => {
            const fieldstock = ViewStock.listStock(obj, id_login)
            dtstock.push(fieldstock)
        });

        $(document).ready(function () {
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
        })
        loading.innerHTML = ``
    } catch (error) {
        loading.innerHTML = ``
        alert(error)
    }
}


window.listUser = listUser

async function listUser(event) {
    event.preventDefault()

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');


        title.innerHTML = "Listado de Usuarios"
        powerbi.innerHTML = " "
        modal.innerHTML = ""
        settings.innerHTML = " "

        const data = await Connection.noBody('users', 'GET')
        let dtview = [];

        data.forEach(user => {
            const field = View.showTable(user)
            dtview.push(field)
        });

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        let user = JSON.parse(sessionStorage.getItem('user'))

        let perfil = user.perfil

        if (perfil !== 1) {
            $(document).ready(function () {
                $("#dataTable").DataTable({
                    data: dtview,
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
                    fixedHeader: false
                }
                )
            })
        } else {
            $(document).ready(function () {
                $("#dataTable").DataTable({
                    destroy: true,
                    data: dtview,
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
            })
        }
        loading.innerHTML = " "

    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI!')
    }
}
