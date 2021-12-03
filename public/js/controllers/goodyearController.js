import { Connection } from '../services/connection.js'

const list = (items) => {

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        data: items,
        columns: [
            { title: "Opciones" },
            { title: "Cod Articulo" },
            { title: "Nombre" },
            { title: "Cant Stock" },
            { title: "Cant Vendido" }
        ],
        paging: true,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
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
    })
}

const search = async (event) => {
    event.preventDefault();

    const datestart = event.currentTarget.datestart.value;
    const dateend = event.currentTarget.dateend.value;

    const arroffice = document.querySelectorAll('#office option:checked');
    let office = Array.from(arroffice).map(el => `'${el.value}'`);
    if (office.length === 0) office = "ALL"

    const arritemgroup = document.querySelectorAll('#itemgroup option:checked');
    let itemgroup = Array.from(arritemgroup).map(el => `'${el.value}'`);
    if (itemgroup.length === 0) itemgroup = "ALL"

    const data = await Connection.noBody(`goodyear/${datestart}/${dateend}/${itemgroup}/${office}`, 'GET');

    const items = data.map(item => {
        return [
            `<a onclick="listStocks(event)" href="" data-artcode="${item.ArtCode}" data-artname="${item.ItemName}" data-cant="${item.StockQty}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
            `${item.ArtCode}`,
            `${item.ItemName}`,
            `${item.StockQty}`,
            `${item.SalesQty}`
        ]
    });

    list(items);
};

const items = async () => {

    const offices = await Connection.noBody('offices', 'GET');

    offices.forEach(office => {
        const option = document.createElement('option');
        option.value = office.code;
        option.innerHTML = office.name;

        document.querySelector('#office').appendChild(option);
    });

    $('#office').selectpicker("refresh");
    $('#itemgroup').selectpicker("refresh");
}

list();
items();

document.querySelector('[data-form-search]').addEventListener('submit', search, false);