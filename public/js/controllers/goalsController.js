// import { View } from "../views/goalsView.js"
import { Connection } from '../services/connection.js'

window.listGoals = listGoals

async function listGoals() {

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
        let settings = document.querySelector('[data-settings]');

        settings.innerHTML = ''
        modal.innerHTML = " "
        cardHistory.style.display = 'none';

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Metas por Artículo"
        // View.buttonsearchstock(title)

        // powerbi.innerHTML = " "
        // loading.innerHTML = " "
        // cardHistory.style.display = 'none';


        // const selectstock = document.getElementById('stock')
        // const selectitemgroup = document.getElementById('itemgroup')
        // const fields = await Connection.noBody('sellers', 'GET')

        // fields.stocks.forEach(obj => {
        //     selectstock.appendChild(View.listOption(obj.StockDepo))
        // });

        // fields.groups.forEach(obj => {
        //     selectitemgroup.appendChild(View.listOption(obj.Name))
        // });

        // document.getElementById("stockartsi").checked = true;

        // const items = await Connection.noBody('itemscomplete', 'GET')

        // autocompletecod(document.getElementById("artcode"), items);
        // autocompletename(document.getElementById("itemname"), items);

    } catch (error) {

    }
}
