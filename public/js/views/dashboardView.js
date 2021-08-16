



const showCardHistory = (cardHistory, history) => {
    cardHistory.innerHTML = ` <div class="col-xl-6 col-md-6 mb-4">
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
            <a href="#" data-history><i class="fas fa-calendar fa-2x text-gray-300"></i></a>
            </div>
        </div>
    </div>
</div>
</div>`

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
                    <a ondblclick="updateWebscraping(this)" href="#" ><i id="datahistory" class="fas fa-sync fa-2x text-gray-300"></i></a>
                </div>
            </div>
        </div>
    </div>`;

    cardHistory.appendChild(div)

}


export const ViewDashboard = {
    showCardHistory,
    showCardBd
}