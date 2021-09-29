
const showSimplePowerBI = (simpleBI) => {
    simpleBI.innerHTML = `   
    <iframe width="1140" height="600" src="https://app.powerbi.com/reportEmbed?reportId=8deb357b-76b9-4c78-a5ae-fd4b45e8c4a8&autoAuth=true&ctid=7c233ef6-b75d-4d21-8319-f199fda36ea0&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWJyYXppbC1zb3V0aC1iLXByaW1hcnktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D" frameborder="0" allowFullScreen="true"></iframe>`
}


const showPowerBI = (url) => {
    simpleBI.innerHTML = `   
    <iframe  src="${url}" frameborder="0" allowFullScreen="true"></iframe>`
}

const showModalEdit = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="editpowerbi" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Editar</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                <div class="form-group col-md-6">
                    <input type="text" placeholder="Título" class="form-control" name="title" id="titleedit" required>
                    </div> 
                    <div class="form-group col-md-6">
                    <select class="form-control" name="type" id="typeedit" required>
                    <option value="" disabled selected>Tipo</option>
                    <option value="1" >Informe</option>
                    <option value="2">Personal</option>
                    <option value="3">Seguridad - Vehículos</option>
                    <option value="4">Seguridad - Sucursales</option>
                </select>
                </div> 
                <div class="form-group col-md-12">          
                <input type="text" placeholder="Url" class="form-control" name="url" id="urledit" required>
            </div>
            <div class="form-group col-md-12">
            <textarea placeholder="Descripción del informe..." id="descriptionedit" name="description" class="form-control"></textarea>
            </div> 
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" name="btn" id="ideditpowerbi" onclick="editPowerBi(event)" class="btn btn-warning"><i class="fas fa-edit"> Confirmar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const showModalDelete = (id_powerbi, id_login) => {
    const div = document.createElement('div')

    const content = `
    <div class="modal fade" id="deletepowerbi" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Quieres eliminar este informe?</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class=" col-md-12">
                            <h8>Si lo borra no podrá recuperarlo de nuevo.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" name="btn" onclick="deletePowerBi(event)" data-id_powerbi="${id_powerbi}" data-id_login="${id_login}" id="iddeletepowerbi" class="btn btn-danger"><i class="fas fa-times"> Eliminar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div
}


const listPowerBi = (powerbi) => {

    const content =[
       `<a onclick="viewBi(event)" href="" data-title="${powerbi.title}" data-url="${powerbi.url}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
       `${powerbi.title}`,
       `${powerbi.typedesc}`,
       `${powerbi.description}`,
       `${powerbi.dateReg}`,
      ]

    return content
}

const listPowerBiAdmin = (powerbi, id_login) => {

    const content =  [
        `
        <a onclick="viewBi(event)" href="" data-id_login="${id_login}" data-title="${powerbi.title}" data-url="${powerbi.url}"><i class="fas fa-eye" style="color:#666600; padding: 2px;"></i></a>
        <a data-toggle="modal" data-target="#editpowerbi" onclick="modalEditBi(event)" href="" data-id_login="${id_login}" data-id_powerbi="${powerbi.id_powerbi}" data-title="${powerbi.title}" data-url="${powerbi.url}" data-description="${powerbi.description}" data-type="${powerbi.type}"><i class="fas fa-edit" style="color:#32CD32; padding: 2px;"></i></a>
        <a data-toggle="modal" data-target="#deletepowerbi" onclick="modalDeleteBi(event)" href="" data-id_login="${id_login}" data-id_powerbi="${powerbi.id_powerbi}"><i class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>
        <a onclick="modalAddBiUser(event)" data-id_powerbi="${powerbi.id_powerbi}" ><i class="fas fa-users" style="color:#000000; padding: 2px;"><span class="badge badge-dark">${powerbi.count}</span></i></a>
        `,
        `${powerbi.title}`,
        `${powerbi.typedesc}`,
        `${powerbi.description}`,
        `${powerbi.dateReg}`,
       ]

    return content
}

const header = () => {
    const line = document.createElement('tr')

    const content =
        `
        <th scope="col">Opciones</th>
        <th scope="col">Nombre</th>
        <th scope="col">Tipo</th>
        <th scope="col">Fecha de Registro</th>
    </tr`
    line.innerHTML = content

    return line
}


const showModalPbiInsert = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="addpowerbi" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Agregar informe</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">      
                <div class="form-group col-md-6">
                        <input type="text" placeholder="Título" class="form-control" name="title" id="title" required>
                        </div>  
                        <div class="form-group col-md-6">
                    <select class="form-control" name="type" id="type" required>
                    <option value="" disabled selected>Tipo</option>
                    <option value="1" >Informe</option>
                    <option value="2">Personal</option>
                    <option value="3">Seguridad - Vehículos</option>
                    <option value="4">Seguridad - Sucursales</option>
                </select>
                </div>  
                <div class="form-group col-md-12">
                <input type="url" placeholder="Url" class="form-control" name="url" id="url" required>
                </div> 
                <div class="form-group col-md-12">
                <textarea placeholder="Descripción del informe..." id="description" name="description" class="form-control"></textarea>
                </div> 
                </div> 
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" name="btn" id="idinsertnewbi" class="btn btn-success" onclick="addPowerBi(event)"><i class="fas fa-check"> Confirmar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const modalAddBiUser = (id_powerbi) => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="modalAddBiUser" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Enlace Informe al Usuario</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12"> 
                        <select title="Usuarios" multiple class="selectpicker form-control" name="userselect" id="userselect" required>
                </select>
                    </div> 
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button data-id_powerbi="${id_powerbi}" type="submit" onclick="addBiUser(event)" name="btn" class=" btn btn-success"><i class="fas fa-plus"> Enlace</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}


const optionUser = (user) => {
    const line = document.createElement('option')

    line.value = user.id_login

    const content = ` ${user.name}</option>`

    line.innerHTML = content

    return line
}

const buttons = () => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button type="button" data-toggle="modal" onclick="addModalPowerBi(event)" class="btn btn-success">
            Registrar Informe
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    
    return divbtn
}




export const ViewPowerBi = {
    showSimplePowerBI,
    showPowerBI,
    listPowerBi,
    listPowerBiAdmin,
    showModalEdit,
    showModalDelete,
    header,
    showModalPbiInsert,
    buttons,
    optionUser,
    modalAddBiUser
}