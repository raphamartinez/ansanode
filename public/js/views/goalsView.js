const addGoals = () => {
  const div = document.createElement('div')

  const content = `
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <div class="col-md-12 text-left">
    <button onclick="listGoals(event)" type="button" class="btn btn-secondary">
    <i class="fas fa-chevron-left"></i> Volver a la lista
</button>
    </div>
</div>

<div class="container-fluid">
<div class="row gutters-sm">
  <div class="col-md-2 d-none d-md-block">
    <div class="card">
      <div class="card-body">
        <nav id="listsellers" class="nav flex-column text-left nav-pills nav-gap-y-1">
        <a data-toggle="tab" class="nav-item nav-link has-icon nav-link-faded active">Vendedores</a>
        </nav>
      </div>
    </div>
  </div>
  <div class="col-md-8">
    <div class="card">
        <div class="tab-pane">
          <div class="form-group">
          <table class="table table-bordered" id="tablegoals" style="display: block !important; padding: 0 !important; margin: 0 !important; border: 0 !important; width: 100% !important; border-radius: 0 !important; line-height: 1 !important;"></table>
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
    <div class="col-md-12 text-left">
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
    `${goal.date}`,
    `${goal.itemgroup}`,
    `${goal.provider}`,
    `${goal.application}`,
    `${goal.labelcode}`,
    `${goal.labelname}`,
    `<input data-id_goalline="${goal.id_goalline}" data-id_salesman="${id_salesman}" name="goal" tabindex="${index}" value="${goal.amount}" type="number" class="form-control goal text-center">`
  ]

  return content
}




const listSalesman = (salesman) => {
  const div = document.createElement('div')

  const content = `<a href="#" data-toggle="tab" onclick="listGoalsSalesman(event)" data-id_salesman="${salesman.id_salesman}" data-office="${salesman.office}" class="nav-item nav-link has-icon nav-link-faded listersaleman">
  ${salesman.name}
  </a>`

  div.innerHTML = content

  return div
}


export const View = {
  addGoals,
  opcionesGoals,
  lineaddgoal,
  listSalesman
}