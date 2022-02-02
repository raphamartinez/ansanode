import { ViewStock } from "../views/stockView.js"
import { Connection } from '../services/connection.js'


const listBi = (powerbis) => {

    let dtview =  powerbis.map(powerbi => {
        return  [
            `
            <a onclick="viewBi(event)" href="" data-title="${powerbi.title}" data-url="${powerbi.url}"><i class="fas fa-eye" style="color:#666600;"></i></a>
            <a data-toggle="modal" data-target="#editpowerbi" onclick="modalEditBi(event)" data-id_powerbi="${powerbi.id_powerbi}" data-title="${powerbi.title}" data-url="${powerbi.url}" data-type="${powerbi.type}"><i class="fas fa-edit" style="color:#32CD32;"></i></a>
            <a data-toggle="modal" data-target="#deletepowerbi" onclick="modalDeleteBi(event)" data-id_powerbi="${powerbi.id_powerbi}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>
            `,
            `${powerbi.title}`,
            `${powerbi.typedesc}`,
            `${powerbi.dateReg}`,
        ]
    });

    $("#powerbi").DataTable({
        data: dtview,
        columns: [
            { title: "Opciones" },
            { title: "Nombre" },
            { title: "Tipo" },
            { title: "Fecha de Registro" }
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
}

const listStock = (stocks) => {

    let dtstock =  stocks.map(stock => {
        return [
            `<a onclick="modalDeleteStock(event)" href="" data-id_stock="${stock.id_stock}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
            `${stock.name}`
        ]
    });

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
}

const init = async () => {
    const doc = document.URL.split("/")

    const powerbis = await Connection.noBody(`powerbis/id_login/${doc[4]}`, 'GET')
    listBi(powerbis)

    const stocks = await Connection.noBody(`stocks/${doc[4]}`, 'GET')
    listStock(stocks)
}

init()

const modalEdit = async (event) => {
    document.querySelector('#officeedit').innerHTML = "";
    
    $("#perfiledit").val(event.target.getAttribute('data-perfil'));

    const offices = await JSON.parse(event.target.getAttribute('data-offices')) 
    const dtoffices = await Connection.noBody('offices', 'GET')

    if (offices.length > 0) {
        dtoffices.forEach(office => {
            let match = offices.find(obj => obj.id_office === office.id_office);

            const line = document.createElement('option');

            if (match) {
                line.selected = true;
            }

            line.value = office.id_office;
            line.innerHTML = office.name;


            document.querySelector('#officeedit').appendChild(line);

        })
    } else {
        dtoffices.forEach(office => {
            const line = document.createElement('option');
            line.value = office.id_office;
            line.innerHTML = office.name;
            document.querySelector('#officeedit').appendChild(line);
        })
    }

    await $('#officeedit').selectpicker("refresh");

    $('#edit').modal('show')
}

document.querySelector('[data-btn-edit]').addEventListener('click',modalEdit, false )


const openEdit = async (event) => {
    const id = event.currentTarget.id

    const { id_login, id_user } = await modalEdit(id)

    document.querySelector('[data-form-edit]').addEventListener('submit', async (eventsubmit) => {
        edit(eventsubmit, id_login, id_user)
    })

    document.querySelector("[data-form-edit]").removeEventListener('click', openEdit, false)
}

window.addModalStock = addModalStock

async function addModalStock(event) {
    try {

        const id_login = event.currentTarget.getAttribute("data-id_login")

        const selectstock = document.getElementById('stockselect')

        const fields = await Connection.noBody('stockandgroup', 'GET')

        fields.stocks.forEach(obj => {
            selectstock.appendChild(ViewStock.listOption(obj.StockDepo))
        });

        $('#stockselect').selectpicker("refresh");
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