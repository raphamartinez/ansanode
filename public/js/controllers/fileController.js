import { ViewFile } from "../views/fileView.js"
import { ServiceFile } from "../services/fileService.js"

const btnfiles = document.querySelector('[data-files]')
const cardHistory = document.querySelector('[data-card]')

btnfiles.addEventListener('click', async (event) => {
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
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')

        title.innerHTML = "Carpeta de archivos"

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }
        modal.innerHTML = ''

        ViewFile.search(modal)

        $('#modalsearch').modal('show')

        ViewFile.directory(title, powerbi)

        modal.appendChild(ViewFile.image())
        modal.appendChild(ViewFile.pdf())
        modal.appendChild(ViewFile.video())
        modal.appendChild(ViewFile.deleteFile())

        loading.innerHTML = ``

        const filecontent = document.getElementById('filecontent')

        filecontent.innerHTML = ``

    } catch (error) {
        alert(error)
    }
})


window.modalAddFile = modalAddFile

async function modalAddFile(event) {
    try {
        event.preventDefault()

        let loading = document.querySelector('[data-loading]')
        let modal = document.querySelector('[data-modal]')
        loading.innerHTML = `
    <div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
        modal.innerHTML = ''
        modal.appendChild(ViewFile.modal())

        $('#modaladdfile').modal('show')

        loading.innerHTML = " "
    } catch (error) {

    }
}


window.modalsearch = modalsearch

async function modalsearch(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')

        modal.innerHTML = ''
        ViewFile.search(modal)

        $('#modalsearch').modal('show')

    } catch (error) {

    }
}


window.searchfile = searchfile

async function searchfile(event) {
    event.preventDefault()
    $('#modalsearch').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        const filecontent = document.getElementById('filecontent')
        const btn = event.currentTarget
        const name = btn.form.title.value
        const type = btn.form.type.value

        filecontent.innerHTML = ``

        const details = {
            name: name,
            type: type
        }

        const data = await ServiceFile.listfile(details)

        data.forEach(obj => {
            console.log(obj);
            filecontent.appendChild(ViewFile.file(obj))
        })

        loading.innerHTML = ``

    } catch (error) {

    }
}

window.upload = upload

async function upload(event) {
    event.preventDefault()
    $('#modaladdfile').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        const btn = event.currentTarget
        const title = btn.form.title.value
        const description = btn.form.description.value
        const type = btn.form.type.value
        const file = btn.form.file.files[0]

        const formData = new FormData()

        formData.append('file', file)
        formData.append('title', title)
        formData.append('type', type)
        formData.append('description', description)

        const filename = await ServiceFile.upload(formData)

        const filecontent = document.getElementById('filecontent')

        filecontent.appendChild(ViewFile.fileUpload(filename,title))

        loading.innerHTML = ``
    } catch (error) {

    }
}