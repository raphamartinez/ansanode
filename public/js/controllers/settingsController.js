import { ViewSettings } from "../views/settingsView.js"
import { ServiceHistory } from "../services/historyService.js"

const btn = document.querySelector('[data-management]')

btn.addEventListener('click', async (event) => {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    let title = document.querySelector('[data-title]')
    let powerbi = document.querySelector('[data-powerbi]')
    let modal = document.querySelector('[data-modal]')
    const cardHistory = document.querySelector('[data-card]')

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    title.innerHTML = `Ajustes`
    title.appendChild(ViewSettings.sidebar())
    loading.innerHTML = " "
    cardHistory.style.display = 'none';
    

})
