



const showCardHistory = (cardHistory, history) => {
    let div = document.createElement('div');

    div.className = "col-xl-6 col-md-6 mb-4"

    div.innerHTML = ` 
<div class="card border-left-primary shadow h-100 py-2">
    <div class="card-body">
        <div class="row no-gutters align-items-center">
            <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                Historial de Acceso
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">En las ultimas 24 horas hubo ${history.count.count} accesos</div>
                <div class="h8 mb-0 font-weight-bold text-gray-600">El último acceso fue ${history.lastAccess.name} a ${history.lastAccess.time}</div>
            </div>
            <div class="col-auto">
            <a href="#" data-history><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
</svg></a>
            </div>
        </div>
    </div>
</div>
`

cardHistory.appendChild(div)
}

const showCardBd = (cardHistory, lastupdate) => {
    let div = document.createElement('div');

    div.className = "col-xl-6 col-md-6 mb-4"

    div.innerHTML = ` 
    <div class="card border-left-info shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Actualización Datos Ansa
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="lastupdate">Última actualización - ${lastupdate}</div>
                    <div class="h8 mb-0 font-weight-bold text-gray-600">Doble clic en el símbolo para actualizar de nuevo</div>
                </div>
                <div class="col-auto">
                    <a ondblclick="updateWebscraping(this)" href="#" ><svg id="datahistory" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                  </svg></a>
                </div>
            </div>
        </div>
    </div>`;

    cardHistory.appendChild(div)

}

const showGoals = () => {
    let div = document.createElement('div');

    div.className = "col-xl-12 col-md-12 mb-4"

    div.innerHTML = ` 
    <hr>
    <div style="background-color:#e4e6ff;" class="card border-bottom-secondary shadow h-100 py-2">
        <div class="card-body text-center">
                    <h4>
                    Metas para Vendedores
                    </h4>
                    <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                    <div id="goaldashboard"></div>
                    <div class="h8 mb-0 font-weight-bold text-gray-600"></div>
                </div>
                <div class="col-auto">
                </div>
            </div>
        </div>
    </div>`;

    return div

}

const sellers = (goal) => {
    let div = document.createElement('div');

    let classprogress
    if(goal.percentage < 25) classprogress = 'bg-danger'
    if(goal.percentage >= 25 && goal.percentage < 50) classprogress = 'bg-warning'
    if(goal.percentage >= 50 && goal.percentage < 75) classprogress = 'bg-info'
    if(goal.percentage >= 75 && goal.percentage < 100) classprogress = 'bg-success'


    div.className = "col-xl-12 col-md-12 mb-4"

    div.innerHTML = ` 
    <a onclick="listGoalSalesmanId(event)" data-id_salesman="${goal.id_salesman}">
    <div  class="form-row">
       <div class="form-group col-md-6">
           <h8><strong>${goal.name}</strong> - Cumplimiento de objetivos para los próximos 12 meses</h8>
       </div>
       <div class="form-group col-md-6">
          <div class="progress">
              <div style="color:#000000;" class="progress-bar ${classprogress}" role="progressbar" style="width: ${goal.percentage}%;" aria-valuenow="${goal.percentage}" aria-valuemin="0" aria-valuemax="100">${goal.percentage}%</div>
          </div>
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

    div.style="background-color: #c4cbff;"

    div.innerHTML = ` 
    <div style="padding-top: 0.3rem;" class="form-row align-items-center">
       <div class="form-group col-md-6">
           <a><h8>${goal.date}</h8></a>
       </div>
       <div class="form-group align-items-center col-md-6">
          <div class="progress">
              <div style="color:#000000;" class="progress-bar ${classprogress}" role="progressbar" style="width: ${goal.percentage}%;" aria-valuenow="${goal.percentage}" aria-valuemin="0" aria-valuemax="100">${goal.percentage}%</div>
          </div>
      </div>        
    </div>`;

    return div

}

export const ViewDashboard = {
    showCardHistory,
    showCardBd,
    showGoals,
    progress,
    sellers
}