import { Connection } from '../services/connection.js'


const search = async (event) => {
    event.preventDefault()

    let start = 0
    let end = 0
    let type = 0

    let selectoffice = document.querySelectorAll('#office option:checked')
    let offices = Array.from(selectoffice).map(el => `'${el.value}'`);

    if (document.querySelector('[data-datestart]').value) start = document.querySelector('[data-datestart]').value
    if (document.querySelector('[data-dateend]').value) end = document.querySelector('[data-dateend]').value
    if (document.querySelector('[data-type]').value != "" || document.querySelector('[data-type]').value != "0") type = document.querySelector('[data-type]').value
    if (offices.length == 0) offices = "ALL"

    const search = {
        type: type,
        period: {
            start: start,
            end: end
        },
        offices: offices
    }

    if (!search.period.start || !search.period.end) {
        return alert("¡El período es obligatorio!")
    }

    document.querySelector('[data-loading]').style.display = "block"
    document.querySelector('[data-status]').selectedIndex = 0

    let data
    try {
        data = await Connection.noBody(`office/prosegur/${search.type}/${search.period.start}/${search.period.end}/${search.offices}`, 'GET')
    } catch (error) {
        document.querySelector('[data-loading]').style.display = "hide"
    }

    const clocks = data.map(clock => {
        const date = new Date(clock.date)

        let dayweek

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


        let line = [
            dayweek,
            `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            clock.user,
            clock.type,
            clock.office,
            clock.contract
        ]

        return line
    })

    document.querySelector('[data-div-clock]').classList.remove('d-none')

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    const table = $("#dataTable").DataTable({
        destroy: true,
        data: clocks,
        columns: [
            { title: "Dia" },
            { title: "Fecha" },
            { title: "Nombre" },
            { title: "Tipo" },
            { title: "Sucursal" },
            { title: "Contrato" },
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
        document.querySelector('[data-status]').disabled = true
        document.querySelector('[data-loading]').style.display = "block"

        table.rows().every(function (index, element) {
            let row = $(this.node());

            if (row[0].children[3].innerText != event.target.value) {
                row[0].style.display = 'none'
            } else {
                row[0].style.display = ''
            }

            if (event.target.value == "0") row[0].style.display = ''
        });

        document.querySelector('[data-loading]').style.display = "none"
        document.querySelector('[data-status]').disabled = false
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

    $('[data-office]').selectpicker("refresh");
    $('[data-type]').selectpicker("refresh");

}

viewFilters()

document.querySelector('[data-form-office]').addEventListener('submit', search, false)

