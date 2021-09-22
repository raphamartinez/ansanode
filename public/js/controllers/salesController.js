import { Connection } from '../services/connection.js'
import { ViewSales } from '../views/salesView.js'

const btnSalesOrder = document.querySelector('[data-salesorder]')
const cardHistory = document.querySelector('[data-card]')

btnSalesOrder.addEventListener('click', async (event) => {
    event.preventDefault()

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    cardHistory.style.display = 'none';
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    try {
        const btn = event.currentTarget
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');


        title.innerHTML = "Diario Ordenes de Ventas"
        modal.innerHTML = ''
        settings.innerHTML = ''
        loading.innerHTML = ``

        title.appendChild(ViewSales.buttonsearch())
        modal.appendChild(ViewSales.modalsearch())

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
        $('#selectsellers').selectpicker();
        $('#selectoffice').selectpicker();
        $('#searchSalesOrder').modal('show')

    } catch (error) {
        loading.innerHTML = ``
        filecontent.innerHTML = ``
    }
})

window.listSales = listSales

async function listSales(event) {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>`
    const btn = event.currentTarget
    let title = document.querySelector('[data-title]')

    const selectsellers = document.querySelectorAll('#selectsellers option:checked')
    const sellers = Array.from(selectsellers).map(el => `'${el.value}'`);

    const selectoffice = document.querySelectorAll('#selectoffice option:checked')
    const offices = Array.from(selectoffice).map(el => `'${el.value}'`);

    let search = {
        datestart: btn.form.datestart.value,
        dateend: btn.form.dateend.value,
        salesman: sellers,
        office: offices
    }

    if(!search.datestart && !search.dateend) {
        return alert("¡El período es obligatorio!")
    }

    if(search.salesman.length === 0) search.salesman = "ALL"
    if(search.office.length === 0) search.office = "ALL"

    $('#searchSalesOrder').modal('hide')

    const data = await Connection.noBody(`salesorder/${search.datestart}/${search.dateend}/${search.salesman}/${search.office}`, 'GET')

    const dtview = []
    let amountusd = data[0].sumAmount.toLocaleString('en-US',{style: 'currency', currency: 'USD'})
    data.forEach(obj => {
        const line = ViewSales.showSales(obj)
        dtview.push(line)
    })

    // const text = document.createElement('h5')
    // text.style.color = 'gray'
    // text.style.fontSize = '1rem'
    // text.style.alignContent = 'left'

    // text.innerHTML += `<br>Filtros<br>`
    // if (search.salesman.length > 0) text.innerHTML += `<br>Vendedor: ${search.salesman}<br>`
    // if (search.office.length > 0) text.innerHTML += `Sucursal: ${search.office}<br>`

    // title.appendChild(text)

    document.getElementById('cardamount').innerHTML = `Monto USD: ${amountusd} `
    viewSalesOrder(dtview)
    loading.innerHTML = ``


    selectsellers.values = ''
    selectoffice.values = ''

}

function viewSalesOrder(dtview) {

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    let user = JSON.parse(sessionStorage.getItem('user'))

    let perfil = user.perfil

    if (perfil !== 1) {
        $(document).ready(function () {
            $("#dataTable").DataTable({
                data: dtview,
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
                fixedHeader: false
            }
            )
        })
    } else {
        $(document).ready(function () {
            $("#dataTable").DataTable({
                destroy: true,
                data: dtview,
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
        })
    }

}