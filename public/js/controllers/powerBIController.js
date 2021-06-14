import { View } from "../views/powerbiView.js"
import { Service } from "../services/powerbiService.js"
import { ServiceHistory } from "../services/historyService.js"

const btnInforme = document.getElementById('btnInforme')
const btnPunto = document.getElementById('btnPunto')
const btnVehiculos = document.getElementById('btnVehiculos')
const btnSucursales = document.getElementById('btnSucursales')
const cardHistory = document.querySelector('[data-card]')
const btnProcess = document.getElementById('btnProcess')

window.modalDeleteBi = modalDeleteBi
window.listBiUser = listBiUser
window.viewBi = viewBi
window.editBi = editBi
window.addPowerBi = addPowerBi
window.editPowerBi = editPowerBi
window.modalEditBi = modalEditBi
window.deletePowerBi = deletePowerBi

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
        let table = document.querySelector('[data-table]')
        let powerbi = document.querySelector('[data-powerbi]')
        let head = document.querySelector('[data-table-head]')
        let body = document.querySelector('[data-table-body]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Seguridad - Sucursales"
        table.style.display = '';
        head.innerHTML = " "
        body.innerHTML = " "
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await Service.listBiUser(type)

        head.appendChild(View.header())

        data.forEach(powerbi => {
            body.appendChild(View.listPowerBi(powerbi))
        });
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
        let table = document.querySelector('[data-table]')
        let powerbi = document.querySelector('[data-powerbi]')
        let head = document.querySelector('[data-table-head]')
        let body = document.querySelector('[data-table-body]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Seguridad - Vehículos"
        table.style.display = '';
        head.innerHTML = " "
        body.innerHTML = " "
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await Service.listBiUser(type)

        head.appendChild(View.header())

        data.forEach(powerbi => {
            body.appendChild(View.listPowerBi(powerbi))
        });
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
        let table = document.querySelector('[data-table]')
        let powerbi = document.querySelector('[data-powerbi]')
        let head = document.querySelector('[data-table-head]')
        let body = document.querySelector('[data-table-body]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Control de Punto"
        table.style.display = '';
        head.innerHTML = " "
        body.innerHTML = " "
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await Service.listBiUser(type)

        head.appendChild(View.header())

        data.forEach(powerbi => {
            body.appendChild(View.listPowerBi(powerbi))
        });
        loading.innerHTML = " "

    } catch (error) {

    }
})

// btnProcess.addEventListener('click', async (event) => {
//     event.preventDefault()
//     try {
//         const url = '../admin/index.html'
//         window.location.href = url
//     } catch (error) {
//         alert(error)
//     }
// })

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
        let table = document.querySelector('[data-table]')
        let powerbi = document.querySelector('[data-powerbi]')
        let head = document.querySelector('[data-table-head]')
        let body = document.querySelector('[data-table-body]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Informes"
        table.style.display = '';
        head.innerHTML = " "
        body.innerHTML = " "
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await Service.listBiUser(type)

        head.appendChild(View.header())

        data.forEach(powerbi => {
            body.appendChild(View.listPowerBi(powerbi))
        });
        loading.innerHTML = " "

    } catch (error) {

    }
})

async function listBiUser(event) {
    event.preventDefault()
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    try {

        const btn = event.currentTarget
        const id = btn.getAttribute("data-id")
        const name = btn.getAttribute("data-name")
        let title = document.querySelector('[data-title]')
        let table = document.querySelector('[data-table]')
        let head = document.querySelector('[data-table-head]')
        let body = document.querySelector('[data-table-body]')
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = `Lista de Informes - ${name}`
        head.innerHTML = " "
        body.innerHTML = " "
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        const data = await Service.listUser(id)

        head.appendChild(View.header())

        data.forEach(powerbi => {
            body.appendChild(View.listPowerBiAdmin(powerbi))
        });

        modal.appendChild(View.showModalDelete())
        modal.appendChild(View.showModalEdit())
        loading.innerHTML = " "

    } catch (error) {

    }

}

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
    let table = document.querySelector('[data-table]')
    let head = document.querySelector('[data-table-head]')
    let body = document.querySelector('[data-table-body]')
    let powerbi = document.querySelector('[data-powerbi]')
    let description = btn.getAttribute("data-title")

    title.innerHTML = description
    table.style.display = 'none';
    head.innerHTML = " "
    body.innerHTML = " "
    loading.innerHTML = " "
    powerbi.innerHTML = `   
    <iframe width="1140" height="600" src="${url}" frameborder="0" allowFullScreen="true"></iframe>`

    ServiceHistory.insertHistory(`Acceso de Informe - ${description}`)
}

async function editBi(event) {
    event.preventDefault()

    const btn = event.currentTarget
    const title = btn.getAttribute("data-title")
    const url = btn.getAttribute("data-url")
    const type = btn.getAttribute("data-type")
    let table = document.querySelector('[data-table]')
    let modal = document.querySelector('[data-modal]')
    let body = document.querySelector('[data-table-body]')
    let powerbi = document.querySelector('[data-powerbi]')

    modal.append(View.showModalEdit(title, url, type))

    const modalEdit = document.getElementById('editpowerbi')
    modalEdit.show()
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

        await Service.insertBi(powerbi)

        loading.innerHTML = " "
        alert('PowerBi agregado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}

async function modalEditBi(event) {
    try {
        const btn = event.currentTarget
        const id = btn.getAttribute("data-id_powerbi")
        const url = btn.getAttribute("data-url")
        const title = btn.getAttribute("data-title")
        const type = btn.getAttribute("data-type")

        $("#ideditpowerbi").attr("data-id_powerbi", id);
        $("#urledit").val(url);
        $("#titleedit").val(title);
        $("#typeedit").val(type);
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
        const id = btn.getAttribute("data-id_powerbi")
        const title = btn.form.title.value
        const url = btn.form.url.value
        const type = btn.form.type.value

        const powerbi = {
            id_powerbi: id,
            title: title,
            url: url,
            type: type
        }

        await Service.updateBi(powerbi, id)
        loading.innerHTML = " "
        alert('PowerBi agregado con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}

async function modalDeleteBi(event) {
    event.preventDefault()

    try {
        const btn = event.currentTarget
        const id = btn.getAttribute("data-id_powerbi")
        $("#iddeletepowerbi").attr("data-id_powerbi", id);

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
        const id = btn.getAttribute("data-id_powerbi")

        await Service.deleteBi(id)

        loading.innerHTML = " "
        alert('PowerBi excluido con éxito!')
    } catch (error) {
        loading.innerHTML = " "
        alert('Algo salió mal, informa al sector de TI')
    }
}