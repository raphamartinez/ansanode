import { ViewSettings } from "../views/settingsView.js"

const btn = document.querySelector('[data-management]')

btn.addEventListener('click', async (event) => {

    let title = document.querySelector('[data-title]')
    let powerbi = document.querySelector('[data-powerbi]')
    let modal = document.querySelector('[data-modal]')
    let content = document.getElementById('content');
    const cardHistory = document.querySelector('[data-card]')

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    title.innerHTML = ``
    powerbi.innerHTML = " "
    content.innerHTML = " "
    modal.innerHTML = ""
    content.prepend(ViewSettings.sidebar())
    cardHistory.style.display = 'none';
    

})
