const addGoals = () => {
  const div = document.createElement('div')
  let today = new Date()

  let month = today.getMonth() + 1
  let year = today.getFullYear()

  if (month <= 9) {
    month = `0${month}`
  }

  const content = `
  <div class="container-fluid">
  <div class="d-sm-flex align-items-center justify-content-between mb-4" >
    <div class="col-md-12 text-left">
      <button onclick="listGoals(event)" type="button" class="btn btn-secondary">
        <i class="fas fa-chevron-left"></i> Volver a la lista
      </button>
    </div>
  </div >
    <div class="row gutters-sm">
    <div class="col-md-2">
    <hr>
    <div class="form-group text-center col-md-12 d-none d-md-block">
    <h8>Buscar Articulos sin stock?</h8>
    <div class="form-check">
    <input class="form-check-input" type="radio" name="stock" id="stocksi" value="1" checked>
    <label class="form-check-label" for="stocksi">
    Sí
    </label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="stock" id="stockno" value="2">
    <label class="form-check-label" for="stockno">
    No
    </label>
  </div>
</div>
<hr>
    <div class="form-group text-center col-md-12 d-none d-md-block">
    <h8>Fecha de la Meta</h8>
    <select id="listdate" class="form-control">
    <option disabled selected></option>
</select>
</div>
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
<hr>
<div class="form-group text-center col-md-12 d-none d-md-block">
<button onclick="listGoalsSalesman(event)" type="button" class="btn btn-info btn-lg btn-block">Buscar</button>
</div>
</div>
      <div class="col-md-10">
        <div class="card">
          <div class="tab-pane">
            <div class="form-group">
              <div class="col-md-12 text-left">
                <div class="text-center" id="loadinggoals"></div>
                <div id="info" text-left">
                <h5><strong>Información de la meta</strong></h5>
                <ul class="list-group">
  <li>La meta debe ingresarse en la última columna llamada "cant".</li>
  <li>Para guardar la meta, presione la tecla "Enter", después de lo cual el sistema lo dirigirá a la siguiente línea.</li>
  <li>Use filtros de columna para ayudar con la tarea.</li>
</ul>
</div>
                <table style="font-family: Calibri; font-size: 0.75em; letter-spacing: .1em;" class="table table-bordered text-left" id="tablegoals"  width="100%" cellspacing="0"></table>
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
    `${goal.itemcode}<a data-button="1" ><i style="text-align: right; float: right; color: #8FBC8F;" class="fas fa-shopping-cart"></i></a>`,
    `${goal.itemname}`,
    `${goal.CityQty}`,
    `${goal.Qty}`,
    `<input data-id_goalline="${goal.id_goalline}" data-id_salesman="${id_salesman}" name="goal" tabindex="${index}" value="${goal.amount}" type="number" class="form-control goal text-center">`
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

  option.value = salesman.id_salesman

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


export const View = {
  addGoals,
  opcionesGoals,
  lineaddgoal,
  listSalesman,
  listDate,
  listGroups
}


