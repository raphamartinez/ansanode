import { Connection } from '../services/connection.js'
import { ViewSales } from '../views/salesView.js'

const list = (sales) => {

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        data: sales,
        columns: [
            { title: "Nr Factura" },
            { title: "Fecha" },
            { title: "Vendedor" },
            { title: "Cod Cliente" },
            { title: "Cliente" },
            { title: "Cod Articulo" },
            { title: "Articulo" },
            { title: "Etiqueta" },
            { title: "Cant" },
            { title: "Moneda" },
            { title: "Monto Moneda" },
            { title: "Monto USD s/IVA" },
            { title: "Monto USD c/IVA" }
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
}

const init = async () => {
    const sellers = await Connection.noBody('sellershbs', 'GET')
    const selectSellers = document.getElementById('selectsellers')
    sellers.forEach(salesman => {
        selectSellers.appendChild(ViewSales.optionSeller(salesman))
    })

    const offices = await Connection.noBody('offices', 'GET')
    const selectOffice = document.getElementById('selectoffice')
    offices.forEach(office => {
        selectOffice.appendChild(ViewSales.optionOffice(office))
    })

    const groups = await Connection.noBody('itemsgroups', 'GET')
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.Code;
        option.innerHTML = group.Name;
        document.getElementById('selectgroups').appendChild(option)
    })

    await $('#selectgroups').selectpicker("refresh");
    await $('#selectsellers').selectpicker("refresh");
    await $('#selectoffice').selectpicker("refresh");
}

const search = async (event) => {
    event.preventDefault()

    const selectsellers = document.querySelectorAll('#selectsellers option:checked')
    const sellers = Array.from(selectsellers).map(el => `'${el.value}'`);

    let offices
    let selectoffice = document.querySelectorAll('#selectoffice option:checked')
    offices = Array.from(selectoffice).map(el => `'${el.value}'`);

    const selectgroups = document.querySelectorAll('#selectgroups option:checked')
    const groups = Array.from(selectgroups).map(el => `'${el.value}'`);


    if (offices.length === 0) {
        let selectofficedefault = document.querySelectorAll('#selectoffice option')
        offices = Array.from(selectofficedefault).map(el => `'${el.value}'`);
    }

    let search = {
        datestart: event.currentTarget.datestart.value,
        dateend: event.currentTarget.dateend.value,
        salesman: sellers,
        office: offices,
        group: groups
    }

    if (search.salesman.length === 0) search.salesman = "ALL"
    if (search.office.length === 0) search.office = "ALL"
    if (search.group.length === 0) search.group = "ALL"

    const data = await Connection.noBody(`salesorder/${search.datestart}/${search.dateend}/${search.salesman}/${search.office}/${search.group}`, 'GET')

    if (data.length === 0) {

        document.querySelector('[data-qty]').innerHTML = "";
        document.querySelector('[data-subtotal]').innerHTML = "";
        document.querySelector('[data-total]').innerHTML = "";

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        };

        return alert('No hay orden de ventas para listar');
    }

    if (search.group.length === 0) {

        document.querySelector('[data-qty]').innerHTML = `Cant: ${data[0].Qty > 0 ? data[0].Qty : 0}`

        let subAmountUsd = data[0].subAmountUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        document.querySelector('[data-subtotal]').innerHTML = `Subtotal: ${subAmountUsd}`

        let amountUsd = data[0].amountUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        document.querySelector('[data-total]').innerHTML = `Total: ${amountUsd}`

    } else {
        const obj = {qtt: 0, sub: 0, total: 0}
        let amount = data.reduce((previousValue, currentValue) => {
            previousValue.qtt += currentValue.Qty;
            currentValue.codeGroup != 14 ? previousValue.total += currentValue.itemTotalUsd : previousValue.total += currentValue.totalUsd
            currentValue.codeGroup != 14 ? previousValue.sub += currentValue.itemSubtotalUsd : previousValue.sub += currentValue.subtotalUsd
            
            return previousValue
        }, Object.create(obj))

        document.querySelector('[data-qty]').innerHTML = `Cant: ${amount.qtt}`
        document.querySelector('[data-subtotal]').innerHTML = `Subtotal: ${amount.sub.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
        document.querySelector('[data-total]').innerHTML = `Total: ${amount.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
    }

    const sales = data.map(sale => {
        return [
            `${sale.SerNr}`,
            `${sale.date}`,
            `${sale.SalesMan}`,
            `${sale.CustCode}`,
            `${sale.CustName}`,
            `${sale.ArtCode}`,
            `${sale.Name}`,
            `${sale.Labels}`,
            `${sale.Qty}`,
            `${sale.Currency}`,
            `${sale.RowNet}`,
            `${sale.subtotalUsd}`,
            `${sale.totalUsd}`,
        ]
    })

    list(sales)
}

init()
list()

document.querySelector('[data-form-search]').addEventListener('submit', search, false)