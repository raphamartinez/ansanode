// import { ViewFinance } from "../views/financeView.js"
import { Connection } from '../services/connection.js'

const detail = (details) => {
    document.querySelector(`[data-view-status-0]`).innerHTML = 0
    document.querySelector(`[data-view-status-1]`).innerHTML = 0
    document.querySelector(`[data-view-status-2]`).innerHTML = 0
    document.querySelector(`[data-view-status-3]`).innerHTML = 0
    document.querySelector(`[data-view-status-4]`).innerHTML = 0

    details.forEach(dtt => {
        let overdue = dtt.AmountBalance
        let due = dtt.AmountOpen

        if (dtt.status == 2) {
            let now = new Date()
            let payday = new Date(dtt.payday)

            if (now.getTime() < payday.getTime()) {
                let div = document.querySelector(`[data-view-status-3]`);

                let now = parseFloat(div.innerHTML)

                div.innerHTML = due + now
            } else {
                let div = document.querySelector(`[data-view-status-4]`);

                let now = parseFloat(div.innerHTML)

                div.innerHTML = overdue + now
            }

        } else {
            if(!dtt.status || dtt.status == 0){
                let div = document.querySelector(`[data-view-status-0]`);

                let now = parseFloat(div.innerHTML)
    
                div.innerHTML = overdue + now
            }else{
                let div = document.querySelector(`[data-view-status-${dtt.status}]`);

                let now = parseFloat(div.innerHTML)
    
                div.innerHTML = overdue + due + now
            }
        }
    })

    document.querySelector(`[data-view-status-0]`).innerHTML = parseFloat(document.querySelector(`[data-view-status-0]`).innerHTML).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.querySelector(`[data-view-status-1]`).innerHTML = parseFloat(document.querySelector(`[data-view-status-1]`).innerHTML).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.querySelector(`[data-view-status-2]`).innerHTML = parseFloat(document.querySelector(`[data-view-status-2]`).innerHTML).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.querySelector(`[data-view-status-3]`).innerHTML = parseFloat(document.querySelector(`[data-view-status-3]`).innerHTML).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.querySelector(`[data-view-status-4]`).innerHTML = parseFloat(document.querySelector(`[data-view-status-4]`).innerHTML).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const chart = (graph) => {

    const dtabel = graph.map(obj => {
        return obj.date
    });

    const dtvalue = graph.map(obj => {
        return parseFloat(obj.contact)
    });

    const data = {
        labels: dtabel,
        datasets: [{
            label: `Historial de contactos por dia`,
            data: dtvalue,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.2
        }]
    };

    const ctx = document.querySelector('[data-chart]')

    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            legend: {
                labels: {
                    fontColor: "#000",
                    fontSize: 18,
                    fontStyle: "bold"
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    pointLabels: {
                        font: {
                            size: 15,
                            color: "#000",
                            style: "bold"
                        }
                    }
                }
            }
        }
    });


    const changeGraph = async () => {
        let office = document.querySelector('[data-filter-office]').value;
        let user = document.querySelector('[data-filter-user]').value;

        const obj = await Connection.noBody(`finance/graph/${office}/${user}`, 'GET')

        detail(obj.details, obj.amountPending)

        const newValue = obj.graphs.map(obj => {
            return parseFloat(obj.contact)
        });

        const newLabel = obj.graphs.map(obj => {
            return obj.date
        });

        chart.data.datasets[0].data = newValue
        chart.data.labels = newLabel
        chart.update();
    }

    const divOffice = document.querySelector('[data-filter-office]')
    const divUser = document.querySelector('[data-filter-user]')

    if (divUser && divOffice) {
        divOffice.addEventListener('change', changeGraph, false)
        divUser.addEventListener('change', changeGraph, false)
    }
}

const list = async (dtview) => {

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

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
                        { title: "Status da Cobranza" },
                        { title: "Guardar contacto" }
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
                                let currentLine = $(this).closest('tr');
                                const tablecopy = event.currentTarget.parentNode.parentNode.parentNode
                                if (currentLine[0].classList[1] !== "copy") {
                                    currentLine[0].classList.add('copy');
                                } else {
                                    currentLine[0].style = "background-color: #fff;"
                                    currentLine[0].classList.remove('copy');
                                }

                                for (let index = 0; index < tablecopy.children.length; index++) {
                                    const element = tablecopy.children[index];
                                    if (element.classList[1] !== "copy") {
                                        const cell = element.children[0]

                                        let a1 = cell.children[1]
                                        let a2 = cell.children[2]
                                        let a3 = cell.children[3]

                                        if (a1.previousElementSibling.children[0].type === "hidden" && a1.children[0].classList[1] !== "fa-save") {
                                            a1.previousElementSibling.children[0].removeAttribute("hidden")
                                            a1.previousElementSibling.children[0].type = "checkbox"
                                            a1.style = "display:none;"
                                            a2.style = "display:none;"
                                            a3.style = "display:none;"
                                        } else {
                                            a1.previousElementSibling.children[0].removeAttribute("checkbox")
                                            a1.previousElementSibling.children[0].type = "hidden"
                                            a1.children[0].classList.remove("fa-save");
                                            a1.children[0].classList.add("fa-copy");
                                            a1.style = "display:inline;"
                                            a2.style = "display:inline;"
                                            a3.style = "display:inline;"
                                        }
                                    } else {
                                        currentLine[0].style = "background-color: #caffc9;"
                                        const cell = element.children[0]
                                        let a1 = cell.children[1]
                                        let a2 = cell.children[2]
                                        let a3 = cell.children[3]
                                        a1.previousElementSibling.children[0].removeAttribute("hidden")
                                        a1.previousElementSibling.children[0].type = "checkbox"
                                        a1.children[0].classList.add("fa-save");
                                        a1.children[0].classList.remove("fa-copy");
                                        a2.style = "display:none;"
                                        a3.style = "display:none;"
                                    }
                                }

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
}

const init = async () => {

    const clients = await Connection.noBody('clients', 'GET')
    let dtview = clients.map(client => {
        return {
            label: client.CustName,
            value: `${client.CustCode}`
        }
    })

    new SelectPure(".select-pure", {
        options: dtview,
        multiple: true,
        autocomplete: true,
        icon: "fa fa-times",
        inlineIcon: false,
        placeholder: false
    });

    document.querySelector('.select-pure__placeholder').innerHTML = "Clientes"

    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const option = document.createElement('option')
        option.value = office.code
        option.innerHTML = office.name

        if (office.id_office !== 15) document.getElementById('selectoffice').appendChild(option)

        const option2 = document.createElement('option')
        option2.value = `'${office.code}'`
        option2.innerHTML = office.name

        if (office.id_office !== 15 && document.querySelector('[data-filter-office]')) document.querySelector('[data-filter-office]').appendChild(option2)
    });

    if (document.querySelector('[data-filter-user]')) {
        const users = await Connection.noBody('users/6', 'GET')

        users.forEach(user => {
            const option = document.createElement('option')
            option.value = `'${user.id_login}'`
            option.innerHTML = user.name
            document.querySelector('[data-filter-user]').appendChild(option)
        })
    }

    document.getElementById("overdueyes").checked = true;
    $('#selectoffice').selectpicker("refresh");

    $("#tableHistory").DataTable({
        data: [],
        columns: [
            { title: "Cliente" },
            { title: "Vencido USD" },
            { title: "Total Cobrado" },

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

    let dt = []
    list(dt)

    const obj = await Connection.noBody('finance/graph', 'GET')

    chart(obj.graphs)
    if (obj.details.length > 0) detail(obj.details, obj.amountPending)
}

init()

const search = async (event) => {
    event.preventDefault()
    try {

        const selectclients = document.querySelectorAll('.select-pure__option--selected')
        const clients = Array.from(selectclients).map(el => `'${el.getAttribute('data-value')}'`);
        if (clients.length === 0) clients[0] = "ALL"

        let offices
        let selectoffice = document.querySelectorAll('#selectoffice option:checked')
        offices = Array.from(selectoffice).map(el => `'${el.value}'`);

        if (offices.length === 0) {
            let selectofficedefault = document.querySelectorAll('#selectoffice option')
            offices = Array.from(selectofficedefault).map(el => `'${el.value}'`);
        }

        const overdue = document.querySelector('input[name="overdue"]:checked').value;
        const type = document.querySelector('input[name="type"]:checked').value;

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        const data = await Connection.noBody(`finance/${clients}/${offices}/${overdue}/${type}`, 'GET')

        document.querySelector('[data-view-client]').innerHTML = data.length

        const invoices = data.reduce((a, b) => a + b.invoices, 0)
        document.querySelector('[data-view-invoice]').innerHTML = invoices

        const due = data.reduce((a, b) => a + b.AmountOpen, 0)
        document.querySelector('[data-view-due]').innerHTML = due.toLocaleString('us')

        const odue = data.reduce((a, b) => a + b.AmountBalance, 0)
        document.querySelector('[data-view-overdue]').innerHTML = odue.toLocaleString('us')


        let dtview = data.map(obj => {
            return [
                `<a data-toggle="popover" title="Ver todas las facturas vencidas" data-datetype="*" data-client="${obj.CustCode}"><i class="fas fa-angle-double-down" style="color:#cbccce;"></i></a>`,
                obj.CustCode,
                obj.CustName,
                `<a data-toggle="popover" title="Ver facturas vencidas 15 días" data-datetype="15" data-client="${obj.CustCode}">${obj.d15}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 16 a 30 días" data-datetype="30" data-client="${obj.CustCode}">${obj.d30}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 31 a 60 días" data-datetype="60" data-client="${obj.CustCode}">${obj.d60}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 61 a 90 días" data-datetype="90" data-client="${obj.CustCode}">${obj.d90}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 91 a 120 días" data-datetype="120" data-client="${obj.CustCode}">${obj.d120}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas por más de 120 días" data-datetype="120+" data-client="${obj.CustCode}">${obj.d120more}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                obj.AmountOpen,
                obj.AmountBalance,
            ]
        });

        list(dtview)

    } catch (error) {

    }
}

document.querySelector('[data-form-search]').addEventListener('submit', search, false)

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
        var $next = $('[tabIndex=' + (+ this.tabIndex + 1) + ']');

        if (!$next.length) {
            $next = $('[tabIndex=1]');
        }

        $next.focus();
    }
});


$(document).on('keyup', '.finance', function (e) {

    const tr = e.currentTarget.parentElement.parentElement

    const contactdate = tr.children[5].children[0].value.length
    const responsible = tr.children[6].children[0].value.length
    const contact = tr.children[7].children[0].value.length
    const desc = tr.children[8].children[0].value.length

    if (contactdate > 0 && responsible > 0 && contact > 0 && desc > 0) {
        tr.children[11].children[0].disabled = false
    } else {
        tr.children[11].children[0].disabled = true
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
            `<div class="form-check" style="display: inline;"><input onclick="copyLineFinance(event)" class="form-check-input" type="hidden" value=""></div>
             <a data-toggle="popover" title="Copiar contacto a otras facturas" data-type="0" class="invoice-control" data-invoice="${invoice.SerNr}"><i style="color: #32CD32;" class="fas fa-copy"></i></a>
             <a data-toggle="popover" title="Ver historial de contactos" data-type="1" class="invoice-control" data-invoice="${invoice.SerNr}"><i class="fas fa-list-ol"></i></a>
             <a data-toggle="popover" title="Ver los artículos" data-type="2" class="invoice-control" data-invoice="${invoice.SerNr}"><i style="color: #8B4513;" class="fas fa-th-large"></i></a>`,
            `<strong>${invoice.SerNr}</strong>`,
            `<strong>${invoice.SalesMan}</strong>`,
            `${invoice.date}`,
            `${invoice.amount}`,
            `<input tabindex="${index}" data-SerNr="${invoice.SerNr}" value="${invoice.contactdate}" data-type="contactdate" class="form-control finance datepicker" type="date" name="contactdate" id="contactdate">`,
            `<input tabindex="${index + 1}" data-SerNr="${invoice.SerNr}" value="${invoice.responsible}" data-type="responsible" class="form-control finance" type="text" name="responsible" id="responsible">`,
            `<input tabindex="${index + 2}" data-SerNr="${invoice.SerNr}" value="${invoice.contact}" data-type="contact" class="form-control finance" type="text" name="contact" id="contact">`,
            `<textarea tabindex="${index + 3}" data-SerNr="${invoice.SerNr}" data-type="comment" class="form-control finance" type="text" name="comment" id="comment">${invoice.comment}</textarea>`,
            `<input tabindex="${index + 4}" data-SerNr="${invoice.SerNr}" value="${invoice.payday}" data-type="payday" class="form-control finance datepicker" type="date" name="payday" id="payday">`,
            `<select tabindex="${index + 5}" data-SerNr="${invoice.SerNr}" value="${invoice.status}" data-type="status" class="form-control finance" name="status" id="status">
            <option value="${invoice.status}" disabled selected>${invoice.statusdesc}</option>    
            <option value="0">Pendiente</option>
                <option value="1">En Gestion de Cobro</option>
                <option value="2">Pago Programado</option>
                <option value="3">Reenviar al gerente</option>
             </select>`,
            `<button data-SerNr="${invoice.SerNr}" tabindex="${index + 6}" type="button" class="btn btn-lg btn-success" onclick="saveFinance(event)" disabled>Guardar</button>`
        ]
        index += 7

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
    <th scope="col">Usuario</th>
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
        <td>${history.name}</td>
        <td>${history.datereg}</td>
        </tr>`
        table += td
    })

    table += `</table></div><div class="form-group col-md-1"></div></div></div></div>`
    div += table

    return div
}

window.copyLineFinance = copyLineFinance
function copyLineFinance(event) {

    const check = event.currentTarget.checked
    const tr = event.path[3]

    if (tr.classList[1] !== "copy") {
        const copy = document.getElementsByClassName('copy')

        if (check) {
            tr.children[5].children[0].value = copy[0].children[5].children[0].value
            tr.children[6].children[0].value = copy[0].children[6].children[0].value
            tr.children[7].children[0].value = copy[0].children[7].children[0].value
            tr.children[8].children[0].value = copy[0].children[8].children[0].value
            tr.children[9].children[0].value = copy[0].children[9].children[0].value
            tr.children[10].children[0].value = copy[0].children[10].children[0].value

            const finance = {
                contactdate: tr.children[5].children[0].value,
                responsible: tr.children[6].children[0].value,
                contact: tr.children[7].children[0].value,
                comment: tr.children[8].children[0].value,
                payday: tr.children[9].children[0].value,
                status: tr.children[10].children[0].value,
                invoicenr: tr.children[10].children[0].getAttribute("data-sernr")
            }

            Connection.body(`finance`, { finance }, 'POST')

            tr.children[11].children[0].disabled = true
        } else {
            tr.children[5].children[0].value = ""
            tr.children[6].children[0].value = ""
            tr.children[7].children[0].value = ""
            tr.children[8].children[0].value = ""
            tr.children[9].children[0].value = ""
            tr.children[10].children[0].value = 0

            const finance = {
                contactdate: tr.children[5].children[0].value,
                responsible: tr.children[6].children[0].value,
                contact: tr.children[7].children[0].value,
                comment: tr.children[8].children[0].value,
                payday: tr.children[9].children[0].value,
                status: tr.children[10].children[0].value,
                invoicenr: tr.children[10].children[0].getAttribute("data-sernr")
            }

            Connection.body(`finance`, { finance }, 'POST')

            tr.children[11].children[0].disabled = true
        }
    } else {
        if (check) {
            if (event.path[4].children.length === 1) return alert('No hay otras facturas para copiar los datos')
            for (let index = 0; index < event.path[4].children.length; index++) {
                const element = event.path[4].children[index];
                element.children[5].children[0].value = tr.children[5].children[0].value
                element.children[6].children[0].value = tr.children[6].children[0].value
                element.children[7].children[0].value = tr.children[7].children[0].value
                element.children[8].children[0].value = tr.children[8].children[0].value
                element.children[9].children[0].value = tr.children[9].children[0].value
                element.children[10].children[0].value = tr.children[10].children[0].value

                const finance = {
                    contactdate: element.children[5].children[0].value,
                    responsible: element.children[6].children[0].value,
                    contact: element.children[7].children[0].value,
                    comment: element.children[8].children[0].value,
                    payday: element.children[9].children[0].value,
                    status: element.children[10].children[0].value,
                    invoicenr: element.children[10].children[0].getAttribute("data-sernr")
                }

                Connection.body(`finance`, { finance }, 'POST')

                element.children[11].children[0].disabled = true
            }
        } else {
            if (event.path[4].children.length === 1) return alert('No hay otras facturas para copiar los datos')
            for (let index = 0; index < event.path[4].children.length; index++) {
                const element = event.path[4].children[index];
                if (element.classList[1] !== "copy") {
                    element.children[5].children[0].value = ""
                    element.children[6].children[0].value = ""
                    element.children[7].children[0].value = ""
                    element.children[8].children[0].value = ""
                    element.children[9].children[0].value = ""
                    element.children[10].children[0].value = 0

                    const finance = {
                        contactdate: element.children[5].children[0].value,
                        responsible: element.children[6].children[0].value,
                        contact: element.children[7].children[0].value,
                        comment: element.children[8].children[0].value,
                        payday: element.children[9].children[0].value,
                        status: element.children[10].children[0].value,
                        invoicenr: element.children[10].children[0].getAttribute("data-sernr")
                    }

                    Connection.body(`finance`, { finance }, 'POST')

                    element.children[11].children[0].disabled = true
                }
            }
            alert("¡Todos los registros de contactos se guardaron correctamente!")
        }
    }
}

window.saveFinance = saveFinance

function saveFinance(event) {
    const btn = event.currentTarget

    const finance = {
        contactdate: event.path[2].children[5].children[0].value,
        responsible: event.path[2].children[6].children[0].value,
        contact: event.path[2].children[7].children[0].value,
        comment: event.path[2].children[8].children[0].value,
        payday: event.path[2].children[9].children[0].value,
        status: event.path[2].children[10].children[0].value,
        invoicenr: btn.getAttribute("data-sernr")
    }

    Connection.body(`finance`, { finance }, 'POST')
    event.currentTarget.disabled = true

    alert("!Registro de contacto guardado correctamente!")
}


const view = async (event) => {
    try {

        let office = document.querySelector('[data-filter-office]').value;
        let user = document.querySelector('[data-filter-user]').value;
        let status = event.currentTarget.getAttribute('data-action-view')


        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        const data = await Connection.noBody(`financeview/${office}/${user}/${status}`, 'GET')

        document.querySelector('[data-view-client]').innerHTML = data.length

        const invoices = data.reduce((a, b) => a + b.invoices, 0)
        document.querySelector('[data-view-invoice]').innerHTML = invoices

        const due = data.reduce((a, b) => a + b.AmountOpen, 0)
        document.querySelector('[data-view-due]').innerHTML = due.toLocaleString('us')

        const odue = data.reduce((a, b) => a + b.AmountBalance, 0)
        document.querySelector('[data-view-overdue]').innerHTML = odue.toLocaleString('us')


        let dtview = data.map(obj => {
            return [
                `<a data-toggle="popover" title="Ver todas las facturas vencidas" data-datetype="*" data-client="${obj.CustCode}"><i class="fas fa-angle-double-down" style="color:#cbccce;"></i></a>`,
                obj.CustCode,
                obj.CustName,
                `<a data-toggle="popover" title="Ver facturas vencidas 15 días" data-datetype="15" data-client="${obj.CustCode}">${obj.d15}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 16 a 30 días" data-datetype="30" data-client="${obj.CustCode}">${obj.d30}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 31 a 60 días" data-datetype="60" data-client="${obj.CustCode}">${obj.d60}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 61 a 90 días" data-datetype="90" data-client="${obj.CustCode}">${obj.d90}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 91 a 120 días" data-datetype="120" data-client="${obj.CustCode}">${obj.d120}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas por más de 120 días" data-datetype="120+" data-client="${obj.CustCode}">${obj.d120more}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                obj.AmountOpen,
                obj.AmountBalance,
            ]
        });

        list(dtview)


        $('html,body').animate({
            scrollTop: $('#dataTable').offset().top - 100
        }, 'slow');

    } catch (error) {

    }
}

Array.from(document.querySelectorAll('[data-action-view]')).forEach(action => {
    action.addEventListener('click', view, false)
})