


const lineaddgoal = (goal, index, id_salesman, disabled) => {

    const content = [
        `${goal.provider}`,
        `${goal.application}`,
        `${goal.itemcode}<a data-button="1"><i style="text-align: right; float: right; color: #8FBC8F;" class="fas fa-shopping-cart"></i></a>`,
        `${goal.itemname}`,
        `${goal.CityQty}`,
        `${goal.Qty}`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index}" data-date="${goal.d1}-01" name="goal" value="${goal.g1}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 1}" data-date="${goal.d2}-01" name="goal" value="${goal.g2}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 2}" data-date="${goal.d3}-01" name="goal" value="${goal.g3}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 3}" data-date="${goal.d4}-01" name="goal" value="${goal.g4}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 4}" data-date="${goal.d5}-01" name="goal" value="${goal.g5}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 5}" data-date="${goal.d6}-01" name="goal" value="${goal.g6}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 6}" data-date="${goal.d7}-01" name="goal" value="${goal.g7}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 7}" data-date="${goal.d8}-01" name="goal" value="${goal.g8}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 8}" data-date="${goal.d9}-01" name="goal" value="${goal.g9}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 9}" data-date="${goal.d10}-01" name="goal" value="${goal.g10}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 10}" data-date="${goal.d11}-01" name="goal" value="${goal.g11}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 11}" data-date="${goal.d12}-01" name="goal" value="${goal.g12}" type="number" class="form-control goal text-center">`,
        `<input ${disabled} data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 12}" data-date="${goal.d13}-01" name="goal" value="${goal.g13}" type="number" class="form-control goal text-center">`

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

const user = (salesman, goals, index) => {
    const div = document.createElement('div');

    div.innerHTML = `
    <div class="card shadow mb-4">
    <div class="card-body">
        <div class="form-row">
            <div class="form-group border col-md-8 ">
                <div class="form-row">
                    <div class="form-group col-md-10">
                        <h3>${salesman.name}</h3>
                    </div>
                    <div class="form-group col-md-7 text-center" data-div-chart-${index}>
                        <h5>Graficos</h5>
                        <canvas class="flex d-inline" data-chart-amount-${index}></canvas>
                    </div>
                    <div class="form-group col-md-5 text-center">
                        <h5>Grupos</h5>
                        <table id="tableGroups" class="table table-hover table-sm ">
                        <thead>
                        <th scope="col">Nombre</th>
                        <th scope="col">Cant</th>
                        <th scope="col">% Meta</th>
                        </thead>
                            <tbody>
                                ${goals}
                              </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="form-group border col-md-4">
                <div id="gaugeChart${index}" class="column"></div>
            </div>
        </div>
    </div>
</div>`

    return div;
}

export const View = {
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


