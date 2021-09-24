import { ViewSettings } from "../views/settingsView.js"


const btn = document.querySelector('[data-management]')

btn.addEventListener('click', async (event) => {

    let title = document.querySelector('[data-title]')
    let powerbi = document.querySelector('[data-powerbi]')
    let modal = document.querySelector('[data-modal]')
    let settings = document.querySelector('[data-settings]');
    const cardHistory = document.querySelector('[data-card]')

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    title.innerHTML = " "
    powerbi.innerHTML = " "
    settings.innerHTML = " "
    modal.innerHTML = ""
    settings.prepend(ViewSettings.sidebar())
    cardHistory.style.display = 'none';

    let user = JSON.parse(sessionStorage.getItem('user'))

    if (user.perfil !== 1) {

        let configSalesman = document.querySelector('[data-config-salesman]')
        configSalesman.innerHTML = ``

    }

    if ($.fn.DataTable.isDataTable('#tabletypearchive')) {
        $('#tabletypearchive').dataTable().fnClearTable();
        $('#tabletypearchive').dataTable().fnDestroy();
        $('#tabletypearchive').empty();
    }

    $("#tabletypearchive").DataTable({
        data: null,
        columns: [
            { title: "Tipo" }
        ],
        info: false,
        paging: false,
        searchPanes: false,
        pagingType: "numbers",
        fixedHeader: true,
        orderCellsTop: true,
        responsive: true,
        searching: false
    })

})
