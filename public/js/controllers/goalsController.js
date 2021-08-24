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
        const listsellers = document.getElementById('listsellers')

        const sellers = await Connection.noBody('sellersgoalline', 'GET')

        sellers.forEach(obj => {
            listsellers.appendChild(View.listSalesman(obj))
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

    try {
        $(".listersaleman").removeClass("active");

        const btn = event.currentTarget
        const id_salesman = btn.getAttribute("data-id_salesman")

        listGoalsLine(id_salesman)

    } catch (error) {

    }
}

window.listGoalsLine = listGoalsLine

async function listGoalsLine(id_salesman) {

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

        const goalsline = await Connection.noBody(`goalsline/${id_salesman}`, 'GET')
        let dtview = [];
        let index = 1
        goalsline.forEach(goal => {
            const field = View.lineaddgoal(goal, index, id_salesman)
            index++
            dtview.push(field)
        });

        const table = $("#tablegoals").DataTable({
            data: dtview,
            columns: [
                { title: "Fecha" },
                { title: "Grupo" },
                { title: "Linea de Productos" },
                { title: "Aplicacion" },
                { title: "Cod Articulo" },
                {
                    title: "Nombre",
                    class: "details-control"
                },
                { title: "Cant" }
            ],
            autoHeight: true,
            responsive: true,
            lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]],
            pagingType: "numbers",
            fixedHeader: true,
            orderCellsTop: true,
            responsive: true,
        })

        $('#tablegoals thead tr').clone(true).appendTo('#tablegoals thead');
        $('#tablegoals thead tr:eq(1) th').each(function (i) {
            var title = $(this).text();
            if (title !== "Cant") {
                if (title === "Fecha de la Meta") {
                    $(this).html('<input type="text" class="form-control form-control-sm" placeholder="Fecha"/>');
                } else {
                    $(this).html('<input type="text" class="form-control form-control-sm" placeholder="Filtrar"/>');
                }
            } else {
                $(this).html('');
            }

            $('input', this).on('keyup change', function () {
                if (table.column(i).search() !== this.value) {
                    var regExSearch = '\\b' + this.value;

                    table
                        .column(i)
                        .search(regExSearch, true, false)
                        .draw();
                }
            });
        });

        $('#tablegoals tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tablegoals tbody').on('click', 'td.details-control', async function (event) {

            let tr = $(this).closest('tr');
            const code = tr[0].childNodes[4].textContent
            let row = table.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                const seller = document.getElementsByClassName("nav-item nav-link has-icon nav-link-faded listersaleman active");

                const office = seller[0].getAttribute("data-office")

                const items = await Connection.body(`itemslabel/${office}`, { code }, "POST")

                row.child(listItemsbyGroup(items)).show();
                tr.addClass('shown');
            }
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
            id_goalline: btn.getAttribute("data-id_goalline"),
            amount: btn.value
        }

        Connection.body(`goal`, { goal }, 'POST')

    }
});

function listItemsbyGroup(items) {

    let table = `<table cellpadding="0" cellspacing="0" border="0" style="">`

    items.forEach(item => {
        let field = `<tr><td>Stock de la Ciudad:<strong> ${item.CityQty}</strong></td><td>Stock Total: <strong>${item.StockQty}</strong></td></tr>`

        table += field
    })

    table += `</table>`

    return table
}

