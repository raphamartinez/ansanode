



const history = (history) => {
    let div = document.createElement('div');

    div.className = "";

    div.innerHTML = ` 

`;

 return div;
};

const database = (cardHistory, lastupdate) => {
    let div = document.createElement('div');

    div.className = "col-xl-6 col-md-6 mb-4"

    div.innerHTML = ` 
`;

    cardHistory.appendChild(div)

}

const goals = () => {
    let div = document.createElement('div');

    div.className = "col-md-6 mb-4"

    div.innerHTML = ` 
    <hr>
    <div class="card text-grey bg-light">
    <div class="card-header bg-light">
    <div class="text-xl font-weight-bold text-uppercase mb-1">Meta por Vendedores</div>
    </div>
        <div class="card-body text-left">
                    <div class="row no-gutters align-items-left">
                    <div class="col mr-2">
                    <div id="goaldashboard"></div>
                    <div class="col-auto text-grey">
                    Cumplimiento de objetivos para los próximos 12 meses
                    </div>
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
      <div class="form-group col-md-4 text-center">
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

    div.style="background-color: rgba(90, 159, 236, .1); "

    div.innerHTML = ` 
    <div style="padding-top: 0.3rem;" class="form-row align-items-center">
       <div class="form-group text-center col-md-4">
           <a><h8><strong>${goal.itemgroup}</strong></h8></a>
       </div>
       <div class="form-group text-center align-items-center col-md-4">
          <div class="progress">
              <div style="color:#000000;" class="progress-bar ${classprogress}" role="progressbar" style="width: ${goal.percentage}%;" aria-valuenow="${goal.percentage}" aria-valuemin="0" aria-valuemax="100">${goal.percentage}%</div>
          </div>
      </div>   
      <div class="form-group text-center col-md-4 text-left ">
      Expectativa total: <strong> ${goal.goalssum} </strong>
      </div>     
    </div>`;

    return div

}

export const View = {
    history,
    database,
    goals,
    progress,
    sellers
}