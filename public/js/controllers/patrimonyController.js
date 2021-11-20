import { View } from "../views/patrimonyView.js"
import { Connection } from '../services/connection.js'


const adjustModalDatatable = () => {
    $('#dataPatrimony').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}
//
const listImages = async (event) => {

    const modal = document.createElement('div')

    modal.innerHTML = `<div class="modal-image" modal-image>
    <span class="close text-white" data-span>&times;</span>
    <div class="row">
        <div class="col-6">
            <img class="rounded  modal-image-content mb-2" data-image-content>
        </div>
        <div class="col-6">
            <div style="padding-top: 200px;" class="text-center text-white justify-content-md-center align-items-center" data-image-description></div>
            <div class="text-center text-white justify-content-md-center" data-image-type></div>
            <div class="text-center text-white justify-content-md-center" data-image-office></div>
            </div>
        </div>
    </div>`

    document.querySelector('[data-modal]').appendChild(modal)

    let patrimony = {
        id_patrimony: event.target.getAttribute('data-id_patrimony'),
        office: event.target.getAttribute('data-office'),
        plate: event.target.getAttribute('data-plate'),
        name: event.target.getAttribute('data-name'),
        desc: event.target.getAttribute('data-desc'),
        type: event.target.getAttribute('data-type'),
        date: event.target.getAttribute('data-date'),
        note: event.target.getAttribute('data-note')
    }

    const details = await Connection.noBody(`patrimony/details/${patrimony.id_patrimony}`, "GET")

    document.querySelector('[data-image-description]').innerHTML = ""

    if (patrimony.plate) document.querySelector('[data-image-description]').innerHTML += `<strong>Plaqueta: </strong>${patrimony.plate}<br><br>`
    if (patrimony.name && patrimony.name != "null") document.querySelector('[data-image-description]').innerHTML += `<strong>Nombre: </strong>${patrimony.name}<br><br>`
    if (patrimony.type && patrimony.type != "null") document.querySelector('[data-image-description]').innerHTML += `<strong>Tipo: </strong>${patrimony.type}<br><br>`

    document.querySelector('[data-image-description]').innerHTML += `<strong>Sucursal: </strong>${patrimony.office}<br><br>`
    document.querySelector('[data-image-description]').innerHTML += `<strong>Fecha de Registro: </strong>${patrimony.date}<br><br>`

    if (details.length > 0) {
        details.forEach(detail => {
            document.querySelector('[data-image-description]').innerHTML += `
            <strong>${detail.title}</strong> - ${detail.description} <br><br>`
        })
    }

    if (patrimony.desc && patrimony.desc != "null") document.querySelector('[data-image-description]').innerHTML += `<strong>Descripción: </strong>${patrimony.desc}<br><br>`
    if (patrimony.note && patrimony.note != "null") document.querySelector('[data-image-description]').innerHTML += `<strong>Descripción Adicionale: </strong>${patrimony.note}<br><br>`


    document.querySelector('[modal-image]').style.display = "block"
    document.querySelector('[data-image-content]').src = event.target.currentSrc

    const span = document.querySelector('[data-span]')

    span.addEventListener('click', async () => {
        document.querySelector('[modal-image]').style.display = "none"
        document.querySelector('[data-image-content]').src = ""
        document.querySelector('[data-image-description]').innerHTML = ""
    })
}

const view = async (event) => {

    document.querySelector('[data-loading]').style.display = "block"

    let tr = event.path[3]
    let i = event.target

    let patrimony = {
        id_patrimony: i.getAttribute('data-view'),
        office: i.getAttribute('data-office'),
        plate: i.getAttribute('data-plate'),
        name: i.getAttribute('data-name'),
        desc: i.getAttribute('data-desc'),
        type: i.getAttribute('data-type'),
        date: i.getAttribute('data-date'),
        note: i.getAttribute('data-note')
    }

    if (tr.className === "child") tr = tr.previousElementSibling

    const files = await Connection.noBody(`patrimony/files/${patrimony.id_patrimony}`, "GET")
    if (files.length === 0) {
        document.querySelector('[data-loading]').style.display = "none"

        return alert('No hay imágenes vinculadas a este patrimonio.')
    }

    let row = $('#dataPatrimony').DataTable()
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

        const div = document.createElement('div')

        div.classList.add('container-fluid')
        div.innerHTML = `<div class="row col-md-12" data-body-${patrimony.id_patrimony}></div>`

        row.child(div).show()

        let body = document.querySelector(`[data-body-${patrimony.id_patrimony}]`)

        files.forEach(file => {
            body.appendChild(View.tableImage(file, patrimony))
        })

        tr.classList.add('shown')
        i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
        i.classList.add('fas', 'fa-eye-slash', 'text-white')
        document.querySelector('[data-loading]').style.display = "none"
        adjustModalDatatable()

        Array.from(document.getElementsByClassName('full-view')).forEach(function (image) {
            image.addEventListener('click', listImages, false)
        })
    }
}

const edit = async (event) => {

    let tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    const patrimony = {
        id: event.target.getAttribute('data-id'),
        type: event.target.getAttribute('data-type'),
        name: event.target.getAttribute('data-name'),
        plate: event.target.getAttribute('data-plate'),
        description: event.target.getAttribute('data-description'),
        note: event.target.getAttribute('data-note'),
        office: event.target.getAttribute('data-office'),
    }

    const offices = await Connection.noBody('offices', 'GET')

    document.querySelector('[data-modal]').innerHTML = ""
    document.querySelector('[data-modal]').appendChild(View.edit(patrimony))


    const details = await Connection.noBody(`patrimony/details/${patrimony.id}`, 'GET')

    if (details.length > 0) {
        details.forEach(detail => {
            const div = document.createElement('div')
            div.classList.add('form-group', 'col-md-6')

            let required = ''
            if (detail.description) required = 'required'

            div.innerHTML = `
            <label>${detail.title}</label>
            <input value="${detail.description}" data-id="${detail.id}" class="form-control" id="detailedit" name="detail" type="text" ${required}>`

            document.querySelector('[data-edit-desc]').appendChild(div)
        })
    }

    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.code
        line.innerHTML = office.name

        document.querySelector('[data-office-edit]').appendChild(line)
    })

    $('[data-office-edit]').val(patrimony.office)

    $('#edit').modal('show')

    const form = document.querySelector('[data-edit-patrimony]')
    form.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        let details = ''

        if (event2.currentTarget.detail) {
            let selectdetails = document.querySelectorAll('#detailedit')
            details = Array.from(selectdetails).map(el => {
                let obj = {
                    description: el.value,
                    id: el.getAttribute('data-id')
                }

                return obj
            });
        }

        const newPatrimony = {
            id: patrimony.id,
            name: event2.currentTarget.name.value,
            plate: event2.currentTarget.plate.value,
            description: event2.currentTarget.description.value,
            note: event2.currentTarget.note.value,
            office: event2.currentTarget.office.value,
            details: JSON.stringify(details)
        }

        const obj = await Connection.body(`patrimony/${patrimony.id}`, { patrimony: newPatrimony }, 'PUT')

        const table = $('#dataPatrimony').DataTable()

        table
            .row(tr)
            .remove()
            .draw();

        const rowNode = table
            .row
            .add(
                [
                    `
            <a><i data-action data-view="${patrimony.id}" data-id="${patrimony.id}" data-plate="${newPatrimony.plate}" data-name="${newPatrimony.name}" data-desc="${newPatrimony.description}" data-office="${newPatrimony.office}" data-type="${patrimony.type}" data-note="${newPatrimony.note}" class="btn-view fas fa-eye"></i></a>
            <a><i data-action data-id="${patrimony.id}" class="btn-upload fas fa-upload" ></i></a>
            <a><i data-id="${patrimony.id}" data-plate="${newPatrimony.plate}" data-name="${newPatrimony.name}" data-description="${newPatrimony.description}" data-office="${newPatrimony.office}" data-type="${patrimony.type}" data-note="${newPatrimony.note}" data-action class="btn-edit fas fa-edit"></i></a>
            <a><i data-action data-id="${patrimony.id}" class="btn-delete fas fa-trash"></i></a>`,
                    newPatrimony.plate,
                    newPatrimony.name,
                    patrimony.type,
                    newPatrimony.office,
                    newPatrimony.description,
                    newPatrimony.note
                ])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });

        $("#edit").modal('hide')

        alert(obj.msg)
    })
}

const dropImage = (event) => {

    const id = event.target.getAttribute('data-id')
    const name = event.target.getAttribute('data-name')

    const url = event.target.getAttribute('data-url')

    document.querySelector('[data-modal]').appendChild(View.dropImage(url))
    $('#deleteImage').modal('show')

    const modal = document.querySelector('[data-delete-image-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const obj = await Connection.noBody(`patrimony/image/${id}/${name}`, 'DELETE')

        let image = event.target.offsetParent
        image.remove()

        $("#deleteImage").modal('hide')

        alert(obj.msg)
    })
}

const drop = (event) => {
    const tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    const id = event.target.getAttribute('data-id')

    document.querySelector('[data-modal]').appendChild(View.drop())
    $('#deletepatrimony').modal('show')

    const modal = document.querySelector('[data-delete-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const obj = await Connection.noBody(`patrimony/${id}`, 'DELETE')

        $('#dataPatrimony').DataTable()
            .row(tr)
            .remove()
            .draw();

        $("#deletepatrimony").modal('hide')

        alert(obj.msg)
    })
}

const upload = async (event) => {
    const id = event.target.getAttribute('data-id')
    const tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.upload())

    $("#upload").modal('show')
    const form = document.querySelector('[data-upload-patrimony]')
    form.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        document.querySelector('[data-loading]').style.display = "block"

        const files = event2.currentTarget.file.files

        const formData = new FormData()
        formData.append("id", id);

        for (let newfile of files) {
            formData.append("file", newfile);
        }

        $("#upload").modal('hide')
        document.querySelector('[data-modal]').innerHTML = ``

        const obj = await Connection.bodyMultipart(`patrimony/upload`, formData, 'POST')

        document.querySelector('[data-loading]').style.display = "none"

        alert(obj.msg)
    })
}

const list = async (patrimonys) => {

    if ($.fn.DataTable.isDataTable('#dataPatrimony')) {
        $('#dataPatrimony').dataTable().fnClearTable();
        $('#dataPatrimony').dataTable().fnDestroy();
        $('#dataPatrimony').empty();
    }

    let data = patrimonys.map(patrimoy => {

        let a = `
        <a><i data-action data-view="${patrimoy.id}" data-id="${patrimoy.id}" data-plate="${patrimoy.plate}" data-name="${patrimoy.name}" data-desc="${patrimoy.description}" data-office="${patrimoy.office}" data-type="${patrimoy.type}" data-note="${patrimoy.note}" class="btn-view fas fa-eye"></i></a>
        <a><i data-action data-id="${patrimoy.id}" class="btn-upload fas fa-upload" ></i></a>
        <a><i data-id="${patrimoy.id}" data-plate="${patrimoy.plate}" data-name="${patrimoy.name}" data-description="${patrimoy.description}" data-office="${patrimoy.office}" data-type="${patrimoy.type}" data-note="${patrimoy.note}" data-action class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${patrimoy.id}" class="btn-delete fas fa-trash"></i></a>
        `

        return [
            a,
            patrimoy.plate,
            patrimoy.name,
            patrimoy.type,
            patrimoy.office,
            patrimoy.description,
            patrimoy.note,
        ]
    });

    $("#dataPatrimony").DataTable({
        destroy: true,
        data: data,
        columns: [
            { title: "Opciones" },
            { title: "Plaqueta" },
            { title: "Nombre" },
            { title: "Tipo" },
            { title: "Sucursal" },
            { title: "Descripción" },
            { title: "Notas" },
        ],
        paging: true,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
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


    document.querySelector('#dataPatrimony').addEventListener('click', async (event) => {
        if (event.target && (event.target.nodeName === "I" || event.target.nodeName === "SPAN") && event.target.matches("[data-action]")) {
            if (event.target.classList[0] === 'btn-delete') return drop(event)
            if (event.target.classList[0] === 'btn-delete-image') return dropImage(event)
            if (event.target.classList[0] === 'btn-edit') return edit(event)
            if (event.target.classList[0] === 'btn-view') return view(event)
            if (event.target.classList[0] === 'btn-upload') return upload(event)
        }
    })
}


const clean = () => {
    document.querySelector('[data-card]').style.display = 'none';

    document.querySelector('[data-title]').innerHTML = `Listado de Patrimonio`;
    document.querySelector('[data-powerbi]').innerHTML = ""
    document.querySelector('[data-modal]').innerHTML = ""
    document.querySelector('[data-settings]').innerHTML = ""
    document.querySelector('[data-features]').innerHTML = ""

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    if ($.fn.DataTable.isDataTable('#dataPatrimony')) {
        $('#dataPatrimony').dataTable().fnClearTable();
        $('#dataPatrimony').dataTable().fnDestroy();
        $('#dataPatrimony').empty();
    }
}

const search = async (event) => {
    event.preventDefault()

    document.querySelector('[data-loading]').style.display = "block"


    const selecttypes = document.querySelectorAll('.select-pure__option--selected')
    const types = Array.from(selecttypes).map(el => `'${el.getAttribute('data-value')}'`);
    if (types.length === 0) types[0] = "ALL"

    let offices
    let selectoffice = document.querySelectorAll('#office option:checked')
    offices = Array.from(selectoffice).map(el => `'${el.value}'`);
    if (offices.length === 0) offices[0] = "ALL"

    const patrimonys = await Connection.noBody(`patrimonys/${offices}/${types}`, 'GET')

    if(!patrimonys) return alert('No se encontraron patrimonios.')

    document.querySelector('[div-table-patrimony]').classList.remove('d-none')

    await list(patrimonys)

    $('html,body').animate({
        scrollTop: $('[div-table-patrimony]').offset().top - 100
    }, 'slow');


    document.querySelector('[data-loading]').style.display = "none"
}

const changeType = (event) => {
    const type = event.target.value
    let titles = []

    document.querySelector('[data-add-desc]').innerHTML = ""

    switch (type) {
        case 'Alineadora':
            titles = [
                [`Plaqueta - Sensor 1`, 'required'],
                [`Plaqueta - Sensor 2`, 'required'],
                [`Plaqueta - Sensor 3`, 'required'],
                [`Plaqueta - Sensor 4`, 'required'],
                [`CPU`, 'required'],
                [`Descrición o observacion adicional`, '']
            ]

            break
        case 'Balanceadora':

            break
        case 'Calibrador':

            break
        case 'Cañón de inflado':

            break
        case 'Compressor':

            break
        case 'Desmontadora':

            break
        case 'Elevador':

            break
        case 'Gabineta da Alineadora':

            break
        case 'Gato Hidráulico':

            break
        case 'Lavadora de cubiertas':

            break
        case 'Prensa Hidráulica':

            break
        case 'Rampa':

            break
        case 'Rectificador (a)':

            break
        case 'Regulador de Farol':

            break
        case 'Caja/mesa de Herramienta':

            titles = [
                [`Mesa de Herramientas`, ''],
                [`Caja de Herramientas`, '']
            ]

            break
        case 'Teléfono':

            titles = [
                [`Nombre de la persona que esta con el celular`, 'required'],
                [`Marca y Modelo`, 'required'],
                [`Numero IMEI do aparelho (*#06#)`, 'required']
            ]


            break
        case 'Extintor':

            titles = [
                [`Nombre del provedor`, 'required'],
                [`Vencimiento (mes y año)`, 'required'],
                [`Cual contenido (PQS ABC / CO2 / EM)`, 'required'],
                [`Cual kg?`, 'required']
            ]

            break
        default:

            const div = document.createElement('div')
            div.classList.add('form-group', 'col-md-12')

            div.innerHTML = `<input placeholder="Describe el tipo" class="form-control" id="type" name="type" type="text" required >`

            document.querySelector('[data-add-desc]').appendChild(div)
            break
    }

    if (titles.length > 0) {
        titles.forEach(title => {
            const div = document.createElement('div')
            div.classList.add('form-group', 'col-md-6')

            div.innerHTML = `<input placeholder="${title[0]}" data-title="${title[0]}" class="form-control" id="detail" name="detail" type="text" ${title[1]}>`

            document.querySelector('[data-add-desc]').appendChild(div)
        })
    }

}

const add = async (event) => {
    event.preventDefault()

    let details = ''
    let type = ''

    if (event.currentTarget.detail) {
        let selectdetails = document.querySelectorAll('#detail')
        details = Array.from(selectdetails).map(el => {
            let obj = {
                value: el.value,
                title: el.getAttribute('data-title')
            }

            return obj
        });
    }

    if (event.currentTarget.type[1]) {
        type = event.currentTarget.type[1].value
    } else {
        type = event.currentTarget.type.value
    }

    const patrimony = {
        name: event.currentTarget.name.value,
        plate: event.currentTarget.plate.value,
        type: type,
        office: event.currentTarget.office.value,
        files: event.currentTarget.file.files,
        details: details,
        description: event.currentTarget.description.value,
        note: event.currentTarget.note.value
    }

    const formData = new FormData()

    for (let file of patrimony.files) {
        formData.append("file", file);
    }

    formData.append('name', patrimony.name)
    formData.append('plate', patrimony.plate)
    formData.append('type', patrimony.type)
    formData.append('office', patrimony.office)
    formData.append('details', JSON.stringify(patrimony.details))
    formData.append('description', patrimony.description)
    formData.append('note', patrimony.note)

    const obj = await Connection.bodyMultipart(`patrimony`, formData, 'POST')

    event.currentTarget.reset()

    alert(obj.msg)
}

const menu = async () => {
    document.querySelector('[data-loading]').style.display = "block"

    clean()
    document.querySelector('[data-features]').appendChild(View.add())


    document.querySelector('[data-features]').appendChild(View.header())
    document.querySelector('[data-features]').appendChild(View.table())

    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.code
        line.innerHTML = office.name

        const line2 = document.createElement('option')
        line2.value = office.code
        line2.innerHTML = office.name

        document.querySelector('[data-office]').appendChild(line)
        document.querySelector('[data-office-add]').appendChild(line2)
    })

    $('[data-office]').selectpicker();

    const typesdt = await Connection.noBody('patrimony/types', 'GET')
    const type = typesdt.map(type => {
        const line = {
            label: type.name,
            value: type.name
        }

        return line
    })

    new SelectPure(".select-pure", {
        options: type,
        multiple: true,
        autocomplete: true,
        icon: "fa fa-times",
        inlineIcon: false,
        placeholder: false
    });

    document.querySelector('.select-pure__placeholder').innerHTML = "Tipo"

    document.querySelector('[data-loading]').style.display = "none"



    document.querySelector('[data-type-add]').addEventListener('change', changeType, false)

    document.querySelector('[data-search-patrimony]').addEventListener('submit', search, false)
    document.querySelector('[data-add-patrimony]').addEventListener('submit', add, false)

}

document.querySelector('[data-menu-company-assets]').addEventListener('click', menu, false)
