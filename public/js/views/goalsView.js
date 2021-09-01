const addGoals = () => {
  const div = document.createElement('div')

  const content = `
  <div class="container-fluid">
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <div class="col-md-12 text-left">
          <button onclick="listGoals(event)" type="button" class="btn btn-secondary">
              <i class="fas fa-chevron-left"></i> Volver a la lista
          </button>
          <button  data-toggle="modal" data-target="#searchGoal" type="button" class="btn btn-success">
              <i class="fas fa-search"></i> Nuevo Filtro
          </button>
      </div>
  </div>
  <div class="row gutters-sm">
      <div class="col-md-12">
          <div class="card">
              <div class="tab-pane">
                  <div class="form-group">
                      <div class="col-md-12 text-left">
                          <div class="text-center" id="loadinggoals"></div>
                          <div id="info" text-left">
                              <h5><strong>Información de la meta</strong></h5>
                              <ul class="list-group">
                                  <li>La meta debe ingresarse en la última columna llamada "cant".</li>
                                  <li>Para guardar la meta, presione la tecla "Enter", después del cual el sistema lo
                                      dirigirá a la siguiente línea.</li>
                                  <li>Use filtros de columna para ayudar con la tarea.</li>
                              </ul>
                          </div>
                          <table style="font-family: Calibri; font-size: 0.75em; letter-spacing: .1em;"
                              class="table table-bordered text-left" id="tablegoals" width="100%" cellspacing="0">
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>
</div>

  `
  div.innerHTML = content

  return div
}

const opcionesGoals = () => {
  const div = document.createElement('div')

  const content = `
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <div class="col-md-6 text-left">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Opciones
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a onclick="addGoalsList(event)" class="dropdown-item"><i class="fa fa-plus"></i> Fijar metas</a>
            </div>
        </div>
    </div>
</div>
  `
  div.innerHTML = content

  return div
}


const lineaddgoal = (goal, index, id_salesman) => {
  const content = [
    `${goal.provider}`,
    `${goal.application}`,
    `${goal.itemcode}<a data-button="1"><i style="text-align: right; float: right; color: #8FBC8F;" class="fas fa-shopping-cart"></i></a>`,
    `${goal.itemname}`,
    `${goal.CityQty}`,
    `${goal.Qty}`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index}" data-date="${goal.d1}-01" name="goal" value="${goal.g1}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 1}" data-date="${goal.d2}-01" name="goal" value="${goal.g2}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 2}" data-date="${goal.d3}-01" name="goal" value="${goal.g3}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 3}" data-date="${goal.d4}-01" name="goal" value="${goal.g4}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 4}" data-date="${goal.d5}-01" name="goal" value="${goal.g5}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 5}" data-date="${goal.d6}-01" name="goal" value="${goal.g6}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 6}" data-date="${goal.d7}-01" name="goal" value="${goal.g7}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 7}" data-date="${goal.d8}-01" name="goal" value="${goal.g8}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 8}" data-date="${goal.d9}-01" name="goal" value="${goal.g9}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 9}" data-date="${goal.d10}-01" name="goal" value="${goal.g10}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 10}" data-date="${goal.d11}-01" name="goal" value="${goal.g11}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 11}" data-date="${goal.d12}-01" name="goal" value="${goal.g12}" type="number" class="form-control goal text-center">`,
    `<input data-itemcode="${goal.itemcode}" data-id_salesman="${id_salesman}" tabindex="${index + 12}" data-date="${goal.d13}-01" name="goal" value="${goal.g13}" type="number" class="form-control goal text-center">`

  ]

  return content
}

const listGroups = (group) => {

  const option = document.createElement('option')

  const content = `${group.Name}</option>`

  option.value = group.Name

  option.innerHTML = content

  return option
}


const listSalesman = (salesman) => {

  const option = document.createElement('option')

  const content = `${salesman.name}</option>`

  option.value = `{"id_salesman": ${salesman.id_salesman}, "office": "${salesman.office}"}` 

  option.innerHTML = content

  return option
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
  <div class="modal fade" id="searchGoal" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Filtrar la Meta</h5>
              <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">x</span>
              </button>
          </div>
          <form>
              <div class="modal-body">
              <div class="form-group text-center col-md-12 d-none d-md-block">
              <h8>Buscar Articulos sin stock?</h8>
              <div class="form-check">
                  <input class="form-check-input" type="radio" name="stock" id="stocksi" value="1">
                  <label class="form-check-label" for="stocksi">
                      Sí
                  </label>
              </div>
              <div class="form-check">
                  <input class="form-check-input" type="radio" name="stock" id="stockno" value="2" checked>
                  <label class="form-check-label" for="stockno">
                      No
                  </label>
              </div>
          </div>
          <hr>
          <div class="form-group text-center col-md-12 d-none d-md-block">
              <h8>Vendedor</h8>
              <select id="listsellers" class="form-control">
                  <option disabled selected></option>
      
              </select>
          </div>
          <div class="form-group text-center col-md-12 d-none d-md-block">
              <h8>Grupo del Articulo</h8>
              <select id="listgroups" class="form-control">
                  <option disabled selected></option>
              </select>
          </div>
              </div>
              <div class="modal-footer">
                  <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                  <button type="submit" onclick="listGoalsSalesman(event)" class="btn btn-info"><i class="fas fa-plus"> Buscar</i></button>   
              </div>
          </form>
      </div>
  </div>
  </div>
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
        <div class="card text-grey bg-secondary">
            <div class="card-header text-white bg-secondary">
                <div class="text-xl font-weight-bold text-uppercase mb-1">Meta por Vendedores</div>
            </div>
            <div class="card-body text-left">
                <div class="row no-gutters align-items-left">
                    <div class="col mr-2">
                        <div id="goalsshow"></div>
                        <div class="col-auto text-white">
                            Cumplimiento de objetivos para los próximos 12 meses
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card text-grey bg-secondary">
            <div class="card-header text-white bg-secondary">
                <div class="text-xl font-weight-bold text-uppercase mb-1">Facturacion Prevista</div>
            </div>
            <div class="card-body text-left">
                <div class="row no-gutters align-items-left">
                    <div class="col mr-2">
                        <div class="col-auto text-white">
                        En desarrollo
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
    if(goal.percentage < 25) classprogress = 'bg-danger'
    if(goal.percentage >= 25 && goal.percentage < 50) classprogress = 'bg-warning'
    if(goal.percentage >= 50 && goal.percentage < 75) classprogress = 'bg-info'
    if(goal.percentage >= 75 && goal.percentage < 100) classprogress = 'bg-success'


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
      <div class="form-group col-md-4 text-center text-white">
      Expectativa total: ${goal.goalssum}
      </div>
    </div></a>`;

    return div

}

const progress = (goal) => {
    let div = document.createElement('div');

    let classprogress
    if(goal.percentage < 25) classprogress = 'bg-danger'
    if(goal.percentage >= 25 && goal.percentage < 50) classprogress = 'bg-warning'
    if(goal.percentage >= 50 && goal.percentage < 75) classprogress = 'bg-info'
    if(goal.percentage >= 75 && goal.percentage < 100) classprogress = 'bg-success'

    div.className = "col-md-12"

    div.style="background-color: rgb(90 159 236);"

    div.innerHTML = ` 
    <div style="padding-top: 0.3rem;" class="form-row align-items-center">
       <div class="form-group col-md-4">
           <a><h8>${goal.itemgroup}</h8></a>
       </div>
       <div class="form-group align-items-center col-md-4">
          <div class="progress">
              <div style="color:#000000;" class="progress-bar ${classprogress}" role="progressbar" style="width: ${goal.percentage}%;" aria-valuenow="${goal.percentage}" aria-valuemin="0" aria-valuemax="100">${goal.percentage}%</div>
          </div>
      </div>   
      <div class="form-group col-md-4 text-center text-white">
      Expectativa total: ${goal.goalssum}
      </div>     
    </div>`;

    return div

}

export const View = {
  addGoals,
  opcionesGoals,
  lineaddgoal,
  listSalesman,
  listDate,
  listGroups,
  modalAdd,
  progress,
  sellers,
  showGoals
}


