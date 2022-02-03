


const lineaddgoal = (goal, index, salesman, disabled) => {

    const content = [
        `${goal.provider}`,
        `${goal.application}`,
        `${goal.itemcode}<a data-button="1"><i style="text-align: right; float: right; color: #8FBC8F;" class="fas fa-shopping-cart"></i></a>`,
        `${goal.itemname}`,
        `${goal.CityQty}`,
        `${goal.Qty}`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index}" data-date="${goal.d1}-01" name="goal" value="${goal.g1}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 1}" data-date="${goal.d2}-01" name="goal" value="${goal.g2}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 2}" data-date="${goal.d3}-01" name="goal" value="${goal.g3}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 3}" data-date="${goal.d4}-01" name="goal" value="${goal.g4}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 4}" data-date="${goal.d5}-01" name="goal" value="${goal.g5}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 5}" data-date="${goal.d6}-01" name="goal" value="${goal.g6}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 6}" data-date="${goal.d7}-01" name="goal" value="${goal.g7}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 7}" data-date="${goal.d8}-01" name="goal" value="${goal.g8}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 8}" data-date="${goal.d9}-01" name="goal" value="${goal.g9}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 9}" data-date="${goal.d10}-01" name="goal" value="${goal.g10}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 10}" data-date="${goal.d11}-01" name="goal" value="${goal.g11}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 11}" data-date="${goal.d12}-01" name="goal" value="${goal.g12}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${salesman}" tabindex="${index + 12}" data-date="${goal.d13}-01" name="goal" value="${goal.g13}" type="number" class="form-control goal text-center">`

    ]

    return content
}

const listDate = (datesql, date) => {
    const option = document.createElement('option')

    const content = `${date}</option>`

    option.value = datesql

    option.innerHTML = content

    return option
}

const modalAdd = () => {
    const div = document.createElement('div')

    const content = `
  
`
    div.innerHTML = content

    return div
}




const showGoals = () => {
    let div = document.createElement('div');

    div.className = "col-xl-12 col-md-12 mb-4"

    div.innerHTML = ` 
    <div class="form-row col-md-12">
    <div class="col-md-6">
        <div class="card text-grey bg-light">
            <div class="card-header bg-light">
                <div class="text-xl font-weight-bold text-uppercase mb-1">Meta por Vendedores</div>
            </div>
            <div class="card-body text-left">
                <div class="row no-gutters align-items-left">
                    <div class="col mr-2">
                        <div id="goalsshow"></div>
                        <div class="col-auto text-grey">
                            Cumplimiento de objetivos para los próximos 12 meses
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card text-grey bg-light">
            <div class="card-header bg-light">
                <div class="text-xl font-weight-bold text-uppercase mb-1">Facturacion Prevista</div>
            </div>
            <div class="card-body text-left">
                <div class="row no-gutters align-items-left">
                    <div class="col mr-2">
                    <div id="expectedsshow"></div>
                        <div class="col-auto text-grey">
                        La expectativa de facturación se basa en el objetivo para los próximos 12 meses, los valores pueden cambiar según la variación en los precios de los artículos.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

    return div

}

const sellers = (goal) => {
    let div = document.createElement('div');

    let classprogress
    if (goal.percentage < 25) classprogress = 'bg-danger'
    if (goal.percentage >= 25 && goal.percentage < 50) classprogress = 'bg-warning'
    if (goal.percentage >= 50 && goal.percentage < 75) classprogress = 'bg-info'
    if (goal.percentage >= 75 && goal.percentage < 100) classprogress = 'bg-success'


    div.className = "col-md-12 mb-2"

    div.innerHTML = ` 
    <a onclick="listGoalSalesmanId(event)" data-id_salesman="${goal.id_salesman}">
    <div  class="form-row">
       <div class="form-group text-left col-md-4">
           <p><strong>${goal.name}</strong><p>
       </div>
       <div class="form-group col-md-4">
          <div class="progress">
              <div style="color:#000000;" class="progress-bar progress-bar-striped ${classprogress}" role="progressbar" style="width: ${goal.percentage}%;" aria-valuenow="${goal.percentage}" aria-valuemin="0" aria-valuemax="100">${goal.percentage}%</div>
          </div>
      </div>   
      <div class="form-group col-md-4 text-left">
      Expectativa total: <strong> ${goal.goalssum} </strong>
      </div>
    </div></a>`;

    return div

}

const progress = (goal) => {
    let div = document.createElement('div');

    let classprogress
    if (goal.percentage < 25) classprogress = 'bg-danger'
    if (goal.percentage >= 25 && goal.percentage < 50) classprogress = 'bg-warning'
    if (goal.percentage >= 50 && goal.percentage < 75) classprogress = 'bg-info'
    if (goal.percentage >= 75 && goal.percentage < 100) classprogress = 'bg-success'

    div.className = "col-md-12"

    div.innerHTML = ` 
    <div  class="form-row align-items-center">
       <div class="form-group col-md-4">
           <a><h8>${goal.itemgroup}</h8></a>
       </div>
       <div class="form-group align-items-center col-md-4">
          <div class="progress">
              <div style="color:#000000;" class="progress-bar ${classprogress}" role="progressbar" style="width: ${goal.percentage}%;" aria-valuenow="${goal.percentage}" aria-valuemin="0" aria-valuemax="100">${goal.percentage}%</div>
          </div>
      </div>   
      <div class="form-group col-md-4 text-left">
      Expectativa total: <strong> ${goal.goalssum} </strong>
      </div>     
    </div>`;

    return div

}

const expecteds = (expected) => {
    let div = document.createElement('div');

    div.className = "col-md-12 mb-2"

    div.innerHTML = ` 
    <a onclick="listExpectedSalesmanId(event)" data-id_salesman="${expected.id_salesman}" data-type="1">
    <div  class="form-row">
       <div class="form-group text-left col-md-6">
           <p><strong>${expected.name}</strong><p>
       </div>  
      <div class="form-group col-md-6 text-left">
      Expectativa de facturación: <strong style="color: #00FF00;">${expected.expected}</strong>
      </div>
      <div class="col-md-12 expecteds"></div>
    </div></a>`;

    return div

}

const expectedsMonth = (expected) => {
    let div = document.createElement('div');

    div.className = "col-md-12 collapsed"

    div.innerHTML = ` 
    <a onclick="listExpectedSalesmanMonth(event)" data-id_salesman="${expected.id_salesman}" data-date="${expected.datesql}">
    <div  class="form-row">
       <div class="form-group text-center col-md-4">
           <p><strong>${expected.date}</strong><p>
       </div>  
      <div class="form-group col-md-8 text-left">
      Expectativa de facturación: <strong style="color: #00FF00;">${expected.expected}</strong>
      </div>
      <div class="col-md-12 expectedsMonth"><div  class="form-row"></div></div>
    </div></a>`;

    return div

}

const expectedsGroups = (expected) => {
    let div = document.createElement('div');

    div.className = "col-md-12 collapsed"
    div.style = "background-color: rgba(90, 159, 236, .4); padding-top: 0.3rem;"

    div.innerHTML = ` 
    <a onclick="listExpectedSalesmanMonth(event)" data-id_salesman="${expected.id_salesman}" data-date="${expected.datesql}" data-group="${expected.group}">
    <div class="form-row">
       <div class="form-group text-center align-items-center col-md-4">
           <p><strong>${expected.itemgroup}</strong><p>
       </div>  
      <div class="form-group align-items-center col-md-8 text-left text-white">
      Expectativa de facturación: <strong style="color: #00FF00;">${expected.expected}</strong>
      </div>
    </div></a>`;

    return div

}

const user = (salesman, goals, index, month, monthGoals) => {
    const div = document.createElement('div');

    div.innerHTML = `
    <div class="card shadow mb-4">
    <div class="card-body">
        <div class="form-row">
            <div class="form-group border col-md-12 col-xl-9">
                <div class="form-row">
                    <div class="form-group col-md-10">
                        <h3>${salesman.name}</h3>
                    </div>
                    <div class="form-group col-md-7 text-center" data-div-chart-${index}>
                        <h5>Graficos</h5>
                        <canvas class="flex d-inline" data-chart-amount-${index}></canvas>
                    </div>
                    <div class="form-group col-md-5 text-center table-responsive">
                        <h5>Grupos</h5>
                        <table id="tableGroups" class="table table-sm table-hover">
                        <thead>
                        <th scope="col">Nombre</th>
                        <th scope="col">Vendido</th>
                        <th scope="col">Vendido Meta</th>
                        <th scope="col">Meta</th>
                        </thead>
                            <tbody>
                                ${goals}
                              </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="form-group border col-md-12 col-xl-3">
                <div id="gaugeChart${index}" class="column"></div>
            </div>
        </div>
    </div>

    <div class="collapse" id="collapseFinance${index}">
        <div class="card card-body">
            <table class="table table-bordered text-center" id="dataFinance${index}" width="100%" cellspacing="0"></table>
        </div>
    </div>

    <ul class="list-group text-center list-group-flush">
        <li class="list-group-item">
            <button data-btn-goal-stock-${index} onclick="listStock(event)" data-month="${month}" data-office="${salesman.office}" data-id="${salesman.id_salesman}" data-index="${index}" type="button" data-toggle="collapse" data-target="#collapseStock${index}" class="btn btn-info">Stock</button>
            <button type="button" data-toggle="collapse" data-target="#collapseComparation${index}" class="btn btn-secondary">Comparar con Metas anteriores</button>
        </li>
    </ul>

    <div class="collapse" id="collapseStock${index}">
        <div class="card card-body">
            <div class="col-md-12">
                <div data-loading-stock-${index} class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        <table class="table table-bordered" id="dataStock${index}" width="100%" cellspacing="0"></table>
        </div>
    </div>

    <div class="collapse" id="collapseComparation${index}">
    <div class="card card-body text-center">
        <div class="col-md-12 text-center">
            <hr>
            <p>Seleccione los meses que quiera comparar</p>
            ${monthGoals}
            <div data-loading-comparation-${index}></div>
            <br>
            <div data-div-comparation-${index}></div>
            <table class="table table-bordered" id="dataComparation${index}">
        <thead>
            <tr data-thead1-comparation-${index}>
            <th></th>
            </tr>
            <tr data-thead2-comparation-${index}>
            </tr>
        </thead>
            <tbody data-tbody-comparation-${index}>
            </tbody>
        </table>
        </div>
     </div>
</div>

</div>
`

    return div;
}

const office = (office, goals, index, revenueEffective, revenueExpected, month, monthGoals) => {
    const div = document.createElement('div');

    div.innerHTML = `
    <div class="card shadow mb-4">
    <div class="card-body">
        <div class="form-row">
            <div class="form-group border col-md-12 col-xl-9">
                <div class="form-row">
                    <div class="form-group col-md-10">
                        <h3>${office.name}</h3>
                    </div>
                    <div class="form-group col-md-7 text-center" data-div-chart-${index}>
                        <h5>Graficos</h5>
                        <canvas class="flex d-inline" data-chart-amount-${index}></canvas>
                    </div>
                    <div class="form-group col-md-5 text-center table-responsive">
                        <h5>Grupos</h5>
                        <table id="tableGroupsOffice" class="table table-sm table-hover">
                        <thead>
                        <th scope="col">Nombre</th>
                        <th scope="col">Vendido</th>
                        <th scope="col">Vendido Meta</th>
                        <th scope="col">Meta</th>
                        </thead>
                            <tbody>
                                ${goals}
                              </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="form-group border col-md-12 col-xl-3 text-center">
                <div id="gaugeChart${index}" class="column"></div>
                <div class="text-center">
                    <h1 data-revenue-effective${index} class="h5 font-weight-bold text-info"> Facturación Realizada: ${revenueEffective.toLocaleString("en-US", { style: "currency", currency: "USD" })} </h1>
                </div>
                <div class="text-center">
                    <h1 data-revenue-expected${index} class="h5 font-weight-bold text-success"> Facturación Prevista: ${revenueExpected.toLocaleString("en-US", { style: "currency", currency: "USD" })} </h1>
                </div>
            </div>
        </div>
    </div>
    <ul class="list-group text-center list-group-flush">
    <li class="list-group-item">
    <button data-btn-goal-stock-${index} onclick="listStockOffice(event)" data-office="${office.code}" data-month="${month}" data-index="${index}" type="button" data-toggle="collapse" data-target="#collapseStock${index}" class="btn btn-info">Stock</button>
    <button type="button" data-toggle="collapse" data-target="#collapseComparation${index}" class="btn btn-secondary">Comparar con Metas anteriores</button>
    </li>
  </ul>

  <div class="collapse" id="collapseStock${index}">
  <div class="card card-body">
  <div class="col-md-12">
  <div data-loading-stock-${index} class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
  </div>
  </div>
  <table class="table table-bordered" id="dataStock${index}" width="100%" cellspacing="0"></table>
  </div>
</div>

<div class="collapse" id="collapseFinance${index}">
<div class="card card-body">
<table class="table table-bordered text-center" id="dataFinance${index}" width="100%" cellspacing="0"></table>
</div>
</div>

<div class="collapse" id="collapseComparation${index}">
    <div class="card card-body text-center">
        <div class="col-md-12 text-center">
            <hr>
            <h5>Comparacion</h5>
            <p>Seleccione los meses que quiera comparar</p>
            <div data-loading-comparation-${index}></div>
            ${monthGoals}
            <br>
            <div data-div-comparation-${index}></div>
            <table class="table table-bordered" id="dataComparation${index}">
            <thead>
                <tr data-thead1-comparation-${index}>
                <th></th>
                </tr>
                <tr data-thead2-comparation-${index}>
                </tr>
            </thead>
                <tbody data-tbody-comparation-${index}>
                </tbody>
            </table>
        </div>
    </div>
</div>

</div>
</div>
</div>`

    return div;
}

export const View = {
    office,
    user,
    lineaddgoal,
    listDate,
    modalAdd,
    progress,
    sellers,
    showGoals,
    expecteds,
    expectedsMonth,
    expectedsGroups
}


