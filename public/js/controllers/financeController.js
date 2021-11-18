import { ViewFinance } from "../views/financeView.js"
import { Connection } from '../services/connection.js'

const btnFinance = document.querySelector('[data-finance]')


btnFinance.addEventListener('click', async (event) => {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.style.display = "block"
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        const cardHistory = document.querySelector('[data-card]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');
        document.querySelector('[data-features]').innerHTML = ""

        settings.innerHTML = ''
        modal.innerHTML = " "
        modal.appendChild(ViewFinance.modalsearch())

        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').dataTable().fnClearTable();
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable').empty();
        }
        
        cardHistory.style.display = 'none';
        title.innerHTML = "Cobranza"
        title.appendChild(ViewFinance.buttonsearchstock())
        powerbi.innerHTML = " "

        const clients = await Connection.noBody('clients', 'GET')

        let dtview = []
        clients.forEach(client => {
            let obj = {
                label: client.CustName,
                value: `${client.CustCode}`
            }
            dtview.push(obj)
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


        const selectoffice = document.getElementById('selectoffice')
        const offices = await Connection.noBody('offices', 'GET')

        offices.forEach(office => {
            if (office.id_office !== 15) selectoffice.appendChild(ViewFinance.listOffice(office))
        });

        document.getElementById("overdueyes").checked = true;
        $('#selectoffice').selectpicker();
        $('#searchfinance').modal('show')
        loading.style.display = "none";
    } catch (error) {
        loading.style.display = "none";
        alert(error)
    }
})


function autocompleteclients(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].CustName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].CustName.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].CustName.substr(val.length);
                b.innerHTML += `<input type='hidden' value='${arr[i].CustCode}'>`;
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


window.listFinance = listFinance

async function listFinance(event) {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.style.display = "block"
    try {
        let title = document.querySelector('[data-title]')
        let powerbi = document.querySelector('[data-powerbi]')
        const cardHistory = document.querySelector('[data-card]')
        let modal = document.querySelector('[data-modal]')
        let settings = document.querySelector('[data-settings]');
        document.querySelector('[data-features]').innerHTML = ""

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
        loading.style.display = "none"
        cardHistory.style.display = 'none';

        const clients = await Connection.noBody('clients', 'GET')

        let dtview = []
        clients.forEach(client => {
            let obj = {
                label: client.CustName,
                value: `${client.CustCode}`
            }
            dtview.push(obj)
        })

        new SelectPure(".select-pure", {
            placeholder: "Clientes",
            options: dtview,
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            inlineIcon: false,
            onChange: event => {
                cleanPlaceholder(event)
            }
        });

        // document.querySelector('.select-pure__placeholder').innerHTML = "Clientes"

        const selectoffice = document.getElementById('selectoffice')
        const offices = await Connection.noBody('offices', 'GET')

        offices.forEach(office => {
            selectoffice.appendChild(ViewFinance.listOffice(office))
        });

        document.getElementById("overdueyes").checked = true;
        $('#selectoffice').selectpicker();
        $('#searchfinance').modal('show')
        loading.style.display = "none";
    } catch (error) {
        loading.style.display = "none";
        alert(error)
    }
}

window.searchFinance = searchFinance

async function searchFinance(event) {
    event.preventDefault()
    $('#searchfinance').modal('hide')

    let loading = document.querySelector('[data-loading]')
    loading.style.display = "block";
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

        loading.style.display = "none"
    } catch (error) {
        loading.style.display = "none"
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