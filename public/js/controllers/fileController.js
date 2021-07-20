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
        const title = btn.form.title.value
        const type = btn.form.type.value

        filecontent.innerHTML = ``

        const file = {
            title: title,
            type: type
        }

        if(file.type === "") file.type = "ALL"
        if(file.title === "") file.title = "ALL"

        const data = await ServiceFile.listfile(file)

        data.forEach(obj => {
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

        const obj = await ServiceFile.upload(formData)

        const filecontent = document.getElementById('filecontent')

        filecontent.appendChild(ViewFile.fileUpload(obj))

        loading.innerHTML = ``
    } catch (error) {

    }
}


window.modaldelete = modaldelete

async function modaldelete(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_file = btn.getAttribute("data-id_file")

        modal.innerHTML = ''
        modal.appendChild(ViewFile.deleteFile(id_file))

        $('#deletefile').modal('show')

    } catch (error) {

    }
}

window.deleteFile = deleteFile

async function deleteFile(event) {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        const btn = event.currentTarget

        const id_file = btn.getAttribute("data-id_file")

        await ServiceFile.deleteFile(id_file)

        loading.innerHTML = ``
        $(`#${id_file}div`).remove();
        $('#deletefile').modal('hide')
        alert('Archivo eliminado con éxito!')
    } catch (error) {

    }
}

window.modalmail = modalmail

async function modalmail(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')

        let id_file = document.querySelector('[data-id_file]').value

        modal.appendChild(ViewFile.sendMail(id_file))

        $('#modalmail').modal('show')

    } catch (error) {

    }
}

window.downloadFile = downloadFile

async function downloadFile(event) {
    try {
        event.preventDefault()

        const btn = event.currentTarget

        const src = btn.getAttribute("data-src")
        const filename = btn.getAttribute("data-filename")

        let loading = document.querySelector('[data-loading]')
        loading.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        `

        var link = document.createElement("a");
        link.download = filename;
        link.href = src;
        link.click();

        loading.innerHTML = ``
    } catch (error) {
        
    }
}


window.modalfile = modalfile

async function modalfile(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``

        const btn = event.currentTarget

        const mimetype = btn.getAttribute("data-mimetype")

        const file = {
            id_file: btn.getAttribute("data-id_file"),
            src: btn.getAttribute("data-src"),
            title: btn.getAttribute("data-title"),
            description: btn.getAttribute("data-description"),
            mimetype: btn.getAttribute("data-mimetype"),
            datereg: btn.getAttribute("data-datereg")
        }

        const filetype = mimetype.substring(0, mimetype.indexOf("/"))

        switch (filetype) {
            case "image":
                modal.appendChild(ViewFile.image(file))
                $('#modalimage').modal('show')

                break;
            case "video":
                modal.appendChild(ViewFile.video(file))
                $('#modalvideo').modal('show')

                break;
            case "application":
                alert("Aún no es posible leer archivos de este formato.!")

                break;
            case "text":
                alert("Aún no es posible leer archivos de este formato.!")

                break;

        }

        modal.appendChild(ViewFile.sendMail(id_file))

        $('#modalmail').modal('show')

    } catch (error) {

    }
}