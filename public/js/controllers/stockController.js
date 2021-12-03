import { ViewStock } from "../views/stockView.js"
import { Connection } from '../services/connection.js'




const list = (items) => {

    if ($.fn.DataTable.isDataTable('#dataStock')) {
        $('#dataStock').dataTable().fnClearTable();
        $('#dataStock').dataTable().fnDestroy();
        $('#dataStock').empty();
    }

    $("#dataStock").DataTable({
        data: items,
        columns: [
            { title: "Opciones" },
            { title: "Grupo" },
            { title: "Cod Articulo" },
            { title: "Nombre" },
            { title: "Cant Stock" }
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
    event.preventDefault()

    let code = event.currentTarget.code.value
    if (code === "") code = "ALL"

    let name = event.currentTarget.name.value
    if (name === "") name = "ALL"

    const arritemgroup = document.querySelectorAll('#itemgroup option:checked')
    let itemgroup = Array.from(arritemgroup).map(el => `'${el.value}'`);
    if (itemgroup.length === 0) itemgroup = "ALL"
    const arrstock = document.querySelectorAll('#stock option:checked')
    let stock = Array.from(arrstock).map(el => `'${el.value}'`);
    if (stock.length === 0) stock = "ALL"
    const empty = document.querySelector('input[name="empty"]:checked').value;

    const data = await Connection.noBody(`stock/items/${name}/${code}/${stock}/${itemgroup}/${empty}`, 'GET')

    const items = data.map(item => {
        return [
            `<a><i data-view data-artcode="${item.ArtCode}" data-artname="${item.ItemName}" data-cant="${item.StockQty}" class="fas fa-eye" style="color:#cbccce;"></i></a>`,
            `${item.ItemGroup}`,
            `${item.ArtCode}`,
            `${item.ItemName}`,
            `${item.StockQty}`,
        ]
    })

    list(items)
}

const stock = async () => {

    const fields = await Connection.noBody('stockuser', 'GET')

    if (fields === false) {
        return alert("No tiene acceso a ningún stock, solicite acceso a un administrador.")
    }

    fields.stocks.forEach(stock => {
        const option = document.createElement('option')
        option.value = stock.StockDepo
        option.innerHTML = stock.StockDepo
        document.querySelector('#stock').appendChild(option)
    });

    fields.groups.forEach(group => {
        const option = document.createElement('option')
        option.value = group.Name
        option.innerHTML = group.Name
        document.querySelector('#itemgroup').appendChild(option)
    });

    $('#stock').selectpicker("refresh");
    $('#itemgroup').selectpicker("refresh");

    document.querySelector("#stockartsi").checked = true;

    const items = await Connection.noBody('itemscomplete', 'GET')
    items.forEach(item => {
        const line = document.createElement('option')
        line.value = item.ItemName
        line.innerHTML = item.ItemName

        const line2 = document.createElement('option')
        line2.value = item.ArtCode
        line2.innerHTML = item.ArtCode

        document.querySelector('[data-namelist]').appendChild(line)
        document.querySelector('[data-codelist]').appendChild(line2)

    })
}

list()
stock()

document.querySelector('[data-form-search]').addEventListener('submit', search, false)