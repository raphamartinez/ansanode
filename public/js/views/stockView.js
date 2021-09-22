const modaladd = (id_login) => {
    const div = document.createElement('div')

    const content = `
    <div class="modal fade" id="addstock" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Agregar acceso al depósito</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">
                        Seleccione los depósitos a los que el usuario debe tener acceso
                        <select multiple title="Depósito" class="selectpicker form-control" name="stock" id="stockselect" required>
                    </select>
                    </div> 
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button data-id_login ="${id_login}" type="submit" onclick="addstock(event)" class="btn btn-success"><i class="fas fa-plus"> Confirmar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>
`
    div.innerHTML = content

    return div
}

const modaldelete = (id_stock, id_login) => {
    const div = document.createElement('div')

    const content = `
    <div class="modal fade" id="deletestock" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Eliminar el acceso al depósito</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">
                        El Usuario ya no podrá acceder al depósito y a los artículos que contiene.
                    </div> 
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button data-id_stock ="${id_stock}" data-id_login="${id_login}" type="submit" onclick="deletestock(event)" class="btn btn-danger"><i class="fas fa-times"> Eliminar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>
`
    div.innerHTML = content

    return div
}

const listStock = (stock, id_login) => {
    const content = [
        `<a onclick="modalDeleteStock(event)" href="" data-id_stock="${stock.id_stock}" data-id_login="${id_login}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${stock.name}`
    ]

    return content
}

const listOption = (doc) => {
    const line = document.createElement('option')

    line.value = doc

    const content = ` ${doc}</option>`

    line.innerHTML = content

    return line
}


export const ViewStock = {
    modaladd,
    modaldelete,
    listStock,
    listOption
}