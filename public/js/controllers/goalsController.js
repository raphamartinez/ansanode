import { View } from "../views/goalsView.js"
import { Connection } from '../services/connection.js'


const chart = (days, salesAmount, salesPerDay, index, group) => {
    let label1 = group ? `Ventas por dia - ${group}` : `Ventas por dia`;
    let label2 = group ? `Montante de Ventas - ${group}` : `Montante de Ventas`;

    const data = {
        labels: days,
        datasets: [{
            type: 'bar',
            label: label1,
            data: salesAmount,
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            order: 2
        }, {
            type: 'line',
            label: label2,
            data: salesPerDay,
            borderWidth: 2,
            fill: false,
            backgroundColor: '#ACF415',
            borderColor: '#ACF195',
            tension: 0.2,
            order: 1
        }]
    };

    const ctx = document.querySelector(`[data-chart-amount-${index}]`)

    const chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            legend: {
                position: 'top',
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

    // const update = (days, salesPerDay, salesAmount, group, goal, index) => {



    //     const i = chart.data.datasets.length == 2 ? 0 : chart.data.datasets.length;
    //     chart.data.labels = days;
    //     chart.data.datasets[i].data = salesPerDay;
    //     chart.data.datasets[i].label = `Ventas por dia - ${group}`
    //     chart.data.datasets[i + 1].data = salesAmount;
    //     chart.data.datasets[i + 1].label = `Montante de Ventas - ${group}`

    //     // if (chart.data.datasets.length == 2) {
    //     //     var newDataset = {
    //     //         label: `Meta - ${group}`,
    //     //         backgroundColor: 'rgba(99, 255, 132, 0.2)',
    //     //         borderColor: 'rgba(99, 255, 132, 1)',
    //     //         borderWidth: 1,
    //     //         data: goal,
    //     //         type: 'line'
    //     //     }
    //     //     chart.data.datasets.push(newDataset);

    //     // } else {
    //     //     chart.data.datasets[i + 2].type = 'line'
    //     //     chart.data.datasets[i + 2].backgroundColor = '#AFE000'
    //     //     chart.data.datasets[i + 2].data = goal;
    //     //     chart.data.datasets[i + 2].label = `Meta - ${group}`
    //     // }

    //     chart.update();
    // }

}

const viewGroup = async (event) => {
    if (event.target.parentNode.nodeName == "TR") {
        const index = event.target.parentNode.getAttribute("data-index");
        const seller = event.target.parentNode.getAttribute("data-id");
        const group = event.target.parentNode.getAttribute("data-group");
        const month = event.target.parentNode.getAttribute("data-month");
        const office = event.target.parentNode.getAttribute("data-office");

        if (event.target.parentNode.getAttribute(`data-active-${index}`)) {

            const sellers = await Connection.noBody(`goal/sellers/${month}/${office}/${seller}`, 'GET')
            sellers.forEach(salesman => {
                let allSale = 0;
                let allGoal = 0;

                if (salesman.amount.length > 0) {
                    salesman.amount.forEach(amount => {
                        let goal = salesman.goals.find(goal => goal.itemgroup === amount.name);

                        if (goal) {
                            allGoal += goal.amount;
                            allSale += amount.qty;
                        }
                    });
                } else {
                    salesman.goals.forEach(goal => {
                        let amount = salesman.amount.find(amount => goal.itemgroup === amount.name);

                        if (amount) {
                            allGoal += goal.amount;
                            allSale += amount.qty;
                        }
                    });
                }

                let percent = allGoal > 0 ? (allSale * 100 / allGoal).toFixed(0) : 0;

                let color = '#A9A9A9';

                switch (true) {
                    case (percent == 0):
                        color = '#A9A9A9';
                        break;

                    case (percent > 0 && percent <= 25):
                        color = '#FB301E';
                        break;


                    case (percent > 25 && percent <= 50):
                        color = '#E2D51A';
                        break;

                    case (percent > 50 && percent <= 75):
                        color = '#5F9EA0';
                        break;

                    case (percent > 75):
                        color = '#00AE4D';
                        break;

                }

                document.querySelector(`[data-div-chart-${index}]`).innerHTML = "";
                document.querySelector(`[data-div-chart-${index}]`).innerHTML = `<h5>Graficos</h5><canvas class="flex d-inline" data-chart-amount-${index}></canvas>`;

                chart(salesman.days, salesman.salesPerDay, salesman.salesAmount, index);
                updateChartGauge(`Rendimiento %`, color, index, percent, percent, "%");
            });

            event.target.parentNode.style.backgroundColor = null;
            event.target.parentNode.removeAttribute(`data-active-${index}`);

        } else {


            const sellers = await Connection.noBody(`goal/sellers/${month}/${office}/${seller}/${group}`, 'GET')

            document.querySelectorAll(`[data-active-${index}]`).forEach(div => {
                div.style.backgroundColor = null;
            })

            sellers.forEach(salesman => {
                let allGoal = 0;
                let allSale = 0;
                document.querySelector(`[data-div-chart-${index}]`).innerHTML = ""
                document.querySelector(`[data-div-chart-${index}]`).innerHTML = `<h5>Graficos</h5><canvas class="flex d-inline" data-chart-amount-${index}></canvas>`;

                if (salesman.goals.length > 0) salesman.goals.forEach(goal => allGoal += goal.amount);
                if (salesman.amount.length > 0) salesman.amount.forEach(amount => allSale += amount.qty);

                let percent = allGoal > 0 ? (allSale * 100 / allGoal).toFixed(0) : 0;

                let color = '#A9A9A9';

                switch (true) {
                    case (percent == 0):
                        color = '#A9A9A9';
                        break;

                    case (percent > 0 && percent <= 25):
                        color = '#FB301E';
                        break;

                    case (percent > 25 && percent <= 50):
                        color = '#E2D51A';
                        break;

                    case (percent > 50 && percent <= 75):
                        color = '#5F9EA0';
                        break;

                    case (percent > 75):
                        color = '#00AE4D';
                        break;
                }

                chart(salesman.days, salesman.salesPerDay, salesman.salesAmount, index, group)
                updateChartGauge(`Rendimiento - Cant Vendida`, color, index, allGoal, allSale)
            })

            event.target.parentNode.style.backgroundColor = "#c9ffcf7a";
            event.target.parentNode.dataset[`active-${index}`] = 1;
        }
    }
}

document.querySelector('[data-goal-users]').addEventListener('click', viewGroup, false)

const gaugeChart = (color, porcent, title, index) => {
    function GaugeChart(value, titleText, backgroundColor) {

        let amount = value > 100 ? 100 : value;
        let message = value == 0 ? "ND" : `${value} %`;

        return {
            type: "gauge",
            title: {
                text: titleText,
                "_media-rules": [
                    {
                        "max-width": 650,
                        "visible": false
                    }
                ]
            },
            scaleR: {
                aperture: 200,
                values: "0:100:20",
                guide: {
                    backgroundColor: "#E3DEDA",
                    alpha: 1
                },
                ring: {
                    backgroundColor: "#E3DEDA",
                    "_media-rules": [
                        {
                            "max-width": 650,
                            "visible": false
                        }
                    ]
                },
                center: {
                    size: 50,
                    borderWidth: 2,
                    borderColor: "#23211E",
                    "_media-rules": [
                        {
                            "max-width": 650,
                            "size": 10
                        }
                    ]
                },
                item: {
                    offsetR: 0
                },
                tick: {
                    visible: false
                },
                markers: [
                    {
                        type: "area",
                        range: [0, amount],
                        backgroundColor: backgroundColor
                    }
                ]
            },
            plotarea: {
                marginTop: "35%"
            },
            plot: {
                csize: "3%",
                size: "100%"
            },
            scale: {
                sizeFactor: 1.2,
                "_media-rules": [
                    {
                        "max-width": 650,
                        sizeFactor: 1.6,
                    }
                ]
            },
            tooltip: {
                visible: false
            },
            series: [
                {
                    values: [parseInt(amount)],
                    backgroundColor: "#23211E",
                    valueBox: {
                        text: message,
                        placement: "center",
                        fontColor: backgroundColor,
                        fontSize: 14,
                        "_media-rules": [
                            {
                                "max-width": 650,
                                "fontSize": 10
                            }
                        ]
                    }
                }
            ]
        }
    }

    var gaugeChart = GaugeChart(porcent, title, color);

    zingchart.render({
        id: `gaugeChart${index}`,
        data: gaugeChart,
        height: '100%',
        width: '100%'
    });
}

const updateChartGauge = (title, color, index, goal, sale, string = "") => {
    let value = sale > goal ? goal : sale;
    let porcent = value > 100 ? 100 : value;
    let message = sale == 0 ? "ND" : `${sale} ${string}`;

    zingchart.exec(`gaugeChart${index}`, 'appendseriesdata', {
        plotindex: 0,
        update: false,
        data: {
            values: [value]
        }
    });

    zingchart.exec(`gaugeChart${index}`, 'modify', {
        update: false,
        data: {
            title: {
                text: title,
            },
            scaleR: {
                values: `0:${string ? 100 : goal}:${string ? 20 : goal / 5}`,
                markers: [
                    {
                        type: "area",
                        range: [0, porcent],
                        backgroundColor: color
                    }
                ],
            },
            series: [
                {
                    values: [parseInt(`${string ? goal > 100 ? 100 : goal : goal}`)],
                    backgroundColor: "#23211E",
                    valueBox: {
                        text: message,
                        placement: "center",
                        fontColor: color,
                        fontSize: 14,
                        "_media-rules": [
                            {
                                "max-width": 650,
                                "fontSize": 10
                            }
                        ]
                    }
                }
            ]
        }
    });

    zingchart.exec(`gaugeChart${index}`, 'update');
}

const changeOffice = (event) => {

    const value = parseInt(event.target.value);

    const options = document.querySelectorAll('[data-seller] option')

    options.forEach(option => {
        option.getAttribute('data-office') == value ? option.style.display = 'block' : option.style.display = 'none'
    })

}

document.querySelector('[data-office]').addEventListener('change', changeOffice, false);

const searchOffice = async (event) => {
    event.preventDefault();

    try {
        const office = event.currentTarget.office.value;
        const month = event.currentTarget.month.value;

        // const offices = await Connection.noBody(`goal/offices/${month}/${office}`, 'GET');

        // offices.forEach(of => {

        // })

    } catch (error) {
        console.log(error);
    }
}

document.querySelector('[data-search-goal-offices]').addEventListener('submit', searchOffice, false);

const searchUnit = async (event) => {
    event.preventDefault();

    const office = event.currentTarget.office.value;
    const seller = event.currentTarget.seller.value;
    const month = event.currentTarget.month.value;

    const sellers = await Connection.noBody(`goal/sellers/${month}/${office}/${seller}`, 'GET')
    document.querySelector('[data-goal-users]').innerHTML = ""

    sellers.forEach((salesman, index) => {
        let goals = "";
        let allSale = 0;
        let allGoal = 0;

        if (salesman.amount.length > 0) {
            salesman.amount.forEach(amount => {

                let goal = salesman.goals.find(goal => goal.itemgroup === amount.name);
                let porcent = goal ? (amount.qty * 100 / goal.amount).toFixed(0) : 0;

                if (goal) {
                    allGoal += goal.amount;
                    allSale += amount.qty;
                }

                let descPorcent = porcent > 0 ? `${porcent} %` : ' ';

                goals += `
                <tr data-view-group data-index="${index}" data-group="${amount.name}" data-office="${office}" data-month="${month}" data-id="${salesman.id_salesman}">
                    <th scope="row">${amount.name}</th>
                    <td>${amount.qty}</td>
                    <td>${descPorcent}</td>
                </tr>`;

            });
        } else {
            salesman.goals.forEach(goal => {

                let amount = salesman.amount.find(amount => goal.itemgroup === amount.name);
                let porcent = amount ? (amount.qty * 100 / goal.amount).toFixed(0) : 0;

                if (amount) {
                    allGoal += goal.amount;
                    allSale += amount.qty;
                }

                let descPorcent = porcent > 0 ? `${porcent} %` : ' ';

                goals += `
                <tr data-view-group data-index="${index}" data-group="${goal.itemgroup}" data-office="${office}" data-month="${month}" data-id="${salesman.id_salesman}">
                    <th scope="row">${goal.itemgroup}</th>
                    <td>0</td>
                    <td>${descPorcent}</td>
                </tr>`;

            });
        }


        let percent = allGoal > 0 ? (allSale * 100 / allGoal).toFixed(0) : 0;

        let color = '#A9A9A9';

        switch (true) {
            case (percent == 0):
                color = '#A9A9A9';
                break;

            case (percent > 0 && percent <= 25):
                color = '#FB301E';
                break;

            case (percent > 25 && percent <= 50):
                color = '#E2D51A';
                break;

            case (percent > 50 && percent <= 75):
                color = '#5F9EA0';
                break;

            case (percent > 75):
                color = '#00AE4D';
                break;
        }

        document.querySelector('[data-goal-users]').appendChild(View.user(salesman, goals, index));
        chart(salesman.days, salesman.salesPerDay, salesman.salesAmount, index)
        gaugeChart(color, percent, 'Rendimiento %', index)

    });

}

document.querySelector('[data-search-goal-sellers]').addEventListener('submit', searchUnit, false)
const init = async () => {

    try {

        const sellersgoal = await Connection.noBody('sellers', 'GET');
        sellersgoal.forEach(salesman => {
            const option = document.createElement('option');
            option.value = `{"id_salesman": ${salesman.id_salesman}, "office": "${salesman.office}"}`;
            option.innerHTML = salesman.name;

            document.getElementById('exsellers').appendChild(option);

            const option2 = document.createElement('option');
            option2.value = `{"id_salesman": ${salesman.id_salesman}, "office": "${salesman.office}"}`;
            option2.innerHTML = salesman.name;

            document.getElementById('onsellers').appendChild(option2);

            const option3 = document.createElement('option');
            option3.value = salesman.code;
            option3.innerHTML = salesman.name;
            option3.dataset.office = salesman.office;

            document.querySelector('[data-seller]').appendChild(option3);
        });

        const itemsgroups = await Connection.noBody('itemsgroups', 'GET');
        itemsgroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.Name;
            option.innerHTML = group.Name;

            document.getElementById('exgroups').appendChild(option);

            const option2 = document.createElement('option');
            option2.value = group.Name;
            option2.innerHTML = group.Name;

            document.getElementById('ongroups').appendChild(option2);
        })

        const offices = await Connection.noBody('offices', 'GET');
        offices.forEach(office => {
            const option = document.createElement('option');
            option.value = office.code;
            option.innerHTML = office.name;

            if (office.id_office !== 15) document.querySelector('[data-office]').appendChild(option);

            const option2 = document.createElement('option');
            option2.value = office.code;
            option2.innerHTML = office.name;

            if (office.id_office !== 15) document.querySelector('#suoffice').appendChild(option2);
        });

        $('#exgroups').selectpicker("refresh");

    } catch (error) {

    }
}

init()

const goalOnline = async () => {

    try {

        if ($.fn.DataTable.isDataTable('#tablegoals')) {
            $('#tablegoals').dataTable().fnClearTable();
            $('#tablegoals').dataTable().fnDestroy();
            $('#tablegoals').empty();
        }

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

        let datecolumn = dates.map(date => {
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

            return now;
        })

        const table = $("#tablegoals").DataTable({
            data: [],
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
            autoHeight: true,
            autoWidth: true,
            lengthMenu: [[200, 300, 400, 500], [200, 300, 400, 500]],
            pagingType: "numbers",
            fixedHeader: false,
            order: true
        })

        $('#goalOnline').modal("show");

    } catch (error) {

    }
}

document.querySelector('[button-goal-online]').addEventListener('click', goalOnline, false)



const searchGoalOnline = (event) => {
    event.preventDefault();

    try {

        const listgroups = document.getElementById('ongroups')
        const group = listgroups.options[listgroups.selectedIndex].value;

        const listsellers = document.getElementById('onsellers')
        const salesman = JSON.parse(listsellers.options[listsellers.selectedIndex].value);

        const stock = document.querySelector('input[name="stock"]:checked').value;

        listGoals(salesman, group, stock);
    } catch (error) {

    }
}

document.querySelector('[data-online-goal]').addEventListener('submit', searchGoalOnline, false)

const generateExcel = async (event) => {
    event.preventDefault();

    try {

        const arrgroups = document.querySelectorAll('#exgroups option:checked');
        const groups = Array.from(arrgroups).map(el => `'${el.value}'`);

        const salesman = document.querySelector('#exsellers option:checked').value;
        const stock = document.querySelector('input[name="liststock"]:checked').value;

        document.querySelector('[data-btn-download]').innerHTML = ""

        const div = document.createElement('div')
        div.classList.add('spinner-border', 'spinner-border')

        document.querySelector('[data-btn-download]').appendChild(div);

        document.querySelector('[data-btn-download]').disabled = true;

        const xls = await Connection.backFile(`goalslineexcel/${salesman}/${groups}/${stock}`, 'GET');

        document.querySelector('[data-btn-download]').innerHTML = `<i class="fas fa-file-excel"> Descarga Excel</i>`;
        document.querySelector('[data-btn-download]').disabled = false;

        const filexls = await xls.blob();

        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(filexls);
        a.target = "_blank";
        a.download = "meta.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (error) {
        document.querySelector('[data-btn-download]').innerHTML = `<i class="fas fa-file-excel"> Descarga Excel</i>`;
        document.querySelector('[data-btn-download]').disabled = false;
    }
}

document.querySelector('[data-generate-excel]').addEventListener('submit', generateExcel, false)

const listGoals = async (salesman, group, stock) => {

    try {

        const goalsline = await Connection.noBody(`goalsline/${salesman.id_salesman}/${salesman.office}/${group}/${stock}`, 'GET')

        if ($.fn.DataTable.isDataTable('#tablegoals')) {
            $('#tablegoals').dataTable().fnClearTable();
            $('#tablegoals').dataTable().fnDestroy();
            $('#tablegoals').empty();
        };

        let index = 1;

        const profile = document.querySelector('#profile').value
        let disabled;
        if (profile == 8) disabled = "disabled"

        let dtview = goalsline.map(goal => {
            const field = View.lineaddgoal(goal, index, salesman.id_salesman, disabled)
            index += 12
            return field
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

        let datecolumn = dates.map(date => {
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

            return now;
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
            autoHeight: true,
            autoWidth: true,
            lengthMenu: [[200, 300, 400, 500], [200, 300, 400, 500]],
            pagingType: "numbers",
            fixedHeader: false,
            order: true
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
                const salesman = document.querySelector('#onsellers option:checked').value;
                const sales = await Connection.noBody(`sale/${salesman}/${artcode}`, "GET")

                row.child(listSales(sales)).show();
                tr.addClass('shown');
            }
            i.classList.add('fas', 'fa-shopping-cart');
            i.classList.remove('spinner-border');

        });

    } catch (error) {

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

const inputFile = () => {
    let fileName = document.getElementById('file').files[0].name;
    if (fileName.split('.').pop() === "xlsx" || fileName.split('.').pop() === "xls") {
        document.getElementById('filename').innerHTML = fileName
    } else {
        document.getElementById('file').value = "";
        document.getElementById('filename').innerHTML = "Buscar archivo..."
        alert("El archivo insertado no es un Excel válido")
    }
}

document.querySelector('[data-file]').addEventListener('change', inputFile, false)

const uploadFile = async (event) => {
    event.preventDefault();

    try {
        const file = event.currentTarget.file.files[0]

        const formData = new FormData()

        formData.append('file', file)

        const obj = await Connection.bodyMultipart('goalexcel', formData, 'POST')

        alert(obj.msg)
    } catch (error) {

    }
}

document.querySelector('[data-form-upload]').addEventListener('submit', uploadFile, false)
