const showSales = (sale) => {
    const content = [
        `${sale.SerNr}`,
        `${sale.date}`,
        `${sale.SalesMan}`,
        `${sale.CustCode}`,
        `${sale.CustName}`,
        `${sale.ArtCode}`,
        `${sale.Name}`,
        `${sale.Labels}`,
        `${sale.Qty}`,
        `${sale.Currency}`,
        `${sale.RowNet}`,
        `${sale.subtotalUsd}`,
        `${sale.totalUsd}`,
    ]

    return content
}

const modalsearch = () => {
    const div = document.createElement('div')

    const content = `
    <div class="modal fade" id="searchSalesOrder" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Listado de Orden de Ventas</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <select multiple title="Sucursal" class="selectpicker" name="selectoffice" id="selectoffice" required>
                            </select>
                        </div> 
                        <div class="form-group col-md-6">
                            <select multiple title="Vendedores" class="selectpicker" name="selectsellers" id="selectsellers" required>
                            </select>
                        </div> 
                        <div class="form-group col-md-12 text-center">
                        <h6>Período</h6> 
                        </div> 
                        <div class="form-group col-md-6 text-center"> 
                        <h6>Fecha Inicial</h6> 
                        <input class="form-control datepicker" type="date" name="datestart" id="datestart">
                    </div> 
                    <div class="form-group col-md-6 text-center">
                    <h6>Fecha Final</h6> 
                    <input class="form-control datepicker" type="date" name="dateend" id="dateend">
                    </div> 
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" onclick="listSales(event)" class="btn btn-success"><i class="fas fa-search"> Buscar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>
`
    div.innerHTML = content

    return div
}

const optionSeller = (salesman) => {
    const line = document.createElement('option')

    line.value = salesman.code

    const content = `${salesman.code} - ${salesman.name}</option>`
    
    line.innerHTML = content

    return line
}

const optionOffice = (office) => {
    const line = document.createElement('option')

    line.value = office.code

    const content = ` ${office.name}</option>`

    line.innerHTML = content

    return line
}

const buttonsearch = () => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-10 text-left">
            <button type="button" data-toggle="modal" data-target="#searchSalesOrder" class="btn btn-success">
            Nueva Consulta
            </button>
        </div>
        <div class="col-md-2 text-right">
            <div style="background: #6a6767c2;" class="col-md-12 h4 card card-shadow shadow-lg rounded text-white text-center">
            <div id="cardamount" class="card-body h5">Monto USD</div>
            </div>
        </div>
    </div>`

    divbtn.innerHTML = content
    
    return divbtn
}

export const ViewSales = {
    showSales,
    modalsearch,
    optionSeller,
    optionOffice,
    buttonsearch
}