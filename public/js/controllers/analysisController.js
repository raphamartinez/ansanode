import { Connection } from '../services/connection.js'

const init = async () => {
    const offices = await Connection.noBody('offices', 'GET');
    offices.forEach(office => {
        const line = document.createElement('option');
        line.value = office.code;
        line.innerHTML = office.name;

        if(office.code != "00") document.querySelector('#office').appendChild(line);
    });

    $('#office').selectpicker("refresh");

    const clients = await Connection.noBody('clients/hbs', 'GET');
    clients.forEach(client => {
        const line = document.createElement('option');
        line.value = client.CustCode;
        line.innerHTML = client.CustName;

        document.querySelector('#client').appendChild(line);
    });

    $('#client').selectpicker("refresh");

    $("#dataTable").DataTable({
        data: [],
        columns: [
            { title: "Cod Cliente" },
            { title: "Nombre Cliente" },
            { title: "Valor Totale" },
            { title: "Moneda" }
        ],
        paging: false,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        autoWidth: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    })
}

init()

const table = (dtview) => {
    
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        data: dtview,
        columns: [
            { title: "Cod Cliente" },
            { title: "Nombre Cliente" },
            { title: "Valor Totale" },
            { title: "Moneda" }
        ],
        paging: false,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        autoWidth: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    })
}

const search = async (event) => {
    event.preventDefault();

    try {
        let selectoffice = document.querySelectorAll('#office option:checked')
        let offices = Array.from(selectoffice).map(el => `${el.value}`);
        if (offices.length === 0) offices[0] = "ALL"

        let selectclients = document.querySelectorAll('#client option:checked')
        let clients = Array.from(selectclients).map(el => `${el.value}`);
        if (clients.length === 0) clients[0] = "ALL"

        const search = {
            month: event.target.month.value,
            offices: offices,
            clients: clients
        };

        if (!month) {
            return alert("¡El período es obligatorio!")
        }

        const data = await Connection.noBody(`invoices/client/${search.month}/${search.offices}/${search.clients}`, 'GET')

        let dtview = data.map(obj => {
            return [
                obj.code,
                obj.name,
                obj.amount,
                obj.currency,
            ]
        });


        table(dtview)

    } catch (error) {
    }
}

document.querySelector('[data-form-search]').addEventListener('submit', search, false);