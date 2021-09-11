import { ViewFinance } from "../views/financeView.js"
import { Connection } from '../services/connection.js'

const btnFinance = document.querySelector('[data-finance]')


btnFinance.addEventListener('click', async (event) => {
    event.preventDefault()

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
        modal.appendChild(ViewFinance.modalsearch())

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Finanzas"
        title.appendChild(ViewFinance.buttonsearchstock())
        powerbi.innerHTML = " "
        loading.innerHTML = " "
        cardHistory.style.display = 'none';


        const selectclients = document.getElementById('selectclients')
        const clients = await Connection.noBody('clients', 'GET')

        clients.forEach(obj => {
            selectclients.appendChild(ViewFinance.listClients(obj))
        });

        const selectoffice = document.getElementById('selectoffice')
        const offices = await Connection.noBody('offices', 'GET')

        offices.forEach(office => {
            if (office.id_office !== 15) selectoffice.appendChild(ViewFinance.listOffice(office))
        });

        document.getElementById("overdueyes").checked = true;
        $('#searchfinance').modal('show')
        loading.innerHTML = ``
    } catch (error) {
        loading.innerHTML = ``
        alert(error)
    }
})

window.listFinance = listFinance

async function listFinance(event) {
    event.preventDefault()

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
        modal.appendChild(ViewFinance.modalsearch())

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        title.innerHTML = "Finanzas"
        title.appendChild(ViewFinance.buttonsearchstock())
        powerbi.innerHTML = " "
        loading.innerHTML = " "
        cardHistory.style.display = 'none';


        const selectclients = document.getElementById('selectclients')
        const clients = await Connection.noBody('clients', 'GET')

        clients.forEach(obj => {
            selectclients.appendChild(ViewFinance.listClients(obj))
        });

        const selectoffice = document.getElementById('selectoffice')
        const offices = await Connection.noBody('offices', 'GET')

        offices.forEach(office => {
            selectoffice.appendChild(ViewFinance.listOffice(office))
        });

        document.getElementById("overdueyes").checked = true;
        $('#searchfinance').modal('show')
        loading.innerHTML = ``
    } catch (error) {
        loading.innerHTML = ``
        alert(error)
    }
}

window.searchFinance = searchFinance

async function searchFinance(event) {
    event.preventDefault()
    $('#searchfinance').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    try {

        const selectclients = document.querySelectorAll('#selectclients option:checked')
        const clients = Array.from(selectclients).map(el => `'${el.value}'`);
        if (clients[0] === "''") clients[0] = "ALL"

        const selectoffice = document.querySelectorAll('#selectoffice option:checked')
        const offices = Array.from(selectoffice).map(el => `'${el.value}'`);
        if (offices[0] === "''") offices[0] = "ALL"

        const overdue = document.querySelector('input[name="overdue"]:checked').value;

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        const data = await Connection.noBody(`finance/${clients}/${offices}/${overdue}`, 'GET')
        let dtview = [];

        data.forEach(obj => {
            const field = ViewFinance.listFinance(obj)
            dtview.push(field)
        });

        const table = $("#dataTable").DataTable({
            data: dtview,
            columns: [
                {
                    title: "Opciones",
                    className: "finance-control"
                },
                { title: "Cod Cliente" },
                { title: "Nombre" },
                {
                    title: "d15",
                    className: "finance-control"
                },
                {
                    title: "d30",
                    className: "finance-control"
                },
                {
                    title: "d60",
                    className: "finance-control"
                },
                {
                    title: "d90",
                    className: "finance-control"
                },
                {
                    title: "d120",
                    className: "finance-control"
                },
                {
                    title: "d120+",
                    className: "finance-control"
                },
                { title: "En Abierto" },
                { title: "TT Vencido" }
            ],
            paging: true,
            ordering: true,
            info: true,
            scrollY: false,
            scrollCollapse: true,
            scrollX: true,
            autoHeight: true,
            lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
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
        })

        $('#dataTable tbody').on('click', 'td.finance-control', async function (event) {

            const btn = event.currentTarget.children[0]

            const client = btn.getAttribute("data-client")
            const date = btn.getAttribute("data-datetype")
            const title = titleFinance(date)

            let tr = $(this).closest('tr');
            let row = table.row(tr);

            const i = event.currentTarget.children[0].children[0]

            if (row.child.isShown()) {
                if (date === "*") {
                    tr[0].classList.remove('bg-info', 'text-white')
                    i.classList.remove('fas', 'fa-angle-up');
                    i.classList.add('fas', 'fa-angle-double-down');
                } else {
                    tr[0].classList.remove('bg-info', 'text-white')
                    i.classList.remove('fas', 'fa-angle-up');
                    i.classList.add('fas', 'fa-angle-down');
                }

                row.child.hide();
                tr.removeClass('shown');

            } else {
                tr[0].classList.add('bg-info', 'text-white')

                if (date === "*") {
                    i.classList.remove('fas', 'fa-angle-double-down');
                } else {
                    i.classList.remove('fas', 'fa-angle-down');
                }

                i.classList.add('spinner-border', 'spinner-border-sm');

                const selectoffice = document.querySelectorAll('#selectoffice option:checked')
                let offices = Array.from(selectoffice).map(el => `'${el.value}'`);
                if (offices[0] === "''") offices[0] = "ALL"

                const invoices = await Connection.noBody(`financeclient/${client}/${date}`, "GET")

                if (invoices.length !== 0) {

                    if ($.fn.DataTable.isDataTable('#datainvoices')) {
                        $('#datainvoices').dataTable().fnClearTable();
                        $('#datainvoices').dataTable().fnDestroy();
                        $('#datainvoices').empty();
                    }

                    let { div, dtview } = viewFinance(title, invoices)

                    row.child(div).show();

                    const tableinv = $("#datainvoices").DataTable({
                        data: dtview,
                        columns: [
                            {
                                title: "Opciones",
                                className: "invoice-control"
                            },
                            { title: "Nr Factura" },
                            { title: "Vendedor" },
                            { title: "Fecha" },
                            { title: "Precio" },
                            { title: "Fecha de Contacto" },
                            { title: "Responsable" },
                            { title: "Contacto" },
                            { title: "Descripción" },
                            { title: "Fecha de Paga" },
                            { title: "Status da Cobranza" }
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
                        searching: false,
                        fixedHeader: false
                    })

                    tr.addClass('shown');

                    i.classList.add('fas', 'fa-angle-up');
                    i.classList.remove('spinner-border', 'spinner-border-sm');

                    $('#datainvoices tbody').on('click', 'a.invoice-control', async function (event) {
                        const btn = event.currentTarget

                        const invoice = btn.getAttribute("data-invoice")
                        const type = btn.getAttribute("data-type")

                        let trchild = $(this).closest('tr');
                        let rowchild = tableinv.row(trchild);

                        const i = event.currentTarget.children[0]
                        const classList = [i.classList[0], i.classList[1]]

                        if (rowchild.child.isShown()) {

                            switch (type) {
                                case "0":
                                    trchild[0].classList.remove('bg-primary', 'text-white')
                                    i.classList.remove(classList[0], classList[1]);
                                    i.classList.add("fas", "fa-copy");

                                    break
                                case "1":
                                    trchild[0].classList.remove('bg-primary', 'text-white')
                                    i.classList.remove(classList[0], classList[1]);
                                    i.classList.add("fas", "fa-list-ol");

                                    break
                                case "2":
                                    trchild[0].classList.remove('bg-primary', 'text-white')
                                    i.classList.remove(classList[0], classList[1]);
                                    i.classList.add("fas", "fa-th-large");

                                    break
                            }

                            rowchild.child.hide();
                            trchild.removeClass('shown');

                        } else {
                            switch (type) {
                                case "0":
                                    // i.classList.remove(classList[0], classList[1]);
                                    btn.previousElementSibling.children[0].removeAttribute("hidden")
                                    btn.previousElementSibling.children[0].type = "checkbox"

                                    //colocar radio button aqui

                                    break
                                case "1":
                                    trchild[0].classList.add('bg-primary', 'text-white')
                                    i.classList.remove(classList[0], classList[1]);
                                    i.classList.add('spinner-border', 'spinner-border-sm');

                                    const historys = await Connection.noBody(`financehistory/${invoice}`, "GET")
                                    if (historys.length > 0) {
                                        rowchild.child(viewFinanceHistory(historys)).show();
                                        trchild.addClass('shown');
                                    } else {
                                        trchild[0].classList.remove('bg-primary', 'text-white')
                                        alert('No hay historial de cobranza para esta factura.')
                                    }


                                    i.classList.remove('spinner-border', 'spinner-border-sm');
                                    i.classList.add(classList[0], classList[1]);

                                    break
                                case "2":
                                    trchild[0].classList.add('bg-primary', 'text-white')
                                    i.classList.remove(classList[0], classList[1]);
                                    i.classList.add('spinner-border', 'spinner-border-sm');

                                    const items = await Connection.noBody(`invoiceitems/${invoice}`, "GET")
                                    rowchild.child(viewItems(items)).show();
                                    trchild.addClass('shown');

                                    i.classList.remove('spinner-border', 'spinner-border-sm');
                                    i.classList.add(classList[0], classList[1]);
                                    break
                            }
                        }
                    })
                } else {
                    alert('No hay facturas en este período para mostrar')
                    i.classList.remove('spinner-border');

                    if (date === "*") {
                        tr[0].classList.remove('bg-info', 'text-white')
                        i.classList.remove('fas', 'fa-angle-up');
                        i.classList.add('fas', 'fa-angle-double-down');
                    } else {
                        tr[0].classList.remove('bg-info', 'text-white')
                        i.classList.remove('fas', 'fa-angle-up');
                        i.classList.add('fas', 'fa-angle-down');
                    }
                }
            }
        });

        loading.innerHTML = " "
    } catch (error) {
        loading.innerHTML = " "
        alert(error)
    }
}

function titleFinance(date) {

    let title = ""
    let lastday = new Date()
    let day = new Date()

    switch (date) {
        case "*":
            title += `Listado de todas las facturas vencidas`

            break;
        case "15":
            lastday.setDate(lastday.getDate() - 15)
            day.setDate(day.getDate())

            title += `Facturas entre ${lastday.getDate()}/${lastday.getMonth() + 1}/${lastday.getFullYear()} e ${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()} vencidas`

            break;
        case "30":
            lastday.setDate(lastday.getDate() - 30);
            day.setDate(day.getDate() - 16);

            title += `Facturas entre ${lastday.getDate()}/${lastday.getMonth() + 1}/${lastday.getFullYear()} e ${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()} vencidas`

            break;
        case "60":
            lastday.setDate(lastday.getDate() - 60);
            day.setDate(day.getDate() - 31);

            title += `Facturas entre ${lastday.getDate()}/${lastday.getMonth() + 1}/${lastday.getFullYear()} e ${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()} vencidas`

            break;
        case "90":
            lastday.setDate(lastday.getDate() - 90);
            day.setDate(day.getDate() - 61);

            title += `Facturas entre ${lastday.getDate()}/${lastday.getMonth() + 1}/${lastday.getFullYear()} e ${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()} vencidas`

            break;
        case "120":
            lastday.setDate(lastday.getDate() - 120);
            day.setDate(day.getDate() - 91);

            title += `Facturas entre ${lastday.getDate()}/${lastday.getMonth() + 1}/${lastday.getFullYear()} e ${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()} vencidas`

            break;
        case "120+":
            title += `Facturas con más de 120 días de vencimiento`

            break;
        default:
            title += `Listado de todas las facturas vencidas`

            break;
    }

    return title
}

$(document).on('keypress', '.finance', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var $next = $('[tabIndex=' + (+this.tabIndex + 1) + ']');

        if (!$next.length) {
            $next = $('[tabIndex=1]');
        }

        $next.focus();

        const btn = e.currentTarget

        const finance = {
            invoicenr: btn.getAttribute("data-sernr"),
            type: btn.getAttribute("data-type"),
            value: btn.value
        }

        Connection.body(`finance`, { finance }, 'POST')

    }
});


function viewFinance(title, invoices) {

    let div = `<div class="container-fluid"><div class="card card-shadow"><h3><strong>${title}</strong></h3><div class="form-row"><div class="form-group col-md-12 text-center">
    <table id="datainvoices" style="background-color: rgba(90, 159, 236, .1); padding-top: 0.3rem;" class="table text-center table-hover table-bordered" cellpadding="0" cellspacing="0" border="0">
    </table></div></div></div></div>`

    let dtview = []
    let index = 1

    invoices.forEach(invoice => {

        let td = [
            `<div class="form-check"><input class="form-check-input" type="hidden" value=""></div>
             <a data-type="0" class="invoice-control" data-invoice="${invoice.SerNr}"><i style="color: #32CD32;" class="fas fa-copy"></i></a>
             <a data-type="1" class="invoice-control" data-invoice="${invoice.SerNr}"><i class="fas fa-list-ol"></i></a>
             <a data-type="2" class="invoice-control" data-invoice="${invoice.SerNr}"><i style="color: #8B4513;" class="fas fa-th-large"></i></a>`,
            `<strong>${invoice.SerNr}</strong>`,
            `<strong>${invoice.SalesMan}</strong>`,
            `${invoice.date}`,
            `${invoice.amount}`,
            `<input tabindex="${index}" data-SerNr="${invoice.SerNr}" value="${invoice.contactdate}" data-type="contactdate" class="form-control finance datepicker" type="datetime-local" name="contactdate" id="contactdate">`,
            `<input tabindex="${index + 1}" data-SerNr="${invoice.SerNr}" value="${invoice.responsible}" data-type="responsible" class="form-control finance" type="text" name="responsible" id="responsible">`,
            `<input tabindex="${index + 2}" data-SerNr="${invoice.SerNr}" value="${invoice.contact}" data-type="contact" class="form-control finance" type="text" name="contact" id="contact">`,
            `<textarea tabindex="${index + 3}" data-SerNr="${invoice.SerNr}" data-type="comment" class="form-control finance" type="text" name="comment" id="comment">${invoice.comment}</textarea>`,
            `<input tabindex="${index + 4}" data-SerNr="${invoice.SerNr}" value="${invoice.payday}" data-type="payday" class="form-control finance datepicker" type="date" name="payday" id="payday">`,
            `<select tabindex="${index + 5}" data-SerNr="${invoice.SerNr}" value="${invoice.status}" data-type="status" class="form-control finance" name="status" id="status">
            <option value="${invoice.status}" disabled selected>${invoice.statusdesc}</option>    
            <option value="0">Pendiente</option>
                <option value="1">Pago cuestionado</option>
                <option value="2">Pago pronto</option>
                <option value="3">Pago rechazado</option>
                <option value="4">Reenviar al gerente</option>
             </select>`
        ]
        index += 6

        dtview.push(td)
    })


    return { div, dtview }
}

function viewItems(items) {

    let div = `<div class="container-fluid"><div class="form-row">`

    let table = `<div class="form-group col-md-12">
    <table id="datainvoices" class="table text-center table-hover table-bordered" cellpadding="0" cellspacing="0" border="0">
    <tr class="bg-primary text-white">
        <th scope="col">Cod Artículo</th>
        <th scope="col">Nombre</th>
        <th scope="col">Etiqueta</th>
        <th scope="col">Cant</th>
        <th scope="col">Precio Unitario</th>
        <th scope="col">Precio Total s/ IVA</th>
    </tr>`

    items.forEach(item => {
        let td = `
        <tr>
        <td><strong>${item.code}</strong></td>
        <td>${item.name}</td>
        <td>${item.label}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.priceamount}</td>
        </tr>`
        table += td
    })

    table += `</table></div></div></div></div>`
    div += table

    return div
}

function viewFinanceHistory(historys) {

    let div = `<div class="container-fluid"><div class="form-row"><div class="form-group col-md-1"></div>`

    let table = `<div class="form-group col-md-10">
    <table id="datainvoices" class="table text-center table-hover table-bordered" cellpadding="0" cellspacing="0" border="0">
    <tr class="bg-info text-white">
    <th scope="col">Fecha de Contacto</th>
    <th scope="col">Responsable</th>
    <th scope="col">Contacto</th>
    <th scope="col">Descripción</th>
    <th scope="col">Fecha de Paga</th>
    <th scope="col">Status</th>
    <th scope="col">Fecha de Registro</th>
    </tr>`

    historys.forEach(history => {
        let td = `
        <tr>
        <td>${history.contactdate}</td>
        <td>${history.responsible}</td>
        <td>${history.contact}</td>
        <td>${history.comment}</td>
        <td>${history.payday}</td>
        <td>${history.statusdesc}</td>
        <td>${history.datereg}</td>
        </tr>`
        table += td
    })

    table += `</table></div><div class="form-group col-md-1"></div></div></div></div>`
    div += table

    return div
}