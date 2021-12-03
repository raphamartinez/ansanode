import { ViewMail } from "../views/mailView.js"
import { Connection } from '../services/connection.js'

window.mailList = mailList

async function mailList(event) {
    event.preventDefault()

    try {

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        if ($.fn.DataTable.isDataTable('#tablemail')) {
            $('#tablemail').dataTable().fnClearTable();
            $('#tablemail').dataTable().fnDestroy();
            $('#tablemail').empty();
        }

        const data = await Connection.noBody('mails', 'GET')

        let dtview = [];
        data.forEach(obj => {
            const field = ViewMail.listMails(obj)
            dtview.push(field)
        });

        $("#tablemail").DataTable({
            data: dtview,
            columns: [
                { title: "Opciones" },
                { title: "Para" },
                { title: "Cc" },
                { title: "Cco" },
                { title: "Título" },
                { title: "Corpo" },
                { title: "Cant Archivos Adjuntos" },
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

    } catch (error) {
        console.log(error);
        alert(error)
    }
}

window.modaladdmail = modaladdmail

async function modaladdmail(event) {
    event.preventDefault()
    let modal = document.querySelector('[data-modal]')

    modal.innerHTML = ``

    modal.appendChild(ViewMail.modaladdmail())

    $(document).ready(function () {
        $("#tableattachment").DataTable({
            data: [],
            columns: [
                { title: "Opciones" },
                { title: "URL" }
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

        $("#tablescheduling").DataTable({
            data: [],
            columns: [
                { title: "Opciones" },
                { title: "Fecha de Envío" }
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

    let powerbis = await Connection.noBody('powerbis', 'GET')

    const bisselect = document.getElementById('bis')

    powerbis.forEach(obj => {
        bisselect.appendChild(ViewMail.optionBis(obj))
    });

    $('#smartwizard').smartWizard({
        lang: {
            next: 'Próximo',
            previous: 'Anterior'
        },
        selected: 0,
        theme: 'dots',
        autoAdjustHeight: true,
        justified: true,
        transitionEffect: 'slide-horizontal',
        anchorSettings: {
            arkDoneStep: true
        },
        showStepURLhash: false
    });

    $('#modalmailschedule').modal('show')
}


window.addoptionschedule = addoptionschedule
function addoptionschedule(event) {
    event.preventDefault()

    const scheduleselect = document.getElementById('schedule')

    const date = document.getElementById('date').value

    scheduleselect.appendChild(ViewMail.optionSchedule(date))
}

window.addbimail = addbimail

function addbimail(event) {
    event.preventDefault()

    const bis = document.querySelectorAll('#bis option:checked')
    const value = Array.from(bis).map(el => el.value)
    const innerHTML = Array.from(bis).map(el => el.innerHTML)

    const url = document.getElementById('url')

    url.appendChild(ViewMail.optionURL(value, innerHTML))

    $('#bis option').prop('selected', function () {
        return this.defaultSelected;
    });

}

window.addurlmail = addurlmail

function addurlmail(event) {
    event.preventDefault()

    const urlinput = document.getElementById('urlinput').value

    const url = document.getElementById('url')

    url.appendChild(ViewMail.optionURL(urlinput, `URL - ${urlinput}`))

    document.getElementById('urlinput').value = ``
    document.getElementById('urlinput').placeholder = `URL del Informe`
}

window.newmail = newmail

async function newmail(event) {
    event.preventDefault()

    try {
        const btn = event.currentTarget

        const scheduleoption = document.querySelectorAll('#schedule option')
        const attachmentoption = document.querySelectorAll('#url option')

        const schedule = Array.from(scheduleoption).map(el => `${el.value}`)
        const attachment = Array.from(attachmentoption).map(el => `${el.value}`)

        const mailschedule = {
            for: btn.form.for.value,
            cc: btn.form.cc.value,
            cco: btn.form.cco.value,
            title: btn.form.title.value,
            body: btn.form.message.value,
            type: btn.form.type.value,
            schedule: schedule,
            attachment: attachment
        }

        const result = await Connection.body('mail', { mailschedule }, 'POST')
        $('#modalmailschedule').modal('hide')
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``

        if ($.fn.DataTable.isDataTable('#tablemail')) {
            $('#tablemail').dataTable().fnClearTable();
            $('#tablemail').dataTable().fnDestroy();
            $('#tablemail').empty();
        }

        const data = await Connection.noBody('mails', 'GET')

        let dtview = [];
        data.forEach(obj => {
            const field = ViewMail.listMails(obj)
            dtview.push(field)
        });

        $("#tablemail").DataTable({
            data: dtview,
            columns: [
                { title: "Opciones" },
                { title: "Para" },
                { title: "Cc" },
                { title: "Cco" },
                { title: "Título" },
                { title: "Corpo" },
                { title: "Cant Archivos Adjuntos" },
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

        alert('¡La programación de correo electrónico se agregó correctamente!')
    } catch (error) {
        alert(error)
    }
}

window.ViewMailPowerbi = ViewMailPowerbi

async function ViewMailPowerbi(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``

        const btn = event.currentTarget
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        const mail = await Connection.noBody(`mail/${id_mailpowerbi}`, 'GET')

        modal.appendChild(ViewMail.viewMail(mail))

        let dtview = [];

        mail.attachment.forEach(obj => {
            const field = ViewMail.lineAttachment(obj)
            dtview.push(field)
        });

        let dtscheduling = [];

        mail.scheduling.forEach(obj => {
            const field = ViewMail.lineSchedule(obj)
            dtscheduling.push(field)
        });


        $('#viewmail').modal('show')

        if ($.fn.DataTable.isDataTable('#tableattachment')) {
            $('#tableattachment').dataTable().fnClearTable();
            $('#tableattachment').dataTable().fnDestroy();
            $('#tableattachment').empty();
        }

        if ($.fn.DataTable.isDataTable('#tablescheduling')) {
            $('#tablescheduling').dataTable().fnClearTable();
            $('#tablescheduling').dataTable().fnDestroy();
            $('#tablescheduling').empty();
        }


        $(document).ready(function () {
            $("#tableattachment").DataTable({
                data: dtview,
                columns: [
                    { title: "Opciones" },
                    { title: "URL" }
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
                searching: false,
                responsive: true
            })

            $("#tablescheduling").DataTable({
                data: dtscheduling,
                columns: [
                    { title: "Opciones" },
                    { title: "Fecha de Envío" }
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
                searching: false,
                responsive: true
            })
        })

        adjustModalDatatable()

    } catch (error) {
        alert(error)
    }
}

function adjustModalDatatable() {
    $('#viewmail').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}

window.modaldeleteMailSchedule = modaldeleteMailSchedule

async function modaldeleteMailSchedule(event) {
    try {
        event.preventDefault()

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        modal.innerHTML = ''
        modal.appendChild(ViewMail.deleteMailSchedule(id_mailpowerbi))

        $('#deleteMailSchedule').modal('show')

    } catch (error) {

    }
}

window.deleteMailSchedule = deleteMailSchedule

async function deleteMailSchedule(event) {
    event.preventDefault()

    try {
        const btn = event.currentTarget

        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        await Connection.noBody(`mail/${id_mailpowerbi}`, 'DELETE')

        if ($.fn.DataTable.isDataTable('#tablemail')) {
            $('#tablemail').dataTable().fnClearTable();
            $('#tablemail').dataTable().fnDestroy();
            $('#tablemail').empty();
        }

        const data = await Connection.noBody('mails', 'GET')

        let dtview = [];
        data.forEach(obj => {
            const field = ViewMail.listMails(obj)
            dtview.push(field)
        });

        $("#tablemail").DataTable({
            data: dtview,
            columns: [
                { title: "Opciones" },
                { title: "Para" },
                { title: "Cc" },
                { title: "Cco" },
                { title: "Título" },
                { title: "Corpo" },
                { title: "Cant Archivos Adjuntos" },
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

        $('#deleteMailSchedule').modal('hide')
        alert('Correo electrónico eliminado con éxito!')
    } catch (error) {

    }
}



window.modaldeleteSchedule = modaldeleteSchedule

async function modaldeleteSchedule(event) {
    try {
        event.preventDefault()

        $('#viewmail').modal('hide')

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_mailscheduling = btn.getAttribute("data-id_mailscheduling")
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")
        modal.innerHTML = ``
        modal.appendChild(ViewMail.deleteSchedule(id_mailscheduling, id_mailpowerbi))

        $('#deleteSchedule').modal('show')

    } catch (error) {

    }
}

window.deleteSchedule = deleteSchedule

async function deleteSchedule(event) {
    event.preventDefault()

    try {
        const btn = event.currentTarget

        const id_mailscheduling = btn.getAttribute("data-id_mailscheduling")
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        await Connection.noBody(`scheduling/${id_mailscheduling}`, 'DELETE')

        const mail = await Connection.noBody(`mail/${id_mailpowerbi}`, 'GET')

        let dtscheduling = [];

        mail.scheduling.forEach(obj => {
            const field = ViewMail.lineSchedule(obj)
            dtscheduling.push(field)
        });

        if ($.fn.DataTable.isDataTable('#tablescheduling')) {
            $('#tablescheduling').dataTable().fnClearTable();
            $('#tablescheduling').dataTable().fnDestroy();
            $('#tablescheduling').empty();
        }

        $(document).ready(function () {

            $("#tablescheduling").DataTable({
                data: dtscheduling,
                columns: [
                    { title: "Opciones" },
                    { title: "Fecha de Envío" }
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

        $('#deleteSchedule').modal('hide')
        alert('Calendario de correo electrónico eliminado con éxito!')
    } catch (error) {

    }
}


window.modaldeleteAttachment = modaldeleteAttachment

async function modaldeleteAttachment(event) {
    try {
        event.preventDefault()

        $('#viewmail').modal('hide')

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_mailattachment = btn.getAttribute("data-id_mailattachment")
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")
        modal.innerHTML = ``
        modal.appendChild(ViewMail.deleteAttachment(id_mailattachment, id_mailpowerbi))

        $('#deleteAttachment').modal('show')

    } catch (error) {

    }
}

window.deleteAttachment = deleteAttachment

async function deleteAttachment(event) {
    event.preventDefault()

    try {
        const btn = event.currentTarget

        const id_mailattachment = btn.getAttribute("data-id_mailattachment")
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        await Connection.noBody(`attachment/${id_mailattachment}`, 'DELETE')

        const mail = await Connection.noBody(`mail/${id_mailpowerbi}`, 'GET')

        let dt = [];

        mail.attachment.forEach(obj => {
            const field = ViewMail.lineAttachment(obj)
            dt.push(field)
        });

        if ($.fn.DataTable.isDataTable('#tableattachment')) {
            $('#tableattachment').dataTable().fnClearTable();
            $('#tableattachment').dataTable().fnDestroy();
            $('#tableattachment').empty();
        }

        $(document).ready(function () {

            $("#tableattachment").DataTable({
                data: dt,
                columns: [
                    { title: "Opciones" },
                    { title: "URL" }
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

        $('#deleteAttachment').modal('hide')
        alert('Archivo adjunto eliminado con éxito!')
    } catch (error) {

    }
}

window.modaladdattachment = modaladdattachment

async function modaladdattachment(event) {
    try {
        event.preventDefault()

        $('#viewmail').modal('hide')

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")
        modal.innerHTML = ``
        modal.appendChild(ViewMail.addattachment(id_mailpowerbi))

        const powerbis = await Connection.noBody('powerbis', 'GET')
        const bisselect = document.getElementById('bis')

        powerbis.forEach(obj => {
            bisselect.appendChild(ViewMail.optionBis(obj))
        });

        $('#addattachment').modal('show')

    } catch (error) {

    }
}

window.addattachment = addattachment

async function addattachment(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        const attachmentoption = document.querySelectorAll('#url option')
        const attachment = {
            urls: Array.from(attachmentoption).map(el => `${el.value}`),
            id_mailpowerbi: id_mailpowerbi
        }

        await Connection.body('attachment', { attachment }, 'POST')

        $('#addattachment').modal('hide')
        alert('Archivo adjunto agregado con éxito!')

        modal.innerHTML = ``
    } catch (error) {
        alert(error)
    }
}

window.modaladdschedule = modaladdschedule

async function modaladdschedule(event) {
    try {
        event.preventDefault()

        $('#viewmail').modal('hide')

        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget

        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")
        modal.innerHTML = ``
        modal.appendChild(ViewMail.addschedule(id_mailpowerbi))

        $('#addschedule').modal('show')

    } catch (error) {

    }
}


window.addschedule = addschedule

async function addschedule(event) {
    event.preventDefault()

    try {
        let modal = document.querySelector('[data-modal]')

        const btn = event.currentTarget
        const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")

        const scheduleoption = document.querySelectorAll('#schedule option')
        const schedule = Array.from(scheduleoption).map(el => `${el.value}`)

        const scheduling = {
            schedule: schedule,
            id_mailpowerbi: id_mailpowerbi
        }

        await Connection.body('scheduling', { scheduling }, 'POST')

        $('#addschedule').modal('hide')
        alert('Correo electrónico programado con éxito!')

        modal.innerHTML = ``
    } catch (error) {
        alert(error)
    }
}

window.modalviewAttachment = modalviewAttachment

function modalviewAttachment(event) {
    event.preventDefault()

    $('#viewmail').modal('hide')

    let modal = document.querySelector('[data-modal]')
    const btn = event.currentTarget
    const url = btn.getAttribute("data-url")
    const id_mailpowerbi = btn.getAttribute("data-id_mailpowerbi")
    const id_mailattachment = btn.getAttribute("data-id_mailattachment")

    modal.innerHTML = ``
    modal.appendChild(ViewMail.viewAttachment(url, id_mailpowerbi, id_mailattachment))
    $('#viewAttachment').modal('show')

}