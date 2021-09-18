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

        const expectedsshow = document.getElementById('expectedsshow')

        let expecteds = await Connection.noBody('expectedsellers', 'GET')

        expecteds.forEach(expected => {
            expectedsshow.appendChild(View.expecteds(expected))
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

window.addGoalsListExcel = addGoalsListExcel

async function addGoalsListExcel() {

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
        settings.appendChild(View.addGoalsExcel())
        modal.appendChild(View.modalAddExcel())
        modal.appendChild(View.modalUploadExcel())

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

        title.innerHTML = "Fijar Metas con Excel"
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

window.listGoalsExcel = listGoalsExcel

async function listGoalsExcel(event) {
    event.preventDefault()

    try {
        $('#searchGoal').modal('hide')


        const arrgroups = document.querySelectorAll('#listgroups option:checked')
        const groups = Array.from(arrgroups).map(el => `'${el.value}'`);

        const listsellers = document.getElementById('listsellers')
        const salesman = JSON.parse(listsellers.options[listsellers.selectedIndex].value);

        if (salesman && groups != "''") {
            generateExcelGoals(salesman, groups)
        } else {
            alert('Seleccione todos los campos!')
        }
    } catch (error) {
        alert('Seleccione todos los campos!')
    }
}

window.generateExcelGoals = generateExcelGoals

async function generateExcelGoals(salesman, groups) {

    const loadinggoals = document.getElementById('loadinggoals')
    loadinggoals.innerHTML = `<div class="spinner-border text-primary" role="status">
    <span class="sr-only">Loading...</span>
  </div>`

    try {
        const xls = await Connection.backFile(`goalslineexcel/${salesman.id_salesman}/${groups}`, 'GET')

        const filexls = await xls.blob();

        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(filexls);
        a.target = "_blank";
        a.download = "meta.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        loadinggoals.innerHTML = ``
    } catch (error) {
        alert("Error en la generación del excel de meta, por favor contacte o T.I.")
        loadinggoals.innerHTML = ``
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

window.listExpectedSalesmanId = listExpectedSalesmanId

async function listExpectedSalesmanId(event) {

    let isExpanded = event.currentTarget.children

    if (isExpanded.length === 1) {

        const card = event.currentTarget
        const id_salesman = card.getAttribute("data-id_salesman")

        let expecteds = await Connection.noBody(`goalexpected/${id_salesman}`, 'GET')

        let div = document.createElement('div');
        div.className = "collapse col-md-12 sellerexpected"

        await expecteds.forEach(expected => {
            div.appendChild(View.expectedsMonth(expected))
        })

        card.appendChild(div)

        $('.sellerexpected').collapse()
    } else {

        let btn = event.currentTarget
        const type = btn.getAttribute("data-type")

        if (type === "1") {
            $('.sellerexpected').collapse('hide')

            event.currentTarget.children[1].remove()
        }
    }
}

window.listExpectedSalesmanMonth = listExpectedSalesmanMonth

async function listExpectedSalesmanMonth(event) {

    let isExpanded = event.currentTarget.children

    if (isExpanded.length === 1) {

        const card = event.currentTarget
        const id_salesman = card.getAttribute("data-id_salesman")
        const date = card.getAttribute("data-date")

        let expecteds = await Connection.noBody(`goalexpectedmonth/${id_salesman}/${date}`, 'GET')

        let div = document.createElement('div');
        div.className = "col-md-12 sellerexpectedmonth"

        await expecteds.forEach(expected => {
            div.appendChild(View.expectedsGroups(expected))
        })

        card.appendChild(div)

        $('.sellerexpectedmonth').collapse()
    } else {
        $('.sellerexpectedmonth').collapse('hide')

        event.currentTarget.children[1].remove()
    }
}

window.inputFile = inputFile

function inputFile() {
    var fileName = document.getElementById('file').files[0].name;
    if (fileName.split('.').pop() === "xlsx") {
        document.getElementById('filename').innerHTML = fileName
    } else {
        document.getElementById('file').value = "";
        document.getElementById('filename').innerHTML = "Buscar archivo..."
        alert("El archivo insertado no es un Excel válido")
    }
}

window.uploadGoals = uploadGoals

async function uploadGoals(event) {
    event.preventDefault()
    $('#uploadGoals').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {
        const btn = event.currentTarget

        const file = btn.form.file.files[0]

        const formData = new FormData()

        formData.append('file', file)

        const obj = await Connection.bodyMultipart('goalexcel', formData, 'POST')
        console.log(obj);

        loading.innerHTML = ``
    } catch (error) {
        alert(error)
        loading.innerHTML = ``
    }
}
