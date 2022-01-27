import { Connection } from '../services/connection.js'

const init = async () => {

    if ($.fn.DataTable.isDataTable('#tablemail')) {
        $('#tablemail').dataTable().fnClearTable();
        $('#tablemail').dataTable().fnDestroy();
        $('#tablemail').empty();
    }

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

    const data = await Connection.noBody('mails', 'GET')

    let dtview = data.map(mail => {
        return [
            `<a><i data-view data-id="${mail.id_mailpowerbi}" class="fas fa-eye" style="color:#cbccce;"></i></a>
            <a><i data-drop data-id="${mail.id_mailpowerbi}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
            `${mail.recipients}`,
            `${mail.cc}`,
            `${mail.cco}`,
            `${mail.title}`,
            `${mail.body}`,
            `${mail.countatt}`,
            `${mail.datereg}`
        ]
    })

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
        scrollX: true,
        autoHeight: true,
        scrollCollapse: true,
        responsive: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false
    })

    $("#tablemail").DataTable()
        .columns.adjust();

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

    $("#tableattachment").DataTable()
        .columns.adjust();

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

    $("#tablescheduling").DataTable()
        .columns.adjust();

    let obj = await Connection.noBody('powerbis', 'GET')
    obj.powerbis.forEach(powerbi => {
        const option = document.createElement('option')

        option.value = powerbi.url

        let data

        if (powerbi.name !== undefined) {
            data = `${powerbi.name} - ${powerbi.title}`
        } else {
            data = powerbi.title
        }

        option.innerHTML = data

        document.querySelector('#bis').appendChild(option)
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
}

document.querySelector('[data-config-mail]').addEventListener('click', init, false)

const addBi = () => {
    const bis = document.querySelectorAll('#bis option:checked')

    if (!bis) return alert('Seleccione uno Informe.')

    const value = Array.from(bis).map(el => el.value)
    const innerHTML = Array.from(bis).map(el => el.innerHTML)

    const url = document.getElementById('url')

    const option = document.createElement('option')
    option.value = value
    option.innerHTML = innerHTML

    url.appendChild(option)

    $('#bis option').prop('selected', function () {
        return this.defaultSelected;
    });
}

document.querySelector('[data-add-report]').addEventListener('click', addBi, false)

const addUrl = () => {
    const value = document.getElementById('urlinput').value

    if (!value) return alert('Insira uno Informe.')

    const url = document.getElementById('url')

    const option = document.createElement('option')
    option.value = value
    option.innerHTML = `URL - ${value}`

    url.appendChild(option)

    document.getElementById('urlinput').value = ``
    document.getElementById('urlinput').placeholder = `URL del Informe`
}

document.querySelector('[data-add-url]').addEventListener('click', addUrl, false)

const addTimer = () => {
    const date = document.getElementById('date').value
    if (!date) return alert('Seleccione una fecha valida.')
    let dt = new Date(date)

    const option = document.createElement('option')

    option.value = date

    option.innerHTML = `${dt.getHours()}:${dt.getMinutes()} ${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`

    document.getElementById('schedule').appendChild(option)
}

document.querySelector('[data-add-timer]').addEventListener('click', addTimer, false)

const addMail = async (event) => {
    event.preventDefault();

    try {
        const scheduleoption = document.querySelectorAll('#schedule option');
        const attachmentoption = document.querySelectorAll('#url option');
        const weekdayoption = document.querySelectorAll('#weekday option:checked');

        const schedule = Array.from(scheduleoption).map(el => `${el.value}`);
        const attachment = Array.from(attachmentoption).map(el => `${el.value}`);
        const weekday = Array.from(weekdayoption).map(el => `${el.value}`);

        const mailschedule = {
            for: event.currentTarget.for.value,
            cc: event.currentTarget.cc.value,
            cco: event.currentTarget.cco.value,
            title: event.currentTarget.title.value,
            body: event.currentTarget.message.value,
            type: event.currentTarget.type.value,
            datestart: event.currentTarget.datestart.value,
            dateend: event.currentTarget.dateend.value,
            hour: event.currentTarget.hour.value,
            weekday: weekday,
            schedule: schedule,
            urls: attachment
        };

        if (!mailschedule.for || !mailschedule.title || !mailschedule.body) return alert('Complete todos los campos del correo electrónico.');

        const obj = await Connection.body('mail', { mailschedule }, 'POST');

        $('#modalmailschedule').modal('hide');

        document.querySelector('[data-form-mail]').reset();
        
        const date = new Date();

        const rowNode = $('#tablemail').DataTable()
            .row
            .add([
                `<a><i data-view data-id="${obj.id}" class="fas fa-eye" style="color:#cbccce;"></i></a>
                 <a><i data-drop data-id="${obj.id}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
                `${mail.for}`,
                `${mailschedule.cc}`,
                `${mailschedule.cco}`,
                `${mailschedule.title}`,
                `${mailschedule.body}`,
                `${mailschedule.urls.length > 0 ? mailschedule.urls.length : "0"}`,
                `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            ])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });

        alert(obj.msg);
    } catch (error) {
        alert(error);
    }
}

document.querySelector('[data-form-mail]').addEventListener('submit', addMail, false)

const view = async (event) => {
    try {
        const id = event.target.getAttribute("data-id")
        const mail = await Connection.noBody(`mail/${id}`, 'GET')

        document.querySelector('[data-detail-for]').innerHTML = `<strong>Para:</strong> ${mail.details[0].recipients}`
        document.querySelector('[data-detail-cc]').innerHTML = `<strong>Cc:</strong> ${mail.details[0].cc}`
        document.querySelector('[data-detail-cco]').innerHTML = `<strong>Cco:</strong> ${mail.details[0].cco}`
        document.querySelector('[data-detail-title]').innerHTML = `<strong>Título del E-mail:</strong> ${mail.details[0].title}`
        document.querySelector('[data-detail-body]').innerHTML = mail.details[0].body
        document.querySelector('[data-detail-type]').innerHTML = `Se envían archivos adjuntos: ${mail.details[0].type}`
        document.querySelector('[data-detail-btn-att]').dataset['id_mailpowerbi'] = mail.details[0].id_mailpowerbi
        document.querySelector('[data-detail-btn-timer]').dataset['id_mailpowerbi'] = mail.details[0].id_mailpowerbi

        let dtview = mail.attachment.map(attachment => {
            return [
                `<a><i data-view data-id_mailattachment="${attachment.id_mailattachment}" data-url="${attachment.url}" data-id_mailpowerbi="${attachment.id_mailpowerbi}" class="fas fa-eye" style="color:#cbccce;"></i></a>
                <a><i data-drop data-id_mailattachment="${attachment.id_mailattachment}" data-id_mailpowerbi="${attachment.id_mailpowerbi}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
                `${attachment.url}`
            ]
        });

        let dtscheduling = mail.scheduling.map(schedule => {
            return [
                `<a><i data-drop data-id_mailscheduling="${schedule.id_mailscheduling}" data-id_mailpowerbi="${schedule.id_mailpowerbi}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
                `${schedule.date}`
            ]
        });

        $('#viewmail').modal('show')

        if ($.fn.DataTable.isDataTable('#tableattachment')) {
            $('#tableattachment').dataTable().fnClearTable();
            $('#tableattachment').dataTable().fnDestroy();
            $('#tableattachment').empty();
        }

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

        if ($.fn.DataTable.isDataTable('#tablescheduling')) {
            $('#tablescheduling').dataTable().fnClearTable();
            $('#tablescheduling').dataTable().fnDestroy();
            $('#tablescheduling').empty();
        }

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

        adjustModalDatatable()

    } catch (error) {

    }
}

const dropTimer = (event) => {
    try {
        const tr = event.path[3]
        if (tr.className === "child") tr = tr.previousElementSibling

        const id_mailscheduling = event.target.getAttribute("data-id_mailscheduling")

        $('#dropTimer').modal('show')

        const submit = async (event2) => {
            event2.preventDefault()

            const obj = await Connection.noBody(`scheduling/${id_mailscheduling}`, 'DELETE')

            $('#dropTimer').modal('hide')

            $('#tablescheduling').DataTable()
                .row(tr)
                .remove()
                .draw();

            alert(obj.msg)
            document.querySelector('[data-drop-timer]').removeEventListener('submit', submit, false)
        }

        document.querySelector('[data-drop-timer]').addEventListener('submit', submit, false)

    } catch (error) {

    }
}

document.querySelector('#tablescheduling').addEventListener('click', dropTimer, false)

const dropAttachment = (event) => {
    try {
        const tr = event.path[3]
        if (tr.className === "child") tr = tr.previousElementSibling

        const id_mailattachment = event.target.getAttribute("data-id_mailattachment")

        $('#dropAttachment').modal('show')

        const submit = async (event2) => {
            event2.preventDefault()

            const obj = await Connection.noBody(`attachment/${id_mailattachment}`, 'DELETE')

            $('#dropAttachment').modal('hide')

            $('#tableattachment').DataTable()
                .row(tr)
                .remove()
                .draw();

            alert(obj.msg)
            document.querySelector('[data-drop-attachment]').removeEventListener('submit', submit, false)
        }

        document.querySelector('[data-drop-attachment]').addEventListener('submit', submit, false)
    } catch (error) {

    }
}

const viewAttachment = (event) => {
    const url = event.target.getAttribute("data-url")

    document.querySelector('[data-attachment-image]').src = url

    $('#viewAttachment').modal('show')
}

const actionAttachment = (event) => {
    if (event.target && event.target.matches('[data-view]')) return viewAttachment(event)
    if (event.target && event.target.matches('[data-drop]')) return dropAttachment(event)
}

document.querySelector('#tableattachment').addEventListener('click', actionAttachment, false)

const addAttachment = async (event) => {
    try {
        const id_mailpowerbi = event.target.getAttribute("data-id_mailpowerbi")

        const obj = await Connection.noBody('powerbis', 'GET')

        obj.powerbis.forEach(powerbi => {
            const option = document.createElement('option')

            option.value = powerbi.url

            let data

            if (powerbi.name !== undefined) {
                data = `${powerbi.name} - ${powerbi.title}`
            } else {
                data = powerbi.title
            }

            option.innerHTML = data

            document.querySelector('#newbis').appendChild(option)
        });

        $('#addattachment').modal('show')

        const addBi = () => {
            const bis = document.querySelectorAll('#newbis option:checked')

            if (!bis) return alert('Seleccione uno Informe.')

            const value = Array.from(bis).map(el => el.value)
            const innerHTML = Array.from(bis).map(el => el.innerHTML)

            const url = document.getElementById('urlnew')

            const option = document.createElement('option')
            option.value = value
            option.innerHTML = innerHTML

            url.appendChild(option)

            $('#newbis option').prop('selected', function () {
                return this.defaultSelected;
            });
        }

        document.querySelector('[data-new-report]').addEventListener('click', addBi, false)

        const addUrl = () => {
            const value = document.getElementById('newurlinput').value

            if (!value) return alert('Insira uno Informe.')

            const url = document.getElementById('urlnew')

            const option = document.createElement('option')
            option.value = value
            option.innerHTML = `URL - ${value}`

            url.appendChild(option)

            document.getElementById('newurlinput').value = ``
            document.getElementById('newurlinput').placeholder = `URL del Informe`
        }

        document.querySelector('[data-new-url]').addEventListener('click', addUrl, false)

        const submit = async (event2) => {
            event2.preventDefault()

            const attachmentoption = document.querySelectorAll('#urlnew option')
            const attachment = {
                urls: Array.from(attachmentoption).map(el => `${el.value}`),
                id_mailpowerbi
            }

            const obj = await Connection.body('attachment', { attachment }, 'POST')
            const rowNode = $('#tableattachment').DataTable()

            obj.attachments.forEach(att => {
                rowNode
                    .row
                    .add([
                        `<a><i data-view data-id_mailattachment="${att.id}" data-url="${att.url}" data-id_mailpowerbi="${id_mailpowerbi}" class="fas fa-eye" style="color:#cbccce;"></i></a>
                    <a><i data-drop data-id_mailattachment="${att.id}" data-id_mailpowerbi="${id_mailpowerbi}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
                        `${att.url}`
                    ])
                    .draw()
                    .node();

                $(rowNode)
                    .css('color', 'black')
                    .animate({ color: '#4e73df' });
            })

            alert(obj.msg)
            document.querySelector('[data-mail-add-reports]').removeEventListener('submit', submit, false)

            $('#addattachment').modal('hide')
        }

        document.querySelector('[data-mail-add-reports]').addEventListener('submit', submit, false)

    } catch (error) {

    }
}

document.querySelector('[data-mail-add-attachment]').addEventListener('click', addAttachment, false)

const newTimer = (event) => {

    const id_mailpowerbi = event.target.getAttribute("data-id_mailpowerbi")
    $('#addschedule').modal('show')

    const click = () => {
        const date = document.getElementById('datenew').value
        let dt = new Date(date)

        const option = document.createElement('option')
        option.value = date
        option.innerHTML = `${dt.getHours()}:${dt.getMinutes()} ${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`

        document.getElementById('newschedule').appendChild(option)
    }

    document.querySelector('[data-add-new-timer]').addEventListener('click', click, false)

    const submit = async (event2) => {
        event2.preventDefault()

        const scheduleoption = document.querySelectorAll('#newschedule option')
        const schedule = Array.from(scheduleoption).map(el => `${el.value}`)
        let dt = new Date(schedule)

        const scheduling = {
            schedule,
            id_mailpowerbi
        }

        const obj = await Connection.body('scheduling', { scheduling }, 'POST')

        const rowNode = $('#tablescheduling').DataTable()
            .row
            .add([
                `<a><i data-drop data-id_mailscheduling="${obj.id}" data-id_mailpowerbi="${id_mailpowerbi}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
                `${dt.getHours()}:${dt.getMinutes()} ${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`
            ])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });


        $('#addschedule').modal('hide')
        alert(obj.msg)
        document.querySelector('[data-mail-add-timer]').removeEventListener('submit', submit, false)
    }

    document.querySelector('[data-mail-add-timer]').addEventListener('submit', submit, false)
}

document.querySelector('[data-btn-add-timer]').addEventListener('click', newTimer, false)


function adjustModalDatatable() {
    $('#viewmail').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}

const drop = (event) => {
    event.preventDefault()
    try {
        const tr = event.path[3]
        if (tr.className === "child") tr = tr.previousElementSibling

        const id = event.target.getAttribute("data-id")

        $('#deleteMail').modal('show')

        const submit = async (event2) => {
            event2.preventDefault()

            const obj = await Connection.noBody(`mail/${id}`, 'DELETE')

            $('#tablemail').DataTable()
                .row(tr)
                .remove()
                .draw();

            $('#deleteMail').modal('hide')

            document.querySelector('[data-drop-mail]').removeEventListener('submit', submit, false)
            alert(obj.msg)
        }

        document.querySelector('[data-drop-mail]').addEventListener('submit', submit, false)

    } catch (error) {

    }
}

const action = (event) => {
    if (event.target && event.target.matches('[data-view]')) return view(event)
    if (event.target && event.target.matches('[data-drop]')) return drop(event)
}

document.querySelector('#tablemail').addEventListener('click', action, false)


