import { ViewPowerBi } from "../views/powerbiView.js"
import { ServicePowerbi } from "../services/powerbiService.js"
import { ServiceHistory } from "../services/historyService.js"

const btnInforme = document.getElementById('btnInforme')
const btnPunto = document.getElementById('btnPunto')
const btnVehiculos = document.getElementById('btnVehiculos')
const btnSucursales = document.getElementById('btnSucursales')
const cardHistory = document.querySelector('[data-card]')

window.modalDeleteBi = modalDeleteBi
window.viewBi = viewBi
window.addPowerBi = addPowerBi
window.editPowerBi = editPowerBi
window.modalEditBi = modalEditBi
window.deletePowerBi = deletePowerBi
window.autocompletesearch = autocompletesearch

async function autocompletesearch(event) {
    event.preventDefault()

    try {

        const description = document.getElementById('searchcomplete').value
        let title = document.querySelector('[data-title]')
        const url = document.getElementById('searchcomplete').dataset.url
        const type = document.getElementById('searchcomplete').dataset.type
        let powerbi = document.querySelector('[data-powerbi]')

        if (url) {
            cardHistory.style.display = 'none';
            let loading = document.querySelector('[data-loading]')
            loading.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        `

            document.getElementById('searchcomplete').value = ''
            document.getElementById('searchcomplete').placeholder = "Nombre del informe..."

            title.innerHTML = description
            loading.innerHTML = " "
            powerbi.innerHTML = `   
            <iframe  id="viewbi" width="1140" height="600" src="${url}" frameborder="0" allowFullScreen="true"></iframe>
            <div class="col-md-12 h3 font-weight-bold text-primary text-center p-3"> Otros informes</div>`

            ServiceHistory.insertHistory(`Acceso de Informe - ${description}`)

            const data = await ServicePowerbi.listBiUser(type)
            let dtview = [];

            data.forEach(powerbi => {
                const field = ViewPowerBi.listPowerBi(powerbi)
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
                            { title: "Tipo" },
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
                        data: dtview,
                        columns: [
                            { title: "Opciones" },
                            { title: "Nombre" },
                            { title: "Tipo" },
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
                loading.innerHTML = " "
            }

        } else {
            alert('Seleccione un informe válido!')
        }


    } catch (error) {
    }
}


btnSucursales.addEventListener('click', async (event) => {
    event.preventDefault()

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    try {
        const btn = event.currentTarget
        let title = document.querySelector('[data-title]')
        let type = 4
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Seguridad - Sucursales"
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await ServicePowerbi.listBiUser(type)
        let dtview = [];

        data.forEach(powerbi => {
            const field = ViewPowerBi.listPowerBi(powerbi)
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
                        { title: "Tipo" },
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
                    data: dtview,
                    columns: [
                        { title: "Opciones" },
                        { title: "Nombre" },
                        { title: "Tipo" },
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

    }
})

btnVehiculos.addEventListener('click', async (event) => {
    event.preventDefault()

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    try {
        const btn = event.currentTarget
        let title = document.querySelector('[data-title]')
        let type = 3
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Seguridad - Vehículos"
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await ServicePowerbi.listBiUser(type)

        let dtview = [];

        data.forEach(powerbi => {
            const field = ViewPowerBi.listPowerBi(powerbi)
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
                        { title: "Tipo" },
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
                    data: dtview,
                    columns: [
                        { title: "Opciones" },
                        { title: "Nombre" },
                        { title: "Tipo" },
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

    }
})

btnPunto.addEventListener('click', async (event) => {
    event.preventDefault()

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    try {
        const btn = event.currentTarget
        let title = document.querySelector('[data-title]')
        let type = 2
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Control de Punto"
        powerbi.innerHTML = " "
        modal.innerHTML = " "

        const data = await ServicePowerbi.listBiUser(type)

        let dtview = [];

        data.forEach(powerbi => {
            const field = ViewPowerBi.listPowerBi(powerbi)
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
                        { title: "Tipo" },
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
                    data: dtview,
                    columns: [
                        { title: "Opciones" },
                        { title: "Nombre" },
                        { title: "Tipo" },
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

    }
})


btnInforme.addEventListener('click', async (event) => {
    event.preventDefault()

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    try {
        const btn = event.currentTarget
        let title = document.querySelector('[data-title]')
        let type = 1
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Informes"
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await ServicePowerbi.listBiUser(type)

        let dtview = [];

        data.forEach(powerbi => {
            const field = ViewPowerBi.listPowerBi(powerbi)
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
                        { title: "Tipo" },
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
                    data: dtview,
                    columns: [
                        { title: "Opciones" },
                        { title: "Nombre" },
                        { title: "Tipo" },
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

    }
})


function viewBi(event) {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    const btn = event.currentTarget
    const url = btn.getAttribute("data-url")
    let title = document.querySelector('[data-title]')
    let powerbi = document.querySelector('[data-powerbi]')
    let description = btn.getAttribute("data-title")

    title.innerHTML = description
    loading.innerHTML = " "
    powerbi.innerHTML = `   
    <iframe  id="viewbi" width="1140" height="600" src="${url}" frameborder="0" allowFullScreen="true"></iframe>
    <div class="col-md-12 h3 font-weight-bold text-primary text-center p-3"> Otros informes</div>`

    ServiceHistory.insertHistory(`Acceso de Informe - ${description}`)
}

window.addModalPowerBi = addModalPowerBi

async function addModalPowerBi(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``
        modal.appendChild(ViewPowerBi.showModalPbiInsert())

        const btn = event.currentTarget
        const id_login = btn.getAttribute("data-id_login")
        $("#idinsertnewbi").attr("data-id_login", id_login)
        $('#edituser').modal('show')
    } catch (error) {

    }
}


async function addPowerBi(event) {
    try {
        event.preventDefault()
        $('#addpowerbi').modal('hide')

        let loading = document.querySelector('[data-loading]')
        loading.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        `

        const btn = event.currentTarget
        const id_login = btn.getAttribute("data-id_login")
        const title = btn.form.title.value
        const url = btn.form.url.value
        const type = btn.form.type.value

        const powerbi = {
            title: title,
            url: url,
            type: type,
            id_login: id_login
        }

        await ServicePowerbi.insertBi(powerbi)

        const data = await ServicePowerbi.listUser(id_login)

        if ($.fn.DataTable.isDataTable('#powerbiuserlist')) {
            $('#powerbiuserlist').dataTable().fnClearTable();
            $('#powerbiuserlist').dataTable().fnDestroy();
            $('#powerbiuserlist').empty();
        }

        let dtview = [];

        data.forEach(powerbi => {
            const field = ViewPowerBi.listPowerBiAdmin(powerbi, id_login)
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

        loading.innerHTML = " "
        alert('PowerBi agregado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}

async function modalEditBi(event) {
    event.preventDefault()
    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``
        modal.appendChild(ViewPowerBi.showModalEdit())
        
        const btn = event.currentTarget
        const id_powerbi = btn.getAttribute("data-id_powerbi")
        const url = btn.getAttribute("data-url")
        const title = btn.getAttribute("data-title")
        const type = btn.getAttribute("data-type")
        const id_login = btn.getAttribute("data-id_login")

        $("#ideditpowerbi").attr("data-id_powerbi", id_powerbi);
        $("#ideditpowerbi").attr("data-id_login", id_login);
        $("#urledit").val(url);
        $("#titleedit").val(title);
        $("#typeedit").val(type);
        $('#editpowerbi').modal('show')
    } catch (error) {

    }
}

async function editPowerBi(event) {
    event.preventDefault()
    $('#editpowerbi').modal('hide')
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const btn = event.currentTarget
        const id_powerbi = btn.getAttribute("data-id_powerbi")
        const title = btn.form.title.value
        const url = btn.form.url.value
        const type = btn.form.type.value
        const id_login = btn.getAttribute("data-id_login")

        const powerbi = {
            id_powerbi: id_powerbi,
            title: title,
            url: url,
            type: type
        }

        await ServicePowerbi.updateBi(powerbi, id_powerbi)

        const data = await ServicePowerbi.listUser(id_login)

        if ($.fn.DataTable.isDataTable('#powerbiuserlist')) {
            $('#powerbiuserlist').dataTable().fnClearTable();
            $('#powerbiuserlist').dataTable().fnDestroy();
            $('#powerbiuserlist').empty();
        }

        let dtview = [];

        data.forEach(power => {
            const field = ViewPowerBi.listPowerBiAdmin(power, id_login)
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

        loading.innerHTML = " "
        alert('PowerBi editado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}

async function modalDeleteBi(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``

        const btn = event.currentTarget
        const id_powerbi = btn.getAttribute("data-id_powerbi")
        const id_login = btn.getAttribute("data-id_login")

        modal.appendChild(ViewPowerBi.showModalDelete(id_powerbi, id_login))

        $('#deletepowerbi').modal('show')
    } catch (error) {
    }
}

async function deletePowerBi(event) {
    event.preventDefault()
    $('#deletepowerbi').modal('hide')
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        const btn = event.currentTarget
        const id_powerbi = btn.getAttribute("data-id_powerbi")
        const id_login = btn.getAttribute("data-id_login")

        await ServicePowerbi.deleteBi(id_powerbi)

        const data = await ServicePowerbi.listUser(id_login)

        if ($.fn.DataTable.isDataTable('#powerbiuserlist')) {
            $('#powerbiuserlist').dataTable().fnClearTable();
            $('#powerbiuserlist').dataTable().fnDestroy();
            $('#powerbiuserlist').empty();
        }

        let dtview = [];

        data.forEach(powerbi => {
            const field = ViewPowerBi.listPowerBiAdmin(powerbi, id_login)
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

        loading.innerHTML = " "
        alert('PowerBi excluido con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}