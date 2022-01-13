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

    new Chart(ctx, {
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
}

const viewGroupOffice = async (event) => {
    if (event.target.parentNode.nodeName == "TR" && event.target.parentNode.matches('[data-index]')) {
        const index = event.target.parentNode.getAttribute("data-index");
        const group = event.target.parentNode.getAttribute("data-group");
        const month = event.target.parentNode.getAttribute("data-month");
        const office = event.target.parentNode.getAttribute("data-office");

        if (event.target.parentNode.getAttribute(`data-active-${index}`)) {

            const offices = await Connection.noBody(`goaloffices/${month}/${office}`, 'GET');

            offices.forEach(ofi => {
                let allSale = 0;
                let allGoal = 0;

                let revenueEffective = 0;
                let revenueExpected = 0;

                if (office != "ALL" && !ofi.goals) return alert("No hay metas para esta sucursal neste mes.");
                if (!ofi.goals) return null;

                if (ofi.goals.length > 0) {
                    ofi.goals.forEach(goal => {

                        revenueEffective += goal.effectivePrice ? parseFloat(goal.effectivePrice) : 0;
                        revenueExpected += parseFloat(goal.price);

                        allGoal += goal.amount ? parseInt(goal.amount) : 0;
                        allSale += goal.effectiveAmount ? parseInt(goal.effectiveAmount) : 0;

                    });
                };

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

                chart(ofi.days, ofi.salesPerDay, ofi.salesAmount, index);
                updateChartGauge(`Rendimiento %`, color, index, allGoal, allSale);

                document.querySelector(`[data-revenue-effective${index}]`).innerHTML = `Facturación Realizada: ${revenueEffective.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
                document.querySelector(`[data-revenue-expected${index}]`).innerHTML = `Facturación Prevista: ${revenueExpected.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
            })

            if ($.fn.DataTable.isDataTable(`#dataFinance${index}`)) {
                $(`#dataFinance${index}`).dataTable().fnClearTable();
                $(`#dataFinance${index}`).dataTable().fnDestroy();
                $(`#dataFinance${index}`).empty();
            }

            $(`#collapseFinance${index}`).collapse('hide');

            event.target.parentNode.style.backgroundColor = null;
            event.target.parentNode.removeAttribute(`data-active-${index}`);

        } else {

            const offices = await Connection.noBody(`goaloffices/${month}/${office}/${group}`, 'GET');

            document.querySelectorAll(`[data-active-${index}]`).forEach(div => {
                div.style.backgroundColor = null;
            });

            offices.forEach(ofi => {
                let allGoal = 0;
                let allSale = 0;
                let revenueEffective = 0;
                let revenueExpected = 0;

                document.querySelector(`[data-div-chart-${index}]`).innerHTML = "";
                document.querySelector(`[data-div-chart-${index}]`).innerHTML = `<h5>Graficos</h5><canvas class="flex d-inline" data-chart-amount-${index}></canvas>`;

                if (ofi.goals.length > 0) {
                    ofi.goals.forEach(goal => {
                        allGoal += parseInt(goal.amount);
                        allSale += parseInt(goal.effectiveAmount);
                        revenueEffective += goal.effectivePrice;
                        revenueExpected += goal.price;
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
                };

                chart(ofi.days, ofi.salesPerDay, ofi.salesAmount, index, group);
                updateChartGauge(`Rendimiento - Cant Vendida`, color, index, allGoal, allSale);

                document.querySelector(`[data-revenue-effective${index}]`).innerHTML = `Facturación Realizada: ${revenueEffective.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
                document.querySelector(`[data-revenue-expected${index}]`).innerHTML = `Facturación Prevista: ${revenueExpected.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;

                let dtview = ofi.invoices.map(invoice => {
                    let date = new Date(invoice.date)
                    return [
                        invoice.id,
                        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                        invoice.user,
                        invoice.client,
                        invoice.artcode,
                        invoice.name,
                        invoice.qty,
                        invoice.price.toLocaleString("en-US", { style: "currency", currency: "USD" })
                    ];
                })

                $(`#collapseStock${index}`).collapse('hide');
                $(`#collapseFinance${index}`).collapse('show');

                if ($.fn.DataTable.isDataTable(`#dataFinance${index}`)) {
                    $(`#dataFinance${index}`).dataTable().fnClearTable();
                    $(`#dataFinance${index}`).dataTable().fnDestroy();
                    $(`#dataFinance${index}`).empty();
                };

                $(`#dataFinance${index}`).DataTable({
                    data: dtview,
                    columns: [
                        { title: "Id" },
                        { title: "Fecha" },
                        { title: "Vendedor" },
                        { title: "Cliente" },
                        { title: "Cod" },
                        { title: "Articulo" },
                        { title: "Cant" },
                        { title: "Precio" }
                    ],
                    responsive: true,
                    paging: true,
                    ordering: false,
                    info: true,
                    scrollX: true,
                    responsive: false,
                    autoWidth: true,
                    pagingType: "numbers",
                    order: true
                });
            });

            event.target.parentNode.style.backgroundColor = "#c9ffcf7a";
            event.target.parentNode.dataset[`active-${index}`] = 1;
        }
    }
}

document.querySelector('[data-goal-offices]').addEventListener('click', viewGroupOffice, false)

const viewGroup = async (event) => {
    if (event.target.parentNode.nodeName == "TR" && event.target.parentNode.matches('[data-index]')) {
        const index = event.target.parentNode.getAttribute("data-index");
        const seller = event.target.parentNode.getAttribute("data-id");
        const group = event.target.parentNode.getAttribute("data-group");
        const month = event.target.parentNode.getAttribute("data-month");
        const office = event.target.parentNode.getAttribute("data-office");

        if (event.target.parentNode.getAttribute(`data-active-${index}`)) {

            const sellers = await Connection.noBody(`goalsalesman/${month}/${office}/${seller}`, 'GET')
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

            if ($.fn.DataTable.isDataTable(`#dataFinance${index}`)) {
                $(`#dataFinance${index}`).dataTable().fnClearTable();
                $(`#dataFinance${index}`).dataTable().fnDestroy();
                $(`#dataFinance${index}`).empty();
            }

            $(`#collapseFinance${index}`).collapse('hide');

            event.target.parentNode.style.backgroundColor = null;
            event.target.parentNode.removeAttribute(`data-active-${index}`);

        } else {

            const sellers = await Connection.noBody(`goalsalesman/${month}/${office}/${seller}/${group}`, 'GET')

            document.querySelectorAll(`[data-active-${index}]`).forEach(div => {
                div.style.backgroundColor = null;
            })

            sellers.forEach(salesman => {
                let allGoal = 0;
                let allSale = 0;

                document.querySelector(`[data-div-chart-${index}]`).innerHTML = ""
                document.querySelector(`[data-div-chart-${index}]`).innerHTML = `<h5>Graficos</h5><canvas class="flex d-inline" data-chart-amount-${index}></canvas>`;

                if (salesman.goals.length > 0) salesman.goals.forEach(goal => allGoal += parseInt(goal.amount));
                if (salesman.amount.length > 0) salesman.amount.forEach(amount => allSale += parseInt(amount.qty));

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
                };

                chart(salesman.days, salesman.salesPerDay, salesman.salesAmount, index, group);
                updateChartGauge(`Rendimiento - Cant Vendida`, color, index, allGoal, allSale);

                let dtview = salesman.invoices.map(invoice => {
                    let date = new Date(invoice.date)
                    return [
                        invoice.id,
                        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                        invoice.user,
                        invoice.client,
                        invoice.artcode,
                        invoice.name,
                        invoice.qty,
                        invoice.price.toLocaleString("en-US", { style: "currency", currency: "USD" })
                    ];
                })

                $(`#collapseStock${index}`).collapse('hide');
                $(`#collapseFinance${index}`).collapse('show');

                if ($.fn.DataTable.isDataTable(`#dataFinance${index}`)) {
                    $(`#dataFinance${index}`).dataTable().fnClearTable();
                    $(`#dataFinance${index}`).dataTable().fnDestroy();
                    $(`#dataFinance${index}`).empty();
                };

                $(`#dataFinance${index}`).DataTable({
                    data: dtview,
                    columns: [
                        { title: "Id" },
                        { title: "Fecha" },
                        { title: "Vendedor" },
                        { title: "Cliente" },
                        { title: "Cod" },
                        { title: "Articulo" },
                        { title: "Cant" },
                        { title: "Precio" }
                    ],
                    responsive: true,
                    paging: true,
                    ordering: false,
                    info: true,
                    scrollX: true,
                    responsive: false,
                    autoWidth: true,
                    pagingType: "numbers",
                    order: true
                });
            })

            event.target.parentNode.style.backgroundColor = "#c9ffcf7a";
            event.target.parentNode.dataset[`active-${index}`] = 1;
        }
    }
}

document.querySelector('[data-goal-users]').addEventListener('click', viewGroup, false)

const gaugeChart = (color, porcent, title, index) => {
    function GaugeChart(value, titleText, backgroundColor) {

        let amount = value > 100 ? 100 : parseInt(value);
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

    document.querySelector('[data-goal-offices]').innerHTML = ""

    document.querySelector('[data-btn-goal-offices]').innerHTML = ""

    const div = document.createElement('div')
    div.classList.add('spinner-border', 'spinner-border')

    document.querySelector('[data-btn-goal-offices]').appendChild(div);
    document.querySelector('[data-btn-goal-offices]').disabled = true;

    try {
        const office = event.currentTarget.office.value;
        const month = event.currentTarget.month.value;

        const offices = await Connection.noBody(`goaloffices/${month}/${office}`, 'GET');

        offices.forEach((ofi, index) => {
            let goals = "";
            let allSale = 0;
            let allGoal = 0;

            let revenueEffective = 0;
            let revenueExpected = 0;

            if (office != "ALL" && !ofi.goals) return alert("No hay metas para esta sucursal neste mes.")
            if (!ofi.goals) return null;

            if (ofi.goals.length > 0) {
                ofi.goals.forEach(goal => {

                    revenueEffective += goal.effectivePrice ? parseFloat(goal.effectivePrice) : 0;
                    revenueExpected += parseFloat(goal.price);

                    allGoal += goal.amount ? parseInt(goal.amount) : 0;
                    allSale += goal.effectiveAmount ? parseInt(goal.effectiveAmount) : 0;

                    goals += `
                    <tr data-view-group data-index="${index + 100}" data-group="${goal.itemgroup}" data-office="${ofi.code}" data-month="${month}">
                        <th scope="row">${goal.itemgroup}</th>
                        <td>${goal.effectiveAmount ? goal.effectiveAmount : 0}</td>
                        <td>${goal.amount ? goal.amount : 0}</td>
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

            let monthGoals = "";

            ofi.month.forEach(mnt => {
                let color = mnt.month != month ? "btn-secondary" : "btn-success";
                let disabled = mnt.month != month ? "" : "disabled";
                let active = mnt.month != month ? "" : `data-comparation-active-${index + 100}`;

                monthGoals += `<button onclick="comparationMonthOffice(event)" ${disabled} ${active} data-index="${index + 100}" data-office="${office}" data-month="${mnt.month}" data-id="ALL" type="button" class="btn ${color} btn-sm mr-1 ml-1 ">${mnt.monthDesc}</button>`
            })

            document.querySelector('[data-goal-offices]').appendChild(View.office(ofi, goals, index + 100, revenueEffective, revenueExpected, month, monthGoals));
            gaugeChart(color, percent, 'Rendimiento %', index + 100)
            chart(ofi.days, ofi.salesPerDay, ofi.salesAmount, index + 100)
        })

        document.querySelector('[data-btn-goal-offices]').innerHTML = `Buscar`;
        document.querySelector('[data-btn-goal-offices]').disabled = false;


    } catch (error) {
        document.querySelector('[data-btn-goal-offices]').innerHTML = `Buscar`;
        document.querySelector('[data-btn-goal-offices]').disabled = false;

        console.log(error);
    }
}

document.querySelector('[data-search-goal-offices]').addEventListener('submit', searchOffice, false);

const comparationMonthOffice = async (event) => {

    const btn = event.target;

    const id = btn.getAttribute('data-id');
    const office = btn.getAttribute('data-office');
    const index = btn.getAttribute('data-index');

    document.querySelector(`[data-loading-comparation-${index}]`).innerHTML = `<br><div class="spinner-border text-primary mb-4" role="status"></div>`

    if (btn.matches(`[data-comparation-active-${index}]`)) {
        btn.removeAttribute(`data-comparation-active-${index}`);
        btn.classList.remove('btn-success');
        btn.classList.add('btn-secondary');
    } else {
        btn.setAttribute(`data-comparation-active-${index}`, '1')
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-success');
    }

    let btnsmonth = document.querySelectorAll(`[data-comparation-active-${index}]`)
    let months = Array.from(btnsmonth).map(el => `${el.getAttribute('data-month')}`);

    const goals = await Connection.noBody(`goalcomparations/${JSON.stringify(months.reverse())}/${office}/${id}`, 'GET');

    let color = [
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ];

    let background = [
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(255, 99, 132)',
        'rgb(201, 203, 207)'
    ];

    let dataset = [];

    document.querySelector(`#dataComparation${index}`).innerHTML = ""
    document.querySelector(`#dataComparation${index}`).innerHTML = `<thead>
    <tr data-thead1-comparation-${index}>
    <th></th>
    </tr>
    <tr data-thead2-comparation-${index}>
    </tr>
</thead>
    <tbody data-tbody-comparation-${index}>
    </tbody>`

    let groupsData = [];
    const obj = {}
    goals.forEach((goal, i) => {

        goal.goals.reduce(function (r, a) {
            groupsData[a[`itemgroup`]] = groupsData[a[`itemgroup`]] || [];
            groupsData[a[`itemgroup`]].push(a);

            return r;
        }, Object.create(obj));

        let month = goal.month.split('-');

        const label1 = `Ventas por dia - ${month[1]}/${month[0]}`;
        const label2 = `Montante de Ventas - ${month[1]}/${month[0]}`;

        dataset.push({
            type: 'bar',
            label: label1,
            data: goal.salesPerDay,
            fill: false,
            backgroundColor: background[i],
            borderColor: color[i],
            order: 2
        }, {
            type: 'line',
            label: label2,
            data: goal.salesAmount,
            borderWidth: 2,
            fill: false,
            backgroundColor: color[i],
            borderColor: background[i],
            tension: 0.2,
            order: 1
        });
    });

    groupsData = Object.keys(groupsData).map((key) => [key, groupsData[key]]);

    let dtView = groupsData.map(group => {
        let arr = group[1].map(gp => {
            return [
                gp.effectiveAmount ? gp.effectiveAmount : "",
                gp.amount
            ]
        });
        const newArr = Array.prototype.concat(group[0], ...arr);

        return newArr
    });

    dtView.forEach(dt => {
        let tr = document.createElement('tr');
        dt.forEach((t, ib) => {
            if (ib == 0) {
                tr.innerHTML += `<th scope="row">${t}</th>`
            } else {
                tr.innerHTML += `<td>${t}</td>`
            }
        });
        document.querySelector(`[data-tbody-comparation-${index}]`).appendChild(tr)
    })
    let days = goals[0].days.map(d => d.split('/')[0])
    let data = {
        labels: days,
        datasets: dataset
    };

    document.querySelector(`[data-div-comparation-${index}]`).innerHTML = "";
    document.querySelector(`[data-div-comparation-${index}]`).innerHTML = `<canvas class="flex d-inline" data-chart-comparation-${index}></canvas>`


    const ctxComparation = document.querySelector(`[data-chart-comparation-${index}]`);

    new Chart(ctxComparation, {
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

    let thGroup = document.createElement('th');
    thGroup.innerHTML = "Grupo";
    thGroup.rowSpan = "2";
    document.querySelector(`[data-thead2-comparation-${index}]`).appendChild(thGroup);

    months.forEach((mnth, im) => {
        let mt = mnth.split('-');

        let th = document.createElement('th');
        th.colSpan = "2";
        th.innerHTML = `${mt[1]}/${mt[0]}`;
        th.scope = "col";
        document.querySelector(`[data-thead1-comparation-${index}]`).appendChild(th);

        let th1 = document.createElement('th');
        th1.innerHTML = "Vendido";
        th1.style.backgroundColor = color[im]
        th1.scope = "col";
        document.querySelector(`[data-thead2-comparation-${index}]`).appendChild(th1);

        let th2 = document.createElement('th');
        th2.innerHTML = "Meta";
        th2.style.backgroundColor = color[im];
        th2.scope = "col";
        document.querySelector(`[data-thead2-comparation-${index}]`).appendChild(th2);
    });

    document.querySelector(`[data-loading-comparation-${index}]`).innerHTML = ""
};

window.comparationMonthOffice = comparationMonthOffice;

const listStock = async (event) => {
    let btn = event.target
    let expanded = btn.getAttribute('aria-expanded')
    let index = btn.getAttribute('data-index');

    $(`#collapseFinance${index}`).collapse('hide')
    $(`#collapseComparation${index}`).collapse('hide')

    if (expanded == "true") {
        if ($.fn.DataTable.isDataTable(`#dataStock${index}`)) {
            $(`#dataStock${index}`).dataTable().fnClearTable();
            $(`#dataStock${index}`).dataTable().fnDestroy();
            $(`#dataStock${index}`).empty();
        }
    } else {

        try {
            document.querySelector(`[data-loading-stock-${index}]`).style.display = 'block';

            if ($.fn.DataTable.isDataTable(`#dataStock${index}`)) {
                $(`#dataStock${index}`).dataTable().fnClearTable();
                $(`#dataStock${index}`).dataTable().fnDestroy();
                $(`#dataStock${index}`).empty();
            }

            let month = btn.getAttribute('data-month');
            let id = btn.getAttribute('data-id');
            let office = btn.getAttribute('data-office');

            const items = await Connection.noBody(`goalstock/${month}/${office}/${id}`, 'GET');

            let dtview = items.map(item => {
                let stockCity = item.stockCity ? item.stockCity : 0;
                let stockAnsa = item.stockAnsa ? item.stockAnsa : 0;

                return [
                    item.itemgroup,
                    item.itemcode,
                    item.itemname,
                    item.amount,
                    stockCity,
                    stockAnsa
                ]
            })

            $(`#dataStock${index}`).DataTable({
                data: dtview,
                columns: [
                    { title: "Grupo" },
                    { title: "Cod Articulo" },
                    { title: "Nombre" },
                    { title: "Meta" },
                    { title: "Cant Stock - Ciudad" },
                    { title: "Cant Stock - ANSA" },
                ],
                responsive: true,
                paging: true,
                ordering: false,
                info: true,
                scrollX: true,
                responsive: false,
                autoWidth: true,
                pagingType: "numbers",
                order: true,
                dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
                    "<'row'<'col-sm-12'B>>",
                buttons: [
                    'copy', 'csv', 'excel'
                ]
            })
            document.querySelector(`[data-loading-stock-${index}]`).style.display = 'none';
        } catch (error) {
            document.querySelector(`[data-loading-stock-${index}]`).style.display = 'none';
        }
    }
}

window.listStock = listStock;

const listStockOffice = async (event) => {
    let btn = event.target
    let expanded = btn.getAttribute('aria-expanded')
    let index = btn.getAttribute('data-index');

    $(`#collapseFinance${index}`).collapse('hide')
    $(`#collapseComparation${index}`).collapse('hide')

    if (expanded == "true") {
        if ($.fn.DataTable.isDataTable(`#dataStock${index}`)) {
            $(`#dataStock${index}`).dataTable().fnClearTable();
            $(`#dataStock${index}`).dataTable().fnDestroy();
            $(`#dataStock${index}`).empty();
        }
    } else {

        try {
            document.querySelector(`[data-loading-stock-${index}]`).style.display = 'block';

            if ($.fn.DataTable.isDataTable(`#dataStock${index}`)) {
                $(`#dataStock${index}`).dataTable().fnClearTable();
                $(`#dataStock${index}`).dataTable().fnDestroy();
                $(`#dataStock${index}`).empty();
            }

            let month = btn.getAttribute('data-month');
            let office = btn.getAttribute('data-office');

            const items = await Connection.noBody(`goalstock/${month}/${office}`, 'GET');

            let dtview = items.map(item => {
                let stockCity = item.stockCity ? item.stockCity : 0;
                let stockAnsa = item.stockAnsa ? item.stockAnsa : 0;

                return [
                    item.itemgroup,
                    item.itemcode,
                    item.itemname,
                    item.amount,
                    stockCity,
                    stockAnsa
                ]
            })

            $(`#dataStock${index}`).DataTable({
                data: dtview,
                columns: [
                    { title: "Grupo" },
                    { title: "Cod Articulo" },
                    { title: "Nombre" },
                    { title: "Meta" },
                    { title: "Cant Stock - Ciudad" },
                    { title: "Cant Stock - ANSA" },
                ],
                responsive: true,
                paging: true,
                ordering: false,
                info: true,
                scrollX: true,
                responsive: false,
                autoWidth: true,
                pagingType: "numbers",
                order: true,
                dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
                    "<'row'<'col-sm-12'B>>",
                buttons: [
                    'copy', 'csv', 'excel'
                ]
            })
            document.querySelector(`[data-loading-stock-${index}]`).style.display = 'none';
        } catch (error) {
            document.querySelector(`[data-loading-stock-${index}]`).style.display = 'none';
        }
    }
}

window.listStockOffice = listStockOffice;


const searchUnit = async (event) => {
    event.preventDefault();

    document.querySelector('[data-btn-goal-sellers]').innerHTML = ""

    const div = document.createElement('div')
    div.classList.add('spinner-border', 'spinner-border')

    document.querySelector('[data-btn-goal-sellers]').appendChild(div);
    document.querySelector('[data-btn-goal-sellers]').disabled = true;

    try {
        const office = event.currentTarget.office.value;
        const seller = event.currentTarget.seller.value;
        const month = event.currentTarget.month.value;

        const sellers = await Connection.noBody(`goalsalesman/${month}/${office}/${seller}`, 'GET')
        document.querySelector('[data-goal-users]').innerHTML = ""

        sellers.forEach((salesman, index) => {
            let goals = "";
            let allSale = 0;
            let allGoal = 0;

            if (salesman.amount.length > salesman.goals.length) {
                salesman.amount.forEach(amount => {

                    let goal = salesman.goals.find(goal => goal.itemgroup === amount.name);
                    let goalSeller = 0;

                    if (goal) {
                        allGoal += parseInt(goal.amount);
                        allSale += parseInt(amount.qty);
                        goalSeller = parseInt(goal.amount);
                    }

                    goals += `
                <tr data-view-group data-index="${index}" data-group="${amount.name}" data-office="${office}" data-month="${month}" data-id="${salesman.id_salesman}">
                    <th scope="row">${amount.name}</th>
                    <td>${amount.qty}</td>
                    <td>${goalSeller}</td>
                </tr>`;

                });
            } else {
                salesman.goals.forEach(goal => {

                    let amount = salesman.amount.find(amount => goal.itemgroup === amount.name);

                    if (amount) {
                        allGoal += parseInt(goal.amount);
                        allSale += parseInt(amount.qty);
                    }

                    goals += `
                <tr data-view-group data-index="${index}" data-group="${goal.itemgroup}" data-office="${office}" data-month="${month}" data-id="${salesman.id_salesman}">
                    <th scope="row">${goal.itemgroup}</th>
                    <td>${amount ? amount.qty : 0}</td>
                    <td>${goal.amount}</td>
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

            let monthGoals = "";

            salesman.month.forEach(mnt => {
                let color = mnt.month != month ? "btn-secondary" : "btn-success";
                let disabled = mnt.month != month ? "" : "disabled";
                let active = mnt.month != month ? "" : `data-comparation-active-${index}`;

                monthGoals += `<button onclick="comparationMonthOffice(event)" data-office="ALL" ${disabled} ${active} data-id="${salesman.id_salesman}" data-month="${mnt.month}" data-index="${index}" type="button" class="btn ${color} btn-sm mr-1 ml-1 ">${mnt.monthDesc}</button>`
            })

            document.querySelector('[data-goal-users]').appendChild(View.user(salesman, goals, index, month, monthGoals));
            chart(salesman.days, salesman.salesPerDay, salesman.salesAmount, index)
            gaugeChart(color, percent, 'Rendimiento %', index)

        });
        document.querySelector('[data-btn-goal-sellers]').innerHTML = `Buscar`;
        document.querySelector('[data-btn-goal-sellers]').disabled = false;

    } catch (error) {
        document.querySelector('[data-btn-goal-sellers]').innerHTML = `Buscar`;
        document.querySelector('[data-btn-goal-sellers]').disabled = false;

        console.log(error);
    }
}

document.querySelector('[data-search-goal-sellers]').addEventListener('submit', searchUnit, false)
const init = async () => {

    try {


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

        $('#goalOnline').modal("show");

    } catch (error) {

    }
}

document.querySelector('[button-goal-online]').addEventListener('click', goalOnline, false)



const searchGoalOnline = async (event) => {
    event.preventDefault();

    try {

        const listgroups = document.getElementById('ongroups')
        const group = listgroups.options[listgroups.selectedIndex].value;

        const listsellers = document.getElementById('onsellers')
        const salesman = JSON.parse(listsellers.options[listsellers.selectedIndex].value);

        const stock = document.querySelector('input[name="stock"]:checked').value;

        document.querySelector('[data-btn-online]').innerHTML = ""

        const div = document.createElement('div')
        div.classList.add('spinner-border', 'spinner-border')

        document.querySelector('[data-btn-online]').appendChild(div);
        document.querySelector('[data-btn-online]').disabled = true;

        await listGoals(salesman, group, stock);

        document.querySelector('[data-btn-online]').innerHTML = `<i class="fas fa-search"> Buscar</i>`;
        document.querySelector('[data-btn-online]').disabled = false;

    } catch (error) {
        document.querySelector('[data-btn-online]').innerHTML = `<i class="fas fa-search"> Buscar</i>`;
        document.querySelector('[data-btn-online]').disabled = false;
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

        document.querySelector(`#tablegoals`).innerHTML = ""

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

        $(document).ready(function () {
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
                scrollX: true,
                responsive: false,
                autoWidth: true,
                lengthMenu: [[200, 300, 400, 500], [200, 300, 400, 500]],
                pagingType: "numbers",
                order: true
            })
        });

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
    let file = fileName.split('.').pop();
    let types = ["xlsx", "xls", "xltx", "ods"]

    if (types.indexOf(file) > -1) {
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

        document.querySelector('[data-btn-upload]').innerHTML = ""

        const div = document.createElement('div')
        div.classList.add('spinner-border', 'spinner-border')

        document.querySelector('[data-btn-upload]').appendChild(div);
        document.querySelector('[data-btn-upload]').disabled = true;

        document.querySelector('[data-form-upload]').reset()

        const obj = await Connection.bodyMultipart('goalexcel', formData, 'POST')

        document.querySelector('[data-btn-upload]').innerHTML = `<i class="fas fa-file-excel"> Subir Excel</i></button>`;
        document.querySelector('[data-btn-upload]').disabled = false;

    } catch (error) {
        alert('Lo servicio seguira rodando en el servidor!')
    }
}

document.querySelector('[data-form-upload]').addEventListener('submit', uploadFile, false)
