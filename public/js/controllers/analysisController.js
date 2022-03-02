import { Connection } from '../services/connection.js'

const init = async () => {
    const offices = await Connection.noBody('offices', 'GET');
    offices.forEach(office => {
        const option = document.createElement('option');
        option.value = office.code;
        option.innerHTML = office.name;

        if (office.code != "00") document.querySelector('#office').appendChild(option);
    });

    $('#office').selectpicker("refresh");

    const groups = await Connection.noBody('itemsgroups', 'GET')
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.Code;
        option.innerHTML = group.Name;
        document.querySelector('#group').appendChild(option)
    })

    $('#group').selectpicker("refresh");

    const clients = await Connection.noBody('clients/hbs', 'GET');
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.CustCode;
        option.innerHTML = client.CustName;

        document.querySelector('#client').appendChild(option);
    });

    $('#client').selectpicker("refresh");

    $("#dataTable").DataTable({
        data: [],
        columns: [
            { title: "Cod Cliente" },
            { title: "Nombre Cliente" },
            { title: "Grupo" },
            { title: "Cant" },
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
            { title: "Grupo" },
            { title: "Cant" },
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

        let selectgroups = document.querySelectorAll('#group option:checked')
        let groups = Array.from(selectgroups).map(el => `${el.value}`);
        if (groups.length === 0) groups[0] = "ALL"

        const search = {
            start: event.target.start.value,
            end: event.target.end.value,
            offices,
            clients,
            groups
        };

        const data = await Connection.noBody(`invoices/client/${search.start}/${search.end}/${search.offices}/${search.clients}/${search.groups}`, 'GET')

        let dtview = data.map(obj => {
            let amount = 0;
            obj.currency == "GS" ? amount = obj.amount.toLocaleString('es') : amount = obj.amount.toLocaleString('en-US');
            
            return [
                obj.code,
                obj.name,
                obj.groupName,
                obj.qty,
                amount,
                obj.currency,
            ]
        });


        table(dtview)

    } catch (error) {
    }
}

document.querySelector('[data-form-search]').addEventListener('submit', search, false);