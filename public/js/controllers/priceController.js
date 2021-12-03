import { Connection } from '../services/connection.js'

const list = (items) => {

    if ($.fn.DataTable.isDataTable('#dataPriceList')) {
        $('#dataPriceList').dataTable().fnClearTable();
        $('#dataPriceList').dataTable().fnDestroy();
        $('#dataPriceList').empty();
    }

    $("#dataPriceList").DataTable({
        data: items,
        columns: [
            { title: "Promocion" },
            { title: "Grupo" },
            { title: "Cod Articulo" },
            { title: "Nombre" },
            { title: "Precio" }
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

    const pricelist = document.querySelector('#pricelist :checked').value;

    const data = await Connection.noBody(`price/${name}/${code}/${itemgroup}/${pricelist}`, 'GET')

    const items = data.map(item => {
        return [
            `${item.PriceList}`,
            `${item.ItemGroup}`,
            `${item.ArtCode}`,
            `${item.ItemName}`,
            `${item.Price}`
        ]
    })

    list(items)
}

const items = async () => {

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
items()

document.querySelector('[data-form-search]').addEventListener('submit', search, false)