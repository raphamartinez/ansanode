
const newLine = (salesman) => {
    const content = [
        `<a onclick="modalAddManager(event)" href="" data-id_salesman="${salesman.id_salesman}"><i class="fas fa-user-circle" style="color:#cbccce;"></i></a>
        <a onclick="modalDeleteSalesman(event)" href="" data-id_salesman="${salesman.id_salesman}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        salesman.name,
        salesman.manager,
        salesman.dateReg
    ]

    return content
}

const modalAddSalesman = () => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="modalsalesman" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Agregar vendedor al sistema </h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12"> 
                        <select class="selectpicker form-control" name="salesmanselect" id="salesmanselect" multiple required>
                </select>
                    </div> 
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" onclick="addSalesman(event)" name="btn" class=" btn btn-success"><i class="fas fa-plus"> Agregar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const optionSellers = (salesman) => {
    const line = document.createElement('option')

    line.value = `{"name":"${salesman.name}", "code":"${salesman.code}", "office":"${salesman.office}"}`

    const content = ` ${salesman.name}</option>`

    line.innerHTML = content

    return line
}

const optionManager = (user) => {
    const line = document.createElement('option')

    line.value = user.id_login

    const content = ` ${user.name}</option>`

    line.innerHTML = content

    return line
}


const deleteSalesman = (id_salesman) => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="deleteSalesman" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">¿Eliminar el Vendedor?</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class=" col-md-12">
                            <h8>Ya no se puede vincular al vendedor para establecer objetivos y otras actividades.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <a data-id_salesman="${id_salesman}"  onclick="deleteSalesman(event)" name="btn" id="btn" class=" btn btn-danger"><i class="fas fa-times"> Eliminar</i></a>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const modalAddManager = (id_salesman) => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="modalAddManager" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Enlace al gerente </h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12"> 
                        <select class="selectpicker form-control" name="managerselect" id="managerselect" required>
                        <option value="" disabled selected>Usuarios</option>
                </select>
                    </div> 
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button data-id_salesman="${id_salesman}" type="submit" onclick="AddManager(event)" name="btn" class=" btn btn-success"><i class="fas fa-plus"> Enlace</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

export const ViewSalesman = {
    newLine,
    modalAddManager,
    modalAddSalesman,
    optionSellers,
    deleteSalesman,
    optionManager
}