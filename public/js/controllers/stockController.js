import { ViewStock } from "../views/stockView.js"
import { Connection } from '../services/connection.js'

window.addModalStock = addModalStock

async function addModalStock(event) {
    try {
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');
        document.querySelector('[data-features]').innerHTML = ""

        modal.innerHTML = ``
        settings.innerHTML = " "
        const btn = event.currentTarget
        const id_login = btn.getAttribute("data-id_login")

        modal.appendChild(ViewStock.modaladd(id_login))

        const selectstock = document.getElementById('stockselect')

        const fields = await Connection.noBody('stockandgroup','GET')

        fields.stocks.forEach(obj => {
            selectstock.appendChild(ViewStock.listOption(obj.StockDepo))
        });

        $('#stockselect').selectpicker();
        $('#addstock').modal('show')

    } catch (error) {
        alert('Algo salió mal, informa al sector de TI')
    }
}

window.addstock = addstock

async function addstock(event) {
    event.preventDefault()
    $('#addstock').modal('hide')

    let loading = document.querySelector('[data-loading]')
loading.style.display = "block";
    try {

        const btn = event.currentTarget
        const id_login = btn.getAttribute("data-id_login")
        const arrstock = document.querySelectorAll('#stockselect option:checked')
        const stock = Array.from(arrstock).map(el => `${el.value}`);

        await Connection.body('stock', { stock, id_login }, 'POST')
       
        const stocks = await Connection.noBody(`stocks/${id_login}`, 'GET')

        let dtstock = [];

        stocks.forEach(obj => {
            const fieldstock = ViewStock.listStock(obj, id_login)
            dtstock.push(fieldstock)
        });

        if ($.fn.DataTable.isDataTable('#stock')) {
            $('#stock').dataTable().fnClearTable();
            $('#stock').dataTable().fnDestroy();
            $('#stock').empty();
        }

        $(document).ready(function () {
            $("#stock").DataTable({
                data: dtstock,
                columns: [
                    { title: "Opciones" },
                    { title: "Depósito" }
                ],
                paging: false,
                ordering: true,
                info: false,
                scrollY: false,
                scrollCollapse: true,
                scrollX: true,
                autoHeight: true,
                pagingType: "numbers",
                searchPanes: false,
                fixedHeader: false,
                searching: false
            })
        })


        loading.style.display = "none"
        alert('Acceso al depósito agregado con éxito!')
    } catch (error) {
        loading.style.display = "none"
        alert('Algo salió mal, informa al sector de TI')
    }
}

window.modalDeleteStock = modalDeleteStock

async function modalDeleteStock(event) {
    event.preventDefault()
    try {
        let modal = document.querySelector('[data-modal]')
        modal.innerHTML = ``


        const btn = event.currentTarget
        const id_stock = btn.getAttribute("data-id_stock")
        const id_login = btn.getAttribute("data-id_login")

        modal.appendChild(ViewStock.modaldelete(id_stock, id_login))

        $('#deletestock').modal('show')
    } catch (error) {
        alert('Algo salió mal, informa al sector de TI')
    }
}



window.deletestock = deletestock

async function deletestock(event) {
    event.preventDefault()
    $('#deletestock').modal('hide')

    let loading = document.querySelector('[data-loading]')
loading.style.display = "block";

    try {

        const form = event.currentTarget
        const id_stock = form.getAttribute("data-id_stock")
        const id_login = form.getAttribute("data-id_login")

        await Connection.noBody(`stock/${id_stock}`, 'DELETE')

        const stocks = await Connection.noBody(`stocks/${id_login}`, 'GET')

        let dtstock = [];

        stocks.forEach(obj => {
            const fieldstock = ViewStock.listStock(obj, id_login)
            dtstock.push(fieldstock)
        });

        if ($.fn.DataTable.isDataTable('#stock')) {
            $('#stock').dataTable().fnClearTable();
            $('#stock').dataTable().fnDestroy();
            $('#stock').empty();
        }


        $(document).ready(function () {
            $("#stock").DataTable({
                data: dtstock,
                columns: [
                    { title: "Opciones" },
                    { title: "Depósito" }
                ],
                paging: false,
                ordering: true,
                info: false,
                scrollY: false,
                scrollCollapse: true,
                scrollX: true,
                autoHeight: true,
                pagingType: "numbers",
                searchPanes: false,
                fixedHeader: false,
                searching: false
            })
        })


        loading.style.display = "none"
        alert('Acceso al depósito eliminado con éxito!')
    } catch (error) {
        loading.style.display = "none"
        alert('Algo salió mal, informa al sector de TI')

    }
}
