import { View } from "../views/clockView.js"
import { Connection } from '../services/connection.js'

const clean = () => {
    document.querySelector('[data-card]').style.display = 'none';

    document.querySelector('[data-title]').innerHTML = `Control de Punto`;
    document.querySelector('[data-powerbi]').innerHTML = ""
    document.querySelector('[data-modal]').innerHTML = ""
    document.querySelector('[data-settings]').innerHTML = ""
    document.querySelector('[data-features]').innerHTML = ""

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }
}

const search = async (event) => {
    event.preventDefault()

    let start = 0
    let end = 0
    let type = 0

    let selectoffice = document.querySelectorAll('#office option:checked')
    let offices = Array.from(selectoffice).map(el => `'${el.value}'`);

    let selectcode = document.querySelectorAll('#code option:checked')
    let codes = Array.from(selectcode).map(el => `'${el.value}'`);

    if (document.querySelector('[data-datestart]').value) start = document.querySelector('[data-datestart]').value
    if (document.querySelector('[data-dateend]').value) end = document.querySelector('[data-dateend]').value
    if (document.querySelector('[data-type]').value != "" || document.querySelector('[data-type]').value != "0") type = document.querySelector('[data-type]').value
    if (offices.length == 0) offices = 0
    if (codes.length == 0) codes = 0

    const search = {
        type: type,
        period: {
            start: start,
            end: end
        },
        codes: codes,
        offices: offices
    }

    if (!search.period.start || !search.period.end) {
        return alert("¡El período es obligatorio!")
    }

    document.querySelector('[data-loading]').style.display = "block"
    document.querySelector('[data-status]').selectedIndex = 0

    let data
    try { 
         data = await Connection.noBody(`clock/${search.type}/${search.period.start}/${search.period.end}/${search.codes}/${search.offices}`, 'GET')
    } catch (error) {
        document.querySelector('[data-loading]').style.display = "hide"
    }

    const clocks = data.map(clock => {
        const date = new Date(clock.Date)
        const time = clock.Time.split(":")
        date.setHours(time[0], time[1], time[2])

        let dayweek
        let status
        let timeAccept

        switch (date.getDay()) {
            case 1:
                dayweek = "Lunes"
                break;
            case 2:
                dayweek = "Martes"
                break;
            case 3:
                dayweek = "Miércoles"
                break;
            case 4:
                dayweek = "Jueves"
                break;
            case 5:
                dayweek = "Viernes"
                break;
            case 6:
                dayweek = "Sábado"
                break;
            case 7:
                dayweek = "Domingo"
                break;
            default:
                dayweek = "No Definido"
                break;
        }

        switch (date.getDay()) {
            case 6:
                timeAccept = new Date(`${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} 06:30:00`)

                if ((date.getTime() > timeAccept.getTime()) || date.getTime() < 14) {
                    status = `<button data-toggle="popover" title="En horário" type="button" style="color:#1cc88a" class="btn btn-success btn-circle btn-sm">1</button>`
                } else {
                    status = `<button data-toggle="popover" title="Fuera de horário" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
                }
                break;
            case 7:
                if ((date.getTime() > 7 || date.getTime() < 14) && clock.Office == "") {
                    status = `<button data-toggle="popover" title="En horário" type="button" style="color:#1cc88a" class="btn btn-success btn-circle btn-sm">1</button>`
                } else {
                    status = `<button data-toggle="popover" title="Fuera de horário" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
                }
                break;
            default:
                timeAccept = new Date(`${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} 06:30:00`)

                if ((date.getTime() > timeAccept.getTime()) || date.getTime() < 19) {
                    status = `<button data-toggle="popover" title="En horário" type="button" style="color:#1cc88a" class="btn btn-success btn-circle btn-sm">1</button>`
                } else {
                    status = `<button data-toggle="popover" title="Fuera de horário" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
                }
                break;
        }

        let line = [
            status,
            dayweek,
            `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            clock.Name,
            clock.type,
            clock.Office
        ]

        return line
    })

    document.querySelector('[data-div-clock]').classList.remove('d-none')

    if ($.fn.DataTable.isDataTable('#dataClock')) {
        $('#dataClock').dataTable().fnClearTable();
        $('#dataClock').dataTable().fnDestroy();
        $('#dataClock').empty();
    }

    const table = $("#dataClock").DataTable({
        destroy: true,
        data: clocks,
        columns: [
            { title: "Status" },
            { title: "Dia" },
            { title: "Fecha" },
            { title: "Nombre" },
            { title: "Tipo" },
            { title: "Sucursal" }
        ],
        paging: false,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        pagingType: "numbers",
        searchPanes: true,
        searching: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    })

    const status = (event) => {

        table.rows().every(function (index, element) {
            let row = $(this.node());

            if (row[0].children[0].children[0].innerText != event.target.value) {
                row[0].style.display = 'none'
            } else {
                row[0].style.display = ''
            }

            if (event.target.value == "0") row[0].style.display = ''
        });
    }

    document.querySelector('[data-status]').addEventListener('change', status, false)
    document.querySelector('[data-loading]').style.display = "none"
}

const viewFilters = async () => {
    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const line = document.createElement('option')
        line.value = office.code
        line.innerHTML = office.name

        document.querySelector('[data-office]').appendChild(line)
    })

    $('[data-office]').selectpicker();

    const workers = await Connection.noBody('clock/workers', 'GET')
    workers.forEach(worker => {
        const line = document.createElement('option')
        line.value = worker.code
        line.innerHTML = worker.name

        document.querySelector('[data-code]').appendChild(line)
    })

    $('[data-code]').selectpicker();
    $('[data-type]').selectpicker();

}

const dashboard = async () => {
    document.querySelector('[data-loading]').style.display = "block"

    //clean the page
    clean()
    document.querySelector('[data-title]').appendChild(View.header())
    document.querySelector('[data-features]').appendChild(View.table())

    viewFilters()

    document.querySelector('[data-loading]').style.display = "none"
    document.querySelector('[data-form-clock]').addEventListener('submit', search, false)
}

document.querySelector('[data-menu-point]').addEventListener('click', dashboard, false)

