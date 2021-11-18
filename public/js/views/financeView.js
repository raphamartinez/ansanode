const modalsearch = () => {
    const div = document.createElement('div')

    const content = `
    <div class="modal fade" id="searchfinance" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Listado de Cobranza</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                    <div class="form-group border col-md-12 text-center">
                    <label for="exampleFormControlInput1" class="d-block form-label">Tipo</label>
                    <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type" id="type1" value="1" checked>
                    <label class="form-check-label" for="type1">Facturas</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type" id="type2" value="2">
                    <label class="form-check-label" for="type2">Cheques</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type" id="type3" value="3">
                    <label class="form-check-label" for="type3">Ambos</label>
                  </div>
                        </div> 
                        <div class="form-group col-md-12">
                            <select multiple title="Sucursal" class="selectpicker form-control" name="selectoffice" id="selectoffice" required>
                            </select>
                        </div> 
                        
                        <div class="select-pure col-md-12 mb-2">
                        </div> 

                        <div class="form-group text-center col-md-12">
                            <h8>Buscar apenas clientes com facturas vencidas?</h8>
                            <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="overdue" id="overdueyes" value="1" checked>
                                    <label class="form-check-label" for="overdueyes">
                                     Sí
                                     </label>
                             </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="overdue" id="overdueno" value="2">
                            <label class="form-check-label" for="overdueno">
                                No
                            </label>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" onclick="searchFinance(event)" class="btn btn-success"><i class="fas fa-search"> Buscar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>
`
    div.innerHTML = content

    return div
}

const listClients = (client) => {
    const line = document.createElement('option')

    line.value = client.CustCode

    const content = ` ${client.CustName}</option>`

    line.innerHTML = content

    return line
}

const listOffice = (office) => {
    const line = document.createElement('option')

    line.value = office.code

    const content = ` ${office.name}</option>`

    line.innerHTML = content

    return line
}

const buttonsearchstock = () => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button type="button" data-toggle="modal" onclick="listFinance(event)" class="btn btn-success">
            Nueva Consulta
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    
    return divbtn
}

const listFinance = (obj) => {

    const content = [
        `<a data-toggle="popover" title="Ver todas las facturas vencidas" data-datetype="*" data-client="${obj.CustCode}"><i class="fas fa-angle-double-down" style="color:#cbccce;"></i></a>`,
        obj.CustCode,
        obj.CustName,
       `<a data-toggle="popover" title="Ver facturas vencidas 15 días" data-datetype="15" data-client="${obj.CustCode}">${obj.d15}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
       `<a data-toggle="popover" title="Ver facturas vencidas de 16 a 30 días" data-datetype="30" data-client="${obj.CustCode}">${obj.d30}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
       `<a data-toggle="popover" title="Ver facturas vencidas de 31 a 60 días" data-datetype="60" data-client="${obj.CustCode}">${obj.d60}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
       `<a data-toggle="popover" title="Ver facturas vencidas de 61 a 90 días" data-datetype="90" data-client="${obj.CustCode}">${obj.d90}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
       `<a data-toggle="popover" title="Ver facturas vencidas de 91 a 120 días" data-datetype="120" data-client="${obj.CustCode}">${obj.d120}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,   
       `<a data-toggle="popover" title="Ver facturas vencidas por más de 120 días" data-datetype="120+" data-client="${obj.CustCode}">${obj.d120more}<i style="text-align: right; float: right; color: #cbccce;" class="fas fa-angle-down"></i></a>`,
        obj.AmountOpen,
        obj.AmountBalance,
    ]

    return content
}

export const ViewFinance = {
    modalsearch,
    listFinance,
    listClients,
    listOffice,
    buttonsearchstock
}