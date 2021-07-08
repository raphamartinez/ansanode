import { View } from "../views/itemView.js"
import { ServiceItem } from "../services/itemService.js"
import { Service } from "../services/userService.js"

window.listItems = listItems

async function listItems() {

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        const cardHistory = document.querySelector('[data-card]')
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = " "
        modal.appendChild(View.showModalSearch())

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Listar Articulos"
        powerbi.innerHTML = " "
        loading.innerHTML = " "
        cardHistory.style.display = 'none';


        const selectstock = document.getElementById('stock')
        const selectitemgroup = document.getElementById('itemgroup')
        const fields = await ServiceItem.listModal()

        fields.stocks.forEach(obj => {
            selectstock.appendChild(View.listOption(obj.StockDepo))
        });

        fields.groups.forEach(obj => {
            selectitemgroup.appendChild(View.listOption(obj.Name))
        });

        document.getElementById("stockartsi").checked = true;

        ('#stock option:selected').remove();
        ('#itemgroup option:selected').remove();
        title.appendChild(View.btnNewSearch())

    } catch (error) {

    }
}

window.search = search

async function search(event) {
    event.preventDefault()
    $('#search').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const btn = event.currentTarget
        const arritemgroup = document.querySelectorAll('#itemgroup option:checked')
        const itemgroup = Array.from(arritemgroup).map(el => `'${el.value}'`);

        const artcode = btn.form.artcode.value
        const itemname = btn.form.itemname.value
        const arrstock = document.querySelectorAll('#stock option:checked')
        const stock = Array.from(arrstock).map(el => `'${el.value}'`);
        const stockart = document.querySelector('input[name="stockart"]:checked').value;

        const search = {
            itemgroup: itemgroup,
            artcode: artcode,
            itemname: itemname,
            stock: stock,
            stockart: stockart
        }

        const data = await ServiceItem.listItems(search)
        let dtview = [];
        data.forEach(obj => {
            const field = View.listItems(obj)
            dtview.push(field)
        });

        let title = document.querySelector('[data-title]')
        const text = document.createElement('h5')
        text.style.color = 'gray'
        text.style.fontSize = '1rem'
        text.style.alignContent = 'left'

        text.innerHTML += `<br>Filtros<br>`
        if(stock[0].length > 2) text.innerHTML += `<br>Deposito: ${stock}<br>`
        if(itemgroup[0].length > 2) text.innerHTML += `Grupo de Articulo: ${itemgroup}<br>`
        if(artcode > 0) text.innerHTML += `Articulo: ${itemname} Cod: ${artcode}<br>`

        title.appendChild(text)

        $(document).ready(function () {
            $("#dataTable").DataTable({
                data: dtview,
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

        loading.innerHTML = " "
    } catch (error) {
        console.log(error);
        loading.innerHTML = " "
        alert(error)
    }
}

window.listStocks = listStocks

async function listStocks(event) {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    let modal = document.querySelector('[data-modal]')
    loading.innerHTML = `
<div class="d-flex justify-content-center align-items-center spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    const btn = event.currentTarget
    const artcode = btn.getAttribute("data-artcode")
    const artname = btn.getAttribute("data-artname")
    const cant = btn.getAttribute("data-cant")

    modal.innerHTML = ''
    modal.appendChild(View.showModalStock(artname, artcode, cant))

    const data = await ServiceItem.listStocks(artcode)
    let tbodystock = document.getElementById('tbodystock')

    tbodystock.innerHTML = ''

    data.forEach(obj => {
        tbodystock.appendChild(View.newLine(obj))
    });

    $('#modalstock').modal('show')

    loading.innerHTML = " "
}


window.listPrice = listPrice

async function listPrice() {

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        const cardHistory = document.querySelector('[data-card]')
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = " "
        modal.appendChild(View.showModalPrice())

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Lista de Precios y Saldos"
        powerbi.innerHTML = " "
        loading.innerHTML = " "
        cardHistory.style.display = 'none';


        const selectstock = document.getElementById('stock')
        const selectitemgroup = document.getElementById('itemgroup')
        const fields = await ServiceItem.listModal()

        fields.stocks.forEach(obj => {
            selectstock.appendChild(View.listOption(obj.StockDepo))
        });

        fields.groups.forEach(obj => {
            selectitemgroup.appendChild(View.listOption(obj.Name))
        });

        document.getElementById("stockartsi").checked = true;

        ('#stock option:selected').remove();
        ('#itemgroup option:selected').remove();
        title.appendChild(View.btnNewSearch())

    } catch (error) {

    }
}

window.searchPrice = searchPrice

async function searchPrice(event) {
    event.preventDefault()
    $('#searchPrice').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const btn = event.currentTarget
        const pricelist = btn.form.pricelist.value
        const arritemgroup = document.querySelectorAll('#itemgroup option:checked')
        const itemgroup = Array.from(arritemgroup).map(el => `'${el.value}'`);

        const artcode = btn.form.artcode.value
        const itemname = btn.form.itemname.value
        const arrstock = document.querySelectorAll('#stock option:checked')
        const stock = Array.from(arrstock).map(el => `'${el.value}'`);
        const stockart = document.querySelector('input[name="stockart"]:checked').value;

        const search = {
            pricelist: pricelist,
            itemgroup: itemgroup,
            artcode: artcode,
            itemname: itemname,
            stock: stock,
            stockart: stockart
        }

        const data = await ServiceItem.listPrice(search)
        let dtview = [];
        data.forEach(obj => {
            const field = View.listPrice(obj)
            dtview.push(field)
        });

        let title = document.querySelector('[data-title]')
        const text = document.createElement('h5')
        text.style.color = 'gray'
        text.style.fontSize = '1rem'
        text.style.alignContent = 'left'

        text.innerHTML += `<br>Filtros<br>`
        if(stock[0].length > 2) text.innerHTML += `<br>Deposito: ${stock}<br>`
        if(itemgroup[0].length > 2) text.innerHTML += `Grupo de Articulo: ${itemgroup}<br>`
        if(pricelist !== " ") text.innerHTML += `Promocion: ${pricelist}<br>`
        if(artcode > 0) text.innerHTML += `Articulo: ${itemname} Cod: ${artcode}<br>`

        title.appendChild(text)

        $(document).ready(function () {
            $("#dataTable").DataTable({
                data: dtview,
                columns: [
                    { title: "Opciones" },
                    { title: "Promocion" },
                    { title: "Grupo" },
                    { title: "Cod Articulo" },
                    { title: "Nombre" },
                    { title: "Precio" },
                    { title: "Cant Stock" }
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

        loading.innerHTML = " "
    } catch (error) {
        console.log(error);
        loading.innerHTML = " "
        alert(error)
    }
}


window.listGoodyear = listGoodyear

async function listGoodyear() {

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        const cardHistory = document.querySelector('[data-card]')
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = " "
        modal.appendChild(View.showModalGoodyear())

        const offices = await Service.listOffice()
        const divoffice = document.getElementById('office')
        offices.forEach(office => {
            divoffice.appendChild(View.listOffice(office))
        });

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Informe Goodyear"
        powerbi.innerHTML = " "
        loading.innerHTML = " "
        cardHistory.style.display = 'none';


        title.appendChild(View.btnNewSearch())

    } catch (error) {

    }
}


window.searchGoodyear = searchGoodyear

async function searchGoodyear(event) {
    event.preventDefault()
    $('#searchGoodyear').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const btn = event.currentTarget
        const datestart = btn.form.datestart.value
        const dateend = btn.form.dateend.value
        const arroffice = document.querySelectorAll('#office option:checked')
        const office = Array.from(arroffice).map(el => `'${el.value}'`);

        const search = {
            datestart: datestart,
            dateend: dateend,
            office: office
        }

        const data = await ServiceItem.listGoodyear(search)
        let dtview = [];
        data.forEach(obj => {
            const field = View.listGoodyear(obj)
            dtview.push(field)
        });

        let title = document.querySelector('[data-title]')
        const text = document.createElement('h5')
        text.style.color = 'gray'
        text.style.fontSize = '1rem'
        text.style.alignContent = 'left'

        text.innerHTML += `<br>Filtros<br>`
        if(office[0].length > 2) text.innerHTML += `<br>Sucursal: ${office}<br>`
        if(datestart && dateend) text.innerHTML += `Curso del Tiempo ${datestart} até ${dateend}<br>`

        title.appendChild(text)

        $(document).ready(function () {
            $("#dataTable").DataTable({
                data: dtview,
                columns: [
                    { title: "Opciones" },
                    { title: "Cod Articulo" },
                    { title: "Nombre" },
                    { title: "Cant Vendida" },
                    { title: "Cant Stock" }
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

        loading.innerHTML = " "
    } catch (error) {
        console.log(error);
        loading.innerHTML = " "
        alert(error)
    }
}
