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
            if (!dtt.status || dtt.status == 0) {
                let div = document.querySelector(`[data-view-status-0]`);

                let now = parseFloat(div.innerHTML)

                div.innerHTML = overdue + now
            } else {
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

    $("#dataTable").DataTable({
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
        lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
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
}

const action = async (event) => {
    if (event.target && event.target.parentElement.getAttribute('data-index') && event.target.parentElement.getAttribute('data-datetype')) {

        const btn = event.target.parentElement;
        const client = btn.getAttribute("data-client");
        const date = btn.getAttribute("data-datetype");
        const index = btn.getAttribute("data-index");
        const title = titleFinance(date);

        let tr = event.path[3];
        let row = $('#dataTable')
            .DataTable()
            .row(tr);

        const i = event.target;

        if (row.child.isShown()) {
            tr.classList.remove('bg-info', 'text-white')
            i.classList.remove('fas', 'fa-angle-up');
            date === "*" ? i.classList.add('fas', 'fa-angle-double-down') : i.classList.add('fas', 'fa-angle-down');
            row.child.hide();
            tr.classList.remove('shown')

        } else {
            tr.classList.add('bg-info', 'text-white')
            date === "*" ? i.classList.remove('fas', 'fa-angle-double-down') : i.classList.remove('fas', 'fa-angle-down');
            i.classList.add('spinner-border', 'spinner-border-sm');

            const selectoffice = document.querySelectorAll('#selectoffice option:checked');
            let offices = Array.from(selectoffice).map(el => `'${el.value}'`);
            if (offices[0] === "''") offices[0] = "ALL";
            const invoices = await Connection.noBody(`financeclient/${client}/${date}`, "GET");

            if (invoices.length === 0) {
                alert('No hay facturas en este período para mostrar');
                i.classList.remove('spinner-border', 'fas', 'fa-angle-up');
                tr.classList.remove('shown', 'bg-info', 'text-white');
                date === "*" ? i.classList.add('fas', 'fa-angle-double-down') : i.classList.add('fas', 'fa-angle-down');
                return null;
            }

            if ($.fn.DataTable.isDataTable(`#datainvoices${index}`)) {
                $(`#datainvoices${index}`).dataTable().fnClearTable();
                $(`#datainvoices${index}`).dataTable().fnDestroy();
                $(`#datainvoices${index}`).empty();
            };

            let { div, dtview } = viewFinance(index, title, invoices)

            row.child(div).show();

            const tableinv = $(`#datainvoices${index}`).DataTable({
                data: dtview,
                columns: [
                    {
                        title: "Opciones",
                        className: "invoice-control text-center"
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
                    { title: "Status" },
                    { title: "Guardar" }
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

            tr.classList.add('shown')
            i.classList.add('fas', 'fa-angle-up');
            i.classList.remove('spinner-border', 'spinner-border-sm');

            $(`#datainvoices${index} tbody`).on('click', 'a.invoice-control', async function (event) {
                const btn = event.currentTarget;

                const invoice = btn.getAttribute("data-invoice");
                const type = btn.getAttribute("data-type");
                const index = btn.getAttribute("data-index");

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

        }
    }
}

document.querySelector('#dataTable').addEventListener('click', action, false);


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


        let dtview = data.map((obj, index) => {
            return [
                `<a data-toggle="popover" title="Ver todas las facturas vencidas" data-index="${index}" data-datetype="*" data-client="${obj.CustCode}"><i class="fas fa-angle-double-down" style="color:#cbccce;"></i></a>`,
                obj.CustCode,
                obj.CustName,
                `<a data-toggle="popover" title="Ver facturas vencidas 15 días" data-index="${index}" data-datetype="15" data-client="${obj.CustCode}">${obj.d15}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 16 a 30 días" data-index="${index}" data-datetype="30" data-client="${obj.CustCode}">${obj.d30}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 31 a 60 días" data-index="${index}" data-datetype="60" data-client="${obj.CustCode}">${obj.d60}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 61 a 90 días" data-index="${index}" data-datetype="90" data-client="${obj.CustCode}">${obj.d90}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 91 a 120 días" data-index="${index}" data-datetype="120" data-client="${obj.CustCode}">${obj.d120}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas por más de 120 días" data-index="${index}" data-datetype="120+" data-client="${obj.CustCode}">${obj.d120more}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
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



function viewFinance(index, title, invoices) {

    let div = `<h3><strong>${title}</strong></h3>
    <table id="datainvoices${index}" style="background-color: rgba(90, 159, 236, .1); padding-top: 0.3rem;" class="table text-center table-hover table-bordered table-sm" cellpadding="0" cellspacing="0" border="0">
    </table>`

    let dtview = invoices.map((invoice, index) => {
        return [
            `<div class="form-check" style="display: inline;"><input onclick="copyLineFinance(event)" class="form-check-input" type="hidden" value=""></div>
             <a data-toggle="popover" title="Copiar contacto a otras facturas" data-type="0" class="invoice-control" data-invoice="${invoice.SerNr}"><i style="color: #32CD32;" class="fas fa-copy"></i></a>
             <a data-toggle="popover" title="Ver historial de contactos" data-type="1" class="invoice-control" data-invoice="${invoice.SerNr}"><i class="fas fa-list-ol"></i></a>
             <a data-toggle="popover" title="Ver los artículos" data-type="2" class="invoice-control" data-invoice="${invoice.SerNr}"><i style="color: #8B4513;" class="fas fa-th-large"></i></a>`,
            `<strong>${invoice.SerNr}</strong>`,
            `<strong>${invoice.SalesMan ? invoice.SalesMan : "NO DEFINIDO"}</strong>`,
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
            `<button data-SerNr="${invoice.SerNr}" data-typecoin="${invoice.typecoin}" data-payterm="${invoice.payterm}" data-client="${invoice.CustCode}" data-amount="${invoice.coinAmount}" data-office="${invoice.office}" tabindex="${index + 6}" type="button" class="btn btn-lg btn-success" onclick="saveFinance(event)" disabled><i class="fas fa-1x fa-save"></i></button>`
        ]
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

async function copyLineFinance(event) {

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

            const status = await Connection.body(`finance`, { finance }, 'POST')

            switch (status) {
                case 1: {
                    toastr.success(`Factura: ${finance.invoicenr}<br>Responsible: ${finance.responsible}`, "Contacto agregado con éxito!", {
                        progressBar: true
                    })
                }

                    break;
                case 2: {
                    toastr.warning(`El contacto fue cambiado.`, "Aviso!", {
                        progressBar: true
                    })
                }

                    break;
                case 3: {
                    toastr.error(`Verifique los datos insertados, uno erro fue generado.`, "Erro ao guardar!", {
                        progressBar: true
                    })
                }

                    break;
            };

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

            const status = await Connection.body(`finance`, { finance }, 'POST')

            switch (status) {
                case 1: {
                    toastr.success(`Factura: ${finance.invoicenr}<br>Responsible: ${finance.responsible}`, "Contacto agregado con éxito!", {
                        progressBar: true
                    })
                }

                    break;
                case 2: {
                    toastr.warning(`Lo contacto fue cambiado.`, "Aviso!", {
                        progressBar: true
                    })
                }

                    break;
                case 3: {
                    toastr.error(`Verifique los datos insertados, uno erro fue generado.`, "Erro ao guardar!", {
                        progressBar: true
                    })
                }

                    break;
            };

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

                const status = await Connection.body(`finance`, { finance }, 'POST')

                switch (status) {
                    case 1: {
                        toastr.success(`Factura: ${finance.invoicenr}<br>Responsible: ${finance.responsible}`, "Contacto agregado con éxito!", {
                            progressBar: true
                        })
                    }

                        break;
                    case 2: {
                        toastr.warning(`Lo contacto fue cambiado.`, "Aviso!", {
                            progressBar: true
                        })
                    }

                        break;
                    case 3: {
                        toastr.error(`Verifique los datos insertados, uno erro fue generado.`, "Erro ao guardar!", {
                            progressBar: true
                        })
                    }

                        break;
                };

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

                    const status = await Connection.body(`finance`, { finance }, 'POST')

                    switch (status) {
                        case 1: {
                            toastr.success(`Factura: ${finance.invoicenr}<br>Responsible: ${finance.responsible}`, "Contacto agregado con éxito!", {
                                progressBar: true
                            })
                        }

                            break;
                        case 2: {
                            toastr.warning(`Lo contacto fue cambiado.`, "Aviso!", {
                                progressBar: true
                            })
                        }

                            break;
                        case 3: {
                            toastr.error(`Verifique los datos insertados, uno erro fue generado.`, "Erro ao guardar!", {
                                progressBar: true
                            })
                        }

                            break;
                    };

                    element.children[11].children[0].disabled = true
                }
            }
            alert("¡Todos los registros de contactos se guardaron correctamente!")
        }
    }
}
window.copyLineFinance = copyLineFinance

async function saveFinance(event) {
    const btn = event.currentTarget

    const tr = event.path[3].nodeName == "TR" ? event.path[3] : event.path[2]

    const finance = {
        contactdate: tr.children[5].children[0].value,
        responsible: tr.children[6].children[0].value,
        contact: tr.children[7].children[0].value,
        comment: tr.children[8].children[0].value,
        payday: tr.children[9].children[0].value,
        status: tr.children[10].children[0].value,
        invoicenr: btn.getAttribute("data-sernr"),
        office: btn.getAttribute("data-office"),
        amount: btn.getAttribute("data-amount"),
        client: btn.getAttribute("data-client"),
        typecoin: btn.getAttribute("data-typecoin"),
        payterm: btn.getAttribute("data-payterm"),
    }

    const status = await Connection.body(`finance`, { finance }, 'POST')
    event.target.parentNode.disabled = true;

    switch (status) {
        case 1: {
            toastr.success(`Factura: ${finance.invoicenr}<br>Responsible: ${finance.responsible}`, "Contacto agregado con éxito!", {
                progressBar: true
            })
        }

            break;
        case 2: {
            toastr.warning(`Lo contacto fue cambiado.`, "Aviso!", {
                progressBar: true
            })
        }

            break;
        case 3: {
            toastr.error(`Verifique los datos insertados, uno erro fue generado.`, "Erro ao guardar!", {
                progressBar: true
            })
        }

            break;
    };

}
window.saveFinance = saveFinance

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
                `<a data-toggle="popover" title="Ver todas las facturas vencidas" data-index="${index}" data-datetype="*" data-client="${obj.CustCode}"><i class="fas fa-angle-double-down" style="color:#cbccce;"></i></a>`,
                obj.CustCode,
                obj.CustName,
                `<a data-toggle="popover" title="Ver facturas vencidas 15 días" data-index="${index}" data-datetype="15" data-client="${obj.CustCode}">${obj.d15}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 16 a 30 días" data-index="${index}" data-datetype="30" data-client="${obj.CustCode}">${obj.d30}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 31 a 60 días" data-index="${index}" data-datetype="60" data-client="${obj.CustCode}">${obj.d60}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 61 a 90 días" data-index="${index}" data-datetype="90" data-client="${obj.CustCode}">${obj.d90}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 91 a 120 días" data-index="${index}" data-datetype="120" data-client="${obj.CustCode}">${obj.d120}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas por más de 120 días" data-index="${index}" data-datetype="120+" data-client="${obj.CustCode}">${obj.d120more}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
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

const clickFat = async (event) => {
    try {

        let office;
        if (event.target.nodeName == 'A') {
            office = event.target.getAttribute('data-office')
        } else {
            office = event.target.nodeName == 'svg' ? event.target.parentElement.getAttribute('data-office') : event.target.parentElement.parentElement.getAttribute('data-office')
        }

        let typeAmountOpen = document.querySelector('[data-filter-amount-open]').value

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }

        const data = await Connection.noBody(`financeclick/${typeAmountOpen}/${office}`, 'GET')

        document.querySelector('[data-view-client]').innerHTML = data.length

        const invoices = data.reduce((a, b) => a + b.invoices, 0)
        document.querySelector('[data-view-invoice]').innerHTML = invoices

        const due = data.reduce((a, b) => a + b.AmountOpen, 0)
        document.querySelector('[data-view-due]').innerHTML = due.toLocaleString('us')

        const odue = data.reduce((a, b) => a + b.AmountBalance, 0)
        document.querySelector('[data-view-overdue]').innerHTML = odue.toLocaleString('us')

        let day
        switch (typeAmountOpen) {
            case '1':
                day = '-30'
                break
            case '2':
                day = '-60'
                break
            case '3':
                day = '-90'
                break
            case '4':
                day = '-10000'
                break
        }


        let dtview = data.map((obj, index) => {
            return [
                `<a data-toggle="popover" title="Ver todas las facturas vencidas" data-index="${index}" data-datetype="*" data-client="${obj.CustCode}"><i class="fas fa-angle-double-down" style="color:#cbccce;"></i></a>`,
                obj.CustCode,
                obj.CustName,
                `<a data-toggle="popover" title="Ver facturas vencidas 15 días" data-index="${index}" data-datetype="15" data-client="${obj.CustCode}">${obj.d15}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 16 a 30 días" data-index="${index}" data-datetype="30" data-client="${obj.CustCode}">${obj.d30}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 31 a 60 días" data-index="${index}" data-datetype="60" data-client="${obj.CustCode}">${obj.d60}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 61 a 90 días" data-index="${index}" data-datetype="90" data-client="${obj.CustCode}">${obj.d90}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas de 91 a 120 días" data-index="${index}" data-datetype="120" data-client="${obj.CustCode}">${obj.d120}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas vencidas por más de 120 días" data-index="${index}" data-datetype="120+" data-client="${obj.CustCode}">${obj.d120more}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
                `<a data-toggle="popover" title="Ver facturas en abierto até 120 días" data-index="${index}" data-datetype="${day}" data-client="${obj.CustCode}">${obj.AmountOpen}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
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

Array.from(document.querySelectorAll('[data-action-click]')).forEach(action => {
    action.addEventListener('click', clickFat, false)
})

const listInclude = (dtview) => {

    if ($.fn.DataTable.isDataTable('#dataInclude')) {
        $('#dataInclude').dataTable().fnClearTable();
        $('#dataInclude').dataTable().fnDestroy();
        $('#dataInclude').empty();
    }

    let info = document.querySelector('[data-info-expected]')
    if (dtview.length > 0 && info) {
        info.classList.add('d-none')
    }

    if (dtview.length === 0) {
        info.classList.remove('d-none')
        return null
    }

    $("#dataInclude").DataTable({
        data: dtview,
        columns: [
            { title: "Cliente" },
            {
                title: "TT Vencido",
                className: "datatable-grey"
            },
            { title: "Transf USD" },
            { title: "Cheque USD" },
            { title: "Transf Gs" },
            { title: "Cheque Gs" },
            { title: "Fecha de Cobro" },
            { title: "Guardar", classList: "text-center" }
        ],
        paging: true,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        autoWidth: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'excel',
        ]
    })
}

$(document).on('keyup', '.goal', function (e) {
    const tr = e.currentTarget.parentElement.parentElement;

    const finance = {
        transfUsd: tr.children[2].children[0].value.replace(",", "."),
        chequeUsd: tr.children[3].children[0].value.replace(",", "."),
        transfGs: tr.children[4].children[0].value.replace(",", "."),
        chequeGs: tr.children[5].children[0].value.replace(",", "."),
        date: tr.children[6].children[0].value
    };

    if (finance.transfUsd || finance.chequeUsd || finance.transfGs || finance.chequeGs) {
        tr.children[7].children[0].disabled = false;
    } else {
        tr.children[7].children[0].disabled = true;
    }
});


const officeInclude = async (event) => {

    let office = event.target.getAttribute("data-office");

    const data = await Connection.noBody(`financeview/${office}/ALL/1`, 'GET')

    let i = 1;
    let dtview = data.map(obj => {
        const line = [
            `${obj.CustCode} - ${obj.CustName}`,
            obj.AmountBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            `<input data-type="${obj.transfUsd ? "3" : "1"}" data-office="${office}" data-client="${obj.CustCode}" tabindex="${i}" value="${obj.transfUsd ? obj.transfUsd : ""}" type="text" class="form-control goal dol text-center">`,
            `<input data-type="${obj.chequeUsd ? "3" : "1"}" data-office="${office}" data-client="${obj.CustCode}" tabindex="${i + 1}" value="${obj.chequeUsd ? obj.chequeUsd : ""}" type="text" class="form-control goal dol text-center">`,
            `<input data-type="${obj.transfGs ? "3" : "1"}" data-office="${office}" data-client="${obj.CustCode}" tabindex="${i + 2}" value="${obj.transfGs ? obj.transfGs : ""}" type="text" class="form-control goal guaranie text-center">`,
            `<input data-type="${obj.chequeGs ? "3" : "1"}" data-office="${office}" data-client="${obj.CustCode}" tabindex="${i + 3}" value="${obj.chequeGs ? obj.chequeGs : ""}" type="text" class="form-control goal guaranie text-center">`,
            `<input data-type="2" data-office="${office}" data-client="${obj.CustCode}" tabindex="${i + 4}" value="${obj.date ? obj.date : ""}" type="date" class="form-control goal text-center">`,
            `<button data-office="${office}" data-client="${obj.CustCode}" tabindex="${i + 5}" type="button" class="btn btn-lg btn-success" onclick="saveExpected(event)" disabled><i class="fas fa-1x fa-save"></i></button>`
        ]

        i += 6;

        return line;
    });

    listInclude(dtview)
}

window.officeInclude = officeInclude

const listResume = (dtview, dtEffective, offices, transfUsd, chequeUsd, transfGs, chequeGs) => {

    if ($.fn.DataTable.isDataTable('#dataResume')) {
        $('#dataResume').dataTable().fnClearTable();
        $('#dataResume').dataTable().fnDestroy();
        $('#dataResume').empty();
    }

    $("#dataResume").DataTable({
        data: dtview,
        columns: [
            { title: "Sucursal" },
            { title: "Transf USD" },
            { title: "Cheque USD" },
            { title: "Transf Gs" },
            { title: "Cheque Gs" }
        ],
        paging: false,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        autoWidth: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'excel',
        ]
    })

    document.querySelector('[data-div-chart-gs]').innerHTML = `
    <h4>Guaranies</h4>
    <canvas class="flex d-inline" data-chart-gs></canvas>`

    const ctxGs = document.querySelector('[data-chart-gs]')

    const chartGs = new Chart(ctxGs, {
        type: 'bar',
        data: {
            labels: offices,
            datasets: [{
                label: 'Cheque Gs',
                data: chequeGs,
                backgroundColor: [
                    'rgba(24, 226, 147, 0.4)',
                ],
                borderColor: [
                    'rgba(24, 226, 147, 0.9)',
                ],
                borderWidth: 3
            },
            {
                label: 'Efectivo/Transf Gs ',
                data: transfGs,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });

    document.querySelector('[data-div-chart-dol]').innerHTML = `
    <h4>Dolares</h4>
    <canvas class="flex d-inline" data-chart-dol></canvas>`

    const ctxDol = document.querySelector('[data-chart-dol]')

    const chartDol = new Chart(ctxDol, {
        type: 'bar',
        data: {
            labels: offices,
            datasets: [{
                label: 'Cheque USD',
                data: chequeUsd,
                backgroundColor: [
                    'rgba(24, 226, 147, 0.4)',
                ],
                borderColor: [
                    'rgba(24, 226, 147, 0.9)',
                ],
                borderWidth: 3
            },
            {
                label: 'Efectivo/Transf USD ',
                data: transfUsd,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });

    if ($.fn.DataTable.isDataTable('#dataEffective')) {
        $('#dataEffective').dataTable().fnClearTable();
        $('#dataEffective').dataTable().fnDestroy();
        $('#dataEffective').empty();
    }

    $("#dataEffective").DataTable({
        data: dtEffective,
        columns: [
            { title: "Sucursal" },
            { title: "Transf USD" },
            { title: "%", classList: "text-center" },
            { title: "Cheque USD" },
            { title: "%", classList: "text-center" },
            { title: "Transf Gs" },
            { title: "%", classList: "text-center" },
            { title: "Cheque Gs" },
            { title: "%", classList: "text-center" }
        ],
        paging: false,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        autoWidth: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'excel',
        ]
    })

}

const officeResume = async (event) => {
    if (event) event.preventDefault()

    const month = document.querySelector('#sumonth').value

    const data = await Connection.noBody(`financeresumeoffice/${month ? month : ""}`, 'GET')

    let offices = []
    let transfUsd = []
    let chequeUsd = []
    let transfGs = []
    let chequeGs = []
    let dtEffective = []

    let dtview = data.map(obj => {
        offices.push(obj.code)
        transfUsd.push(obj.exUsdTransf)
        chequeUsd.push(obj.exChequeUsd)
        transfGs.push(obj.exTransfGs)
        chequeGs.push(obj.exChequeGs)

        dtEffective.push([
            `${obj.code} - ${obj.name}`,
            `${obj.usdTransf ? obj.usdTransf : ""}`,
            `${obj.exUsdTransf ? ((obj.exUsdTransf * 100) / obj.usdTransf).toFixed(2) : ""}`,
            `${obj.usdCheque ? obj.usdCheque : ""}`,
            `${obj.exChequeUsd ? ((obj.exChequeUsd * 100) / obj.usdCheque).toFixed(2) : ""}`,
            `${obj.gsTransf ? obj.gsTransf : ""}`,
            `${obj.exTransfGs ? ((obj.exTransfGs * 100) / obj.gsTransf).toFixed(2) : ""}`,
            `${obj.gsCheque ? obj.gsCheque : ""}`,
            `${obj.exChequeGs ? ((obj.exChequeGs * 100) / obj.gsCheque).toFixed(2) : ""}`
        ])

        return [
            `${obj.code} - ${obj.name}`,
            obj.exUsdTransf > 0 ? obj.exUsdTransf.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : "",
            obj.exChequeUsd > 0 ? obj.exChequeUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : "",
            obj.exTransfGs > 0 ? `Gs ${obj.exTransfGs.toLocaleString('es')}` : "",
            obj.exChequeGs > 0 ? `Gs ${obj.exChequeGs.toLocaleString('es')}` : ""
        ]
    });

    listResume(dtview, dtEffective, offices, transfUsd, chequeUsd, transfGs, chequeGs)
}

document.querySelector('[data-search-resume]').addEventListener('submit', officeResume)

window.officeResume = officeResume

async function saveExpected(event) {
    const tr = event.path[2].nodeName == 'TR' ? event.path[2] : event.path[3];
    let status = 3;

    const finance = {
        office: event.currentTarget.getAttribute('data-office'),
        client: event.currentTarget.getAttribute('data-client'),
        transfUsd: tr.children[2].children[0].value.replace(",", "."),
        chequeUsd: tr.children[3].children[0].value.replace(",", "."),
        transfGs: tr.children[4].children[0].value.replace(",", "."),
        chequeGs: tr.children[5].children[0].value.replace(",", "."),
        date: tr.children[6].children[0].value
    }

    status = await Connection.body(`financeexpected`, { finance }, 'POST');

    switch (status) {
        case 1: {
            toastr.success(`Cod Cliente: ${finance.client}<br>Sucursal: ${finance.office}`, "Expectativa agregada con éxito!", {
                progressBar: true
            })
        }

            break;
        case 2: {
            toastr.warning(`La expectativa de lo cliente fue cambiada`, "Aviso!", {
                progressBar: true
            })
        }

            break;
        case 3: {
            toastr.error(`Verifique la expectativa insertada, uno erro fue generado.`, "Erro en la Meta!", {
                progressBar: true
            })
        }

            break;
    };

}
window.saveExpected = saveExpected

const init = async () => {

    listInclude([]);

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

    const date = new Date()
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
    document.getElementById('sumonth').value = `${date.getFullYear()}-${month}`
    const offices = await Connection.noBody('offices', 'GET')
    offices.forEach(office => {
        const option = document.createElement('option')
        option.value = office.code
        option.innerHTML = office.name

        if (office.id_office !== 15) document.getElementById('selectoffice').appendChild(option)

        const option2 = document.createElement('option')
        option2.value = `'${office.code}'`
        option2.innerHTML = office.name

        if (office.id_office !== 15 && document.querySelector('[data-filter-office]')) document.querySelector('[data-filter-office]').appendChild(option2);

        const option3 = document.createElement('option');
        option3.value = `'${office.code}'`
        option3.innerHTML = office.name

        if (office.id_office !== 15) document.querySelector('[data-div-resume-office]').appendChild(option3)

        const a2 = document.createElement('a');
        a2.classList.add('nav-link');
        a2.dataset.toggle = "pill";
        a2.ariaSelected = "false";
        a2.innerHTML = office.name;
        a2.dataset.office = office.code;
        a2.onclick = function () { officeInclude(event) };

        if (office.id_office !== 15) document.querySelector('[data-div-expected-office]').appendChild(a2)
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