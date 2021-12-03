import { ViewFile } from "../views/fileView.js"
import { Connection } from '../services/connection.js'

const btnfiles = document.querySelector('[data-files]')
const cardHistory = document.querySelector('[data-card]')

const init = () => {
    
}

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
        let settings = document.querySelector('[data-settings]');
        document.querySelector('[data-features]').innerHTML = ""


        title.innerHTML = "Carpeta de archivos"

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }
        modal.innerHTML = ''
        settings.innerHTML = ''
        let search = 1

        ViewFile.search(modal, search)

        $('#modalsearch').modal('show')

        ViewFile.directory(title, powerbi)

        const btnblock = document.getElementById('listblock')
        btnblock.style.display = 'none';
        const btnline = document.getElementById('listline')
        btnline.style.display = 'inline-block';

        const searchblock = document.getElementById('searchblock')
        searchblock.style.display = 'inline-block';
        const searchline = document.getElementById('searchline')
        searchline.style.display = 'none';

        loading.style.display = "none";

        const filecontent = document.getElementById('filecontent')

        filecontent.innerHTML = ``

    } catch (error) {
        alert(error)
        loading.style.display = "none";
        filecontent.innerHTML = ``
    }
})


window.modalAddFile = modalAddFile

async function modalAddFile(event) {
    try {
        event.preventDefault()
        const btn = event.currentTarget
        const search = btn.getAttribute("data-search")
        let loading = document.querySelector('[data-loading]')
        let modal = document.querySelector('[data-modal]')
        loading.innerHTML = `
    <div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
        modal.innerHTML = ''
        modal.appendChild(ViewFile.modal(search))

        $('#modaladdfile').modal('show')

        loading.style.display = "none"
    } catch (error) {
        alert(error)
        loading.style.display = "none";
    }
}

window.modalAddOffice = modalAddOffice

async function modalAddOffice(event) {
    try {
        event.preventDefault()
        const btn = event.currentTarget
        const search = btn.getAttribute("data-search")
        let loading = document.querySelector('[data-loading]')
        let modal = document.querySelector('[data-modal]')
        loading.innerHTML = `
    <div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
        modal.innerHTML = ''
        modal.appendChild(ViewFile.addoffice(search))

        $('#modaladdoffice').modal('show')

        loading.style.display = "none"
    } catch (error) {
        alert(error)
        loading.style.display = "none";
    }
}


window.modalsearch = modalsearch

async function modalsearch(event) {
    try {
        event.preventDefault()

        const btn = event.currentTarget
        const search = btn.getAttribute("data-search")

        let modal = document.querySelector('[data-modal]')

        modal.innerHTML = ''
        ViewFile.search(modal, search)

        $('#modalsearch').modal('show')

    } catch (error) {
        alert(error)
        loading.style.display = "none";
    }
}


window.searchfile = searchfile

async function searchfile(event) {
    event.preventDefault()
    $('#modalsearch').modal('hide')

    let loading = document.querySelector('[data-loading]')
loading.style.display = "block";
    try {

        const btn = event.currentTarget
        const title = btn.form.title.value
        const type = btn.form.type.value
        const search = btn.getAttribute("data-search")

        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ""

        const file = {
            title: title,
            type: type
        }

        $("#listline").attr("data-title", title);
        $("#listline").attr("data-type", type);
        $("#listblock").attr("data-title", title);
        $("#listblock").attr("data-type", type);

        if (file.type === "") file.type = "Todas"
        if (file.title === "") file.title = "Todas"

        const data = await Connection.noBody(`files/${file.type}/${file.title}`, 'GET')

        if (search === '1') {
            const filecontent = document.getElementById('filecontent')
            filecontent.innerHTML = ``

            data.forEach(obj => {

                const filetype = obj.mimetype.substring(0, obj.mimetype.indexOf("/"))

                switch (filetype) {
                    case "image":
                        obj.fakename = obj.filename.replace(/ /g, "%20")
                        filecontent.appendChild(ViewFile.file(obj))

                        break;
                    case "video":
                        obj.fakename = '/img/video.png'
                        filecontent.appendChild(ViewFile.file(obj))

                        break;
                    case "application":
                        const typeapp = obj.mimetype.substring(obj.mimetype.indexOf("/") + 1)
                        switch (typeapp) {
                            case "pdf":
                                obj.fakename = '/img/pdf.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                obj.fakename = '/img/excel.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "vnd.ms-excel":
                                obj.fakename = '/img/excel.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "vnd.openxmlformats-officedocument.presentationml.slideshow":
                                obj.fakename = '/img/powerpoint.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "vnd.ms-powerpoint":
                                obj.fakename = '/img/powerpoint.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                                obj.fakename = '/img/word.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "msword":
                                obj.fakename = '/img/word.png'
                                filecontent.appendChild(ViewFile.file(obj))
                                break

                            case "excel":
                                obj.fakename = '/img/excel.png'
                                filecontent.appendChild(ViewFile.fileOffice(obj))
                                break

                            case "powerpoint":
                                obj.fakename = '/img/powerpoint.png'
                                filecontent.appendChild(ViewFile.fileOffice(obj))
                                break

                            case "word":
                                obj.fakename = '/img/word.png'
                                filecontent.appendChild(ViewFile.fileOffice(obj))
                                break

                            default:
                                obj.fakename = '/img/doc.png'
                                filecontent.appendChild(ViewFile.fileOffice(obj))
                                break
                        }

                        break;
                    case "text":
                        obj.fakename = '/img/doc.png'
                        filecontent.appendChild(ViewFile.file(obj))

                        break;

                }
            })
        } else {

            let dtview = [];

            data.forEach(obj => {

                const filetype = obj.mimetype.substring(0, obj.mimetype.indexOf("/"))
                const typeapp = obj.mimetype.substring(obj.mimetype.indexOf("/") + 1)

                if (filetype === "application") {
                    switch (typeapp) {
                        case "excel":
                            obj.filename = obj.path
                            break

                        case "word":
                            obj.filename = obj.path
                            break

                        case "powerpoint":
                            obj.filename = obj.path
                            break
                    }
                }

                const field = ViewFile.showTable(obj)
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
                            { title: "Título" },
                            { title: "Descripción" },
                            { title: "Tipo" },
                            { title: "Tamaño" },
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
                            { title: "Título" },
                            { title: "Descripción" },
                            { title: "Tipo" },
                            { title: "Tamaño" },
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
        }



        loading.style.display = "none";

    } catch (error) {
        alert(error)
        loading.style.display = "none";
    }
}

window.upload = upload

async function upload(event) {
    event.preventDefault()
    $('#modaladdfile').modal('hide')

    let loading = document.querySelector('[data-loading]')
loading.style.display = "block";
    try {
        const btn = event.currentTarget
        const search = btn.getAttribute("data-search")
        const title = btn.form.title.value
        const description = btn.form.description.value
        const type = btn.form.type.value
        const file = btn.form.file.files[0]

        const formData = new FormData()

        formData.append('file', file)
        formData.append('title', title)
        formData.append('type', type)
        formData.append('description', description)

        const obj = await Connection.bodyMultipart('file', formData, 'POST')

        if (search === '1') {
            const filetype = obj.mimetype.substring(0, obj.mimetype.indexOf("/"))

            switch (filetype) {
                case "image":
                    obj.fakename = `uploads/${obj.filename.replace(/ /g, "%20")}`

                    break;
                case "video":
                    obj.fakename = '/img/video.png'

                    break;
                case "application":
                    const typeapp = obj.mimetype.substring(obj.mimetype.indexOf("/") + 1)
                    switch (typeapp) {
                        case "pdf":
                            obj.fakename = '/img/pdf.png'
                            break

                        case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                            obj.fakename = '/img/excel.png'
                            break

                        case "vnd.ms-excel":
                            obj.fakename = '/img/excel.png'
                            break

                        case "vnd.openxmlformats-officedocument.presentationml.slideshow":
                            obj.fakename = '/img/powerpoint.png'
                            break

                        case "vnd.ms-powerpoint":
                            obj.fakename = '/img/powerpoint.png'
                            break

                        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                            obj.fakename = '/img/word.png'
                            break

                        case "msword":
                            obj.fakename = '/img/word.png'
                            break

                        case "excel":
                            obj.fakename = '/img/excel.png'
                            break

                        case "powerpoint":
                            obj.fakename = '/img/powerpoint.png'
                            break

                        case "word":
                            obj.fakename = '/img/word.png'
                            break

                        default:
                            obj.fakename = '/img/doc.png'

                            break
                    }

                    break;
                case "text":
                    obj.fakename = '/img/doc.png'

                    break;

            }

            const filecontent = document.getElementById('filecontent')

            filecontent.appendChild(ViewFile.fileUpload(obj))
        } else {
            const filetype = obj.mimetype.substring(0, obj.mimetype.indexOf("/"))
            switch (filetype) {
                case "image":
                    obj.fakename = `uploads/${obj.filename.replace(/ /g, "%20")}`

                    break;
                case "video":
                    obj.fakename = '/img/video.png'

                    break;
                case "application":
                    const typeapp = obj.mimetype.substring(obj.mimetype.indexOf("/") + 1)
                    switch (typeapp) {
                        case "pdf":
                            obj.fakename = '/img/pdf.png'
                            break

                        case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                            obj.fakename = '/img/excel.png'
                            break

                        case "vnd.ms-excel":
                            obj.fakename = '/img/excel.png'
                            break

                        case "vnd.openxmlformats-officedocument.presentationml.slideshow":
                            obj.fakename = '/img/powerpoint.png'
                            break

                        case "vnd.ms-powerpoint":
                            obj.fakename = '/img/powerpoint.png'
                            break

                        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                            obj.fakename = '/img/word.png'
                            break

                        case "msword":
                            obj.filename = obj.path
                            obj.fakename = '/img/word.png'
                            break

                        case "excel":
                            obj.filename = obj.path
                            obj.fakename = '/img/excel.png'
                            break

                        case "powerpoint":
                            obj.filename = obj.path
                            obj.fakename = '/img/powerpoint.png'
                            break

                        case "word":
                            obj.filename = obj.path
                            obj.fakename = '/img/word.png'
                            break

                        default:
                            obj.fakename = '/img/doc.png'

                            break
                    }

                    break;
                case "text":
                    obj.fakename = '/img/doc.png'

                    break;

            }

            const row = ViewFile.showTable(obj)

            const table = $('#dataTable').DataTable();

            const rowNode = table.row.add(row)
                .draw()
                .node();

            $(rowNode)
                .css('color', 'black')
                .animate({ color: '#4e73df' });
        }

        loading.style.display = "none";
    } catch (error) {
        alert(error)
        loading.style.display = "none";
    }
}

window.uploadoffice = uploadoffice

async function uploadoffice(event) {
    event.preventDefault()
    $('#modaladdoffice').modal('hide')

    let loading = document.querySelector('[data-loading]')
loading.style.display = "block";
    try {
        const btn = event.currentTarget
        const search = btn.getAttribute("data-search")

        const data = {
            title: btn.form.title.value,
            description: btn.form.description.value,
            type: btn.form.type.value,
            mimetype: btn.form.mimetype.value,
            path: btn.form.link.value
        }

        const obj = await Connection.body('fileoffice', { obj: data }, 'POST')
        const filetype = data.mimetype.substring(obj.mimetype.indexOf("/") + 1)

        if (search === '1') {

            switch (filetype) {
                case "powerpoint":
                    obj.fakename = '/img/powerpoint.png'

                    break;
                case "excel":
                    obj.fakename = '/img/excel.png'

                    break;
                case "word":
                    obj.fakename = '/img/word.png'

                    break;
                default:
                    obj.fakename = '/img/doc.png'

                    break;
            }

            const filecontent = document.getElementById('filecontent')

            filecontent.appendChild(ViewFile.fileOffice(obj))
        } else {

            if (filetype === "application") {
                switch (typeapp) {
                    case "excel":
                        obj.filename = obj.path
                        obj.fakename = '/img/excel.png'
                        break

                    case "word":
                        obj.filename = obj.path
                        obj.fakename = '/img/word.png'
                        break

                    case "powerpoint":
                        obj.filename = obj.path
                        obj.fakename = '/img/powerpoint.png'
                        break

                    default:
                        obj.fakename = '/img/doc.png'

                        break;
                }
            }

            const row = ViewFile.showTable(obj)

            const table = $('#dataTable').DataTable();

            const rowNode = table.row.add(row)
                .draw()
                .node();

            $(rowNode)
                .css('color', 'black')
                .animate({ color: '#4e73df' });
        }
        loading.style.display = "none";
    } catch (error) {
        alert(error)
        loading.style.display = "none";
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
loading.style.display = "block";
    try {
        const btn = event.currentTarget

        const id_file = btn.getAttribute("data-id_file")

        await Connection.noBody(`file/${id_file}`, 'DELETE')

        loading.style.display = "none";
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

        Connection.body('history', { description: `Descarga del archivo - ${filename}` }, 'POST')

        loading.style.display = "none";
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

                const typeapp = mimetype.substring(mimetype.indexOf("/") + 1)

                switch (typeapp) {
                    case "pdf":
                        modal.appendChild(ViewFile.pdf(file))
                        $('#modalpdf').modal('show')
                        break

                    case "excel":
                        modal.appendChild(ViewFile.office(file))
                        $('#modaloffice').modal('show')
                        break

                    case "word":
                        modal.appendChild(ViewFile.office(file))
                        $('#modaloffice').modal('show')
                        break

                    case "powerpoint":
                        modal.appendChild(ViewFile.office(file))
                        $('#modaloffice').modal('show')
                        break

                    default:
                        alert("Aún no es posible leer archivos de este formato.!")

                        break
                }
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

window.listLine = listLine

async function listLine(event) {
    event.preventDefault()

    try {

        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ""
        const btn = event.currentTarget
        const title = btn.getAttribute("data-title")
        const type = btn.getAttribute("data-type")
        let powerbi = document.querySelector('[data-powerbi]')

        const btnline = document.getElementById('listline')
        btnline.style.display = 'none';
        const btnblock = document.getElementById('listblock')
        btnblock.style.display = 'inline-block';

        const searchline = document.getElementById('searchline')
        searchline.style.display = 'inline-block';
        const searchblock = document.getElementById('searchblock')
        searchblock.style.display = 'none';

        $("#btnaddfile").attr("data-search", 2);
        $("#btnaddoffice").attr("data-search", 2);

        powerbi.innerHTML = " "

        const file = {
            title: title,
            type: type
        }

        if (file.type === "") file.type = "Todas"
        if (file.title === "") file.title = "Todas"

        const data = await Connection.noBody(`files/${file.type}/${file.title}`, 'GET')

        let dtview = [];

        data.forEach(obj => {

            const filetype = obj.mimetype.substring(0, obj.mimetype.indexOf("/"))
            const typeapp = obj.mimetype.substring(obj.mimetype.indexOf("/") + 1)

            if (filetype === "application") {
                switch (typeapp) {
                    case "excel":
                        obj.filename = obj.path
                        break

                    case "word":
                        obj.filename = obj.path
                        break

                    case "powerpoint":
                        obj.filename = obj.path
                        break
                }
            }

            const field = ViewFile.showTable(obj)
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
                        { title: "Título" },
                        { title: "Descripción" },
                        { title: "Tipo" },
                        { title: "Tamaño" },
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
                        { title: "Título" },
                        { title: "Descripción" },
                        { title: "Tipo" },
                        { title: "Tamaño" },
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
        alert(error)
    }
}


window.listblock = listblock

async function listblock(event) {
    event.preventDefault()

    try {

        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ""
        const btn = event.currentTarget
        const title = btn.getAttribute("data-title")
        const type = btn.getAttribute("data-type")
        let powerbi = document.querySelector('[data-powerbi]')

        const btnblock = document.getElementById('listblock')
        btnblock.style.display = 'none';
        const btnline = document.getElementById('listline')
        btnline.style.display = 'inline-block';

        const searchblock = document.getElementById('searchblock')
        searchblock.style.display = 'inline-block';
        const searchline = document.getElementById('searchline')
        searchline.style.display = 'none';

        $("#btnaddfile").attr("data-search", 1);
        $("#btnaddoffice").attr("data-search", 1);


        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        powerbi.innerHTML = ` 
        <div class="col-md-12">
        <div class="card shadow mb-3 responsive" >
            <div class="card-header"><strong>Repositorio</strong></div>
                            <div class="card-body">
                                    <div id="filecontent" class="form-row col-md-12">
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>`

        const filecontent = document.getElementById('filecontent')

        filecontent.innerHTML = ``

        const file = {
            title: title,
            type: type
        }

        if (file.type === "") file.type = "Todas"
        if (file.title === "") file.title = "Todas"

        const data = await Connection.noBody(`files/${file.type}/${file.title}`, 'GET')

        data.forEach(obj => {

            const filetype = obj.mimetype.substring(0, obj.mimetype.indexOf("/"))

            switch (filetype) {
                case "image":
                    obj.fakename = obj.filename.replace(/ /g, "%20")
                    filecontent.appendChild(ViewFile.file(obj))

                    break;
                case "video":
                    obj.fakename = '/img/video.png'
                    filecontent.appendChild(ViewFile.file(obj))

                    break;
                case "application":
                    const typeapp = obj.mimetype.substring(obj.mimetype.indexOf("/") + 1)
                    switch (typeapp) {
                        case "pdf":
                            obj.fakename = '/img/pdf.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                            obj.fakename = '/img/excel.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "vnd.ms-excel":
                            obj.fakename = '/img/excel.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "vnd.openxmlformats-officedocument.presentationml.slideshow":
                            obj.fakename = '/img/powerpoint.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "vnd.ms-powerpoint":
                            obj.fakename = '/img/powerpoint.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                            obj.fakename = '/img/word.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "msword":
                            obj.fakename = '/img/word.png'
                            filecontent.appendChild(ViewFile.file(obj))
                            break

                        case "excel":
                            obj.fakename = '/img/excel.png'
                            filecontent.appendChild(ViewFile.fileOffice(obj))
                            break

                        case "powerpoint":
                            obj.fakename = '/img/powerpoint.png'
                            filecontent.appendChild(ViewFile.fileOffice(obj))
                            break

                        case "word":
                            obj.fakename = '/img/word.png'
                            filecontent.appendChild(ViewFile.fileOffice(obj))
                            break

                        default:
                            obj.fakename = '/img/doc.png'
                            filecontent.appendChild(ViewFile.fileOffice(obj))
                            break
                    }

                    break;
                case "text":
                    obj.fakename = '/img/doc.png'
                    filecontent.appendChild(ViewFile.file(obj))

                    break;

            }
        })
    } catch (error) {
        alert(error)
    }
}

window.inputArchive = inputArchive
function inputArchive() {
    var fileName = document.getElementById('file').files[0].name;
    if (fileName.split('.').pop() === "xlsx") {
        document.getElementById('filename').innerHTML = fileName
    } else {
        document.getElementById('file').value = "";
        document.getElementById('filename').innerHTML = "Buscar archivo..."
        alert("El archivo insertado no es un Excel válido")
    }
}
