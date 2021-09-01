import { View } from "../views/goalsView.js"
import { Connection } from '../services/connection.js'

window.listGoals = listGoals

async function listGoals() {

    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        const cardHistory = document.querySelector('[data-card]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');

        settings.innerHTML = ''
        modal.innerHTML = " "
        powerbi.innerHTML = " "
        cardHistory.style.display = 'none';

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Metas"

        settings.appendChild(View.opcionesGoals())

        let goals = await Connection.noBody('sellersdashboard', 'GET')
        
        settings.appendChild(View.showGoals())

        const goalsshow = document.getElementById('goalsshow')

        goals.forEach(goal => {
            goalsshow.appendChild(View.sellers(goal))
        })

    } catch (error) {

    }
}


window.addGoalsList = addGoalsList

async function addGoalsList() {

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
        let settings = document.querySelector('[data-settings]')

        settings.innerHTML = ''
        powerbi.innerHTML = " "
        modal.innerHTML = " "
        settings.appendChild(View.addGoals())
        modal.appendChild(View.modalAdd())


        const listsellers = document.getElementById('listsellers')
        const listgroups = document.getElementById('listgroups')

        const sellers = await Connection.noBody('sellersgoalline', 'GET')

        const itemsgroups = await Connection.noBody('itemsgroups', 'GET')

        sellers.forEach(obj => {
            listsellers.appendChild(View.listSalesman(obj))
        })

        itemsgroups.forEach(obj => {
            listgroups.appendChild(View.listGroups(obj))
        })


        if ($.fn.DataTable.isDataTable('#tablegoals')) {
            $('#tablegoals').dataTable().fnClearTable();
            $('#tablegoals').dataTable().fnDestroy();
            $('#tablegoals').empty();
        }

        title.innerHTML = "Fijar Metas"
        powerbi.innerHTML = " "
        loading.innerHTML = " "
        cardHistory.style.display = 'none';
    } catch (error) {

    }
}

window.listGoalsSalesman = listGoalsSalesman

async function listGoalsSalesman(event) {
    event.preventDefault()
    const info = document.getElementById('info')

    try {
        $('#searchGoal').modal('hide')


        const listgroups = document.getElementById('listgroups')
        const group = listgroups.options[listgroups.selectedIndex].value;

        const listsellers = document.getElementById('listsellers')
        const salesman = JSON.parse(listsellers.options[listsellers.selectedIndex].value);

        const stock = document.querySelector('input[name="stock"]:checked').value;

        if (salesman && group && stock) {
            info.innerHTML = ``
            listGoalsLine(salesman, group, stock)
        } else {
            alert('Seleccione todos los campos!')
        }
    } catch (error) {

    }
}

window.listGoalsLine = listGoalsLine

async function listGoalsLine(salesman, group, stock) {

    if ($.fn.DataTable.isDataTable('#tablegoals')) {
        $('#tablegoals').dataTable().fnClearTable();
        $('#tablegoals').dataTable().fnDestroy();
        $('#tablegoals').empty();
    }

    const loadinggoals = document.getElementById('loadinggoals')
    loadinggoals.innerHTML = `<div class="spinner-border text-primary" role="status">
    <span class="sr-only">Loading...</span>
  </div>`
    try {

        const goalsline = await Connection.noBody(`goalsline/${salesman.id_salesman}/${salesman.office}/${group}/${stock}`, 'GET')

        if ($.fn.DataTable.isDataTable('#tablegoals')) {
            $('#tablegoals').dataTable().fnClearTable();
            $('#tablegoals').dataTable().fnDestroy();
            $('#tablegoals').empty();
        }

        let dtview = [];
        let index = 1
        goalsline.forEach(goal => {
            const field = View.lineaddgoal(goal, index, salesman.id_salesman)
            index += 12
            dtview.push(field)
        });

        const dates = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12
        ]

        let datecolumn = []

        dates.forEach(date => {
            const today = new Date()

            let month = today.getMonth() + date
            let year = today.getFullYear()

            if (month > 12) {
                month -= 12
                year += 1
            }

            if (month <= 9) {
                month = `0${month}`
            }

            const now = `${month}/${year}`
            datecolumn.push(now)
        })

        const table = $("#tablegoals").DataTable({
            data: dtview,
            columns: [
                { title: "Linea de Productos" },
                { title: "Aplicacion" },
                {
                    title: "Cod Articulo",
                    className: "details-control",
                },
                { title: "Nombre" },
                {
                    title: "Stock Ci",
                    className: "datatable-grey",
                },
                {
                    title: "Stock TT",
                    className: "datatable-grey",
                },
                { title: datecolumn[0] },
                { title: datecolumn[1] },
                { title: datecolumn[2] },
                { title: datecolumn[3] },
                { title: datecolumn[4] },
                { title: datecolumn[5] },
                { title: datecolumn[6] },
                { title: datecolumn[7] },
                { title: datecolumn[8] },
                { title: datecolumn[9] },
                { title: datecolumn[10] },
                { title: datecolumn[11] }
            ],
            paging: true,
            ordering: false,
            info: true,
            scrollY: false,
            scrollCollapse: true,
            scrollX: true,
            autoWidth: true,
            lengthMenu: [[200, 300, 400, 500], [200, 300, 400, 500]],
            pagingType: "numbers",
            fixedHeader: false,
            order: false
        })

        $('#tablegoals').excelTableFilter();

        $('#tablegoals tbody').on('click', 'td.details-control', async function (event) {

            const artcode = event.currentTarget.textContent
            let tr = $(this).closest('tr');
            let row = table.row(tr);

            const i = event.currentTarget.children[0].children[0]

            i.classList.remove('fas', 'fa-shopping-cart');
            i.classList.add('spinner-border');

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                const listsellers = document.getElementById('listsellers')
                const salesman = JSON.parse(listsellers.options[listsellers.selectedIndex].value);

                const sales = await Connection.noBody(`sale/${salesman.id_salesman}/${artcode}`, "GET")

                row.child(listSales(sales)).show();
                tr.addClass('shown');
            }
            i.classList.add('fas', 'fa-shopping-cart');
            i.classList.remove('spinner-border');

        });

        loadinggoals.innerHTML = ``
    } catch (error) {
        loadinggoals.innerHTML = ``
    }
}


$(document).on('keypress', '.goal', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var $next = $('[tabIndex=' + (+this.tabIndex + 1) + ']');

        if (!$next.length) {
            $next = $('[tabIndex=1]');
        }

        $next.focus();

        const btn = e.currentTarget
        const goal = {
            id_salesman: btn.getAttribute("data-id_salesman"),
            itemcode: btn.getAttribute("data-itemcode"),
            date: btn.getAttribute("data-date"),
            amount: btn.value
        }
        Connection.body(`goal`, { goal }, 'POST')

    }
});


function listSales(sale) {

    let table = `<h5 class="text-center"><strong>Ventas</strong></h5><table class="table text-center" cellpadding="0" cellspacing="0" border="0" style="">`

    let field = `<tr style=" color: #495057;background-color:#e9ecef;"><td>Mes:<strong> ${sale.month1}</strong></td><td>Cant Ventas: <strong>${sale.goal1}</strong></td></tr>
        <tr style="color: #495057;background-color:#e9ecef;"><td>Mes:<strong> ${sale.month2}</strong></td><td>Cant de Ventas: <strong>${sale.goal2}</strong></td></tr>
        <tr style="color: #495057;background-color:#e9ecef;"><td>Mes:<strong> ${sale.month3}</strong></td><td>Cant Ventas: <strong>${sale.goal3}</strong></td></tr>`

    table += field

    table += `</table>`

    return table
}


$('#tablegoals tbody').on('click', 'dropdown-filter-item', async function (event) {

    let tr = $(this).closest('tr');
    let row = table.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
    }
});