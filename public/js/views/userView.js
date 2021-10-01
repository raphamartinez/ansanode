
const showTable = (user) => {
    const content = [
        `<a onclick="viewUser(event)" href="" data-id_login="${user.id_login}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
        `${user.name}`,
        `${user.perfilDesc}`,
        `${user.mailenterprise}`,
        `${user.dateBirthday}`,
        `${user.dateReg}`
    ]

    return content
}


const showModalInsert = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="insertuser" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Agregar usuario</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">          
                        <input type="text" placeholder="Nombre" class="form-control" name="name" id="name" required>
                    </div>
                    <div class="form-group col-md-6">          
                    <input type="text" placeholder="Fecha de cumpleaños" class="form-control" name="dateBirthday" id="dateBirthday">
                </div>
                <div class="form-group col-md-12">
                <input placeholder="Email Organização" class="form-control" id="mailenterprise" name="mailenterprise" type="email" required>
            </div>
                    <select class="selectpicker form-control col-md-6" name="perfil" id="perfil" required>
                    <option value="" disabled selected>Perfil</option>
                    <option value="1" >Administrador</option>
                    <option value= "2" >Vendedor</option>
                    <option value= "3" >Depositero</option>
                    <option value= "4" >Gerente</option>
                    <option value= "5" >Personal Administrativo</option>
                </select>
                <select class="selectpicker form-control col-md-6" name="office" id="officeinsert" required>
                <option value="" disabled selected>Sucursal</option>
            </select>
                <div class="form-group col-md-6">          
                <input type="text" placeholder="E-mail" class="form-control" name="mail" id="mail" required>
            </div>
            <div class="form-group col-md-6">          
            <input type="text" placeholder="Contraseña" class="form-control" name="password" id="password" required>
        </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" name="btn" class="btn btn-success"><i class="fas fa-check"> Registrar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const showModalEdit = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="edituser" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Editar usuario</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">          
                        <input type="text" placeholder="Nombre" class="form-control" name="name" id="nameedit" required>
                    </div>
                    <div class="form-group col-md-6">          
                    <input type="date" placeholder="Fecha de cumpleaños" class="form-control" name="dateBirthday" id="dateBirthdayedit">
                </div>
                <div class="form-group col-md-12">
                <input placeholder="Email Organização" class="form-control" id="mailenterpriseedit" name="mailenterprise" type="email" required>
            </div>
                <div class="form-group col-md-6">   
                    <select class="form-control" name="perfil" id="perfiledit" required>
                    <option value="" disabled selected>Perfil</option>
                    <option value="1" >Administrador</option>
                    <option value= "2" >Vendedor</option>
                    <option value= "3" >Depositero</option>
                    <option value= "4" >Gerente</option>
                    <option value= "5" >Personal Administrativo</option>
                </select>
                </div>
                <div class="form-group col-md-6">   
                <select class="form-control" name="office" id="officeedit" required>
                <option value="" disabled selected>Sucursal</option>
            </select>
            </div>
                <div class="form-group col-md-12">          
                <input type="email" placeholder="E-mail" class="form-control" name="mail" id="mailedit" required>
            </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" name="btn" onclick="editUser(event)" id="iddbtnedituser" class="btn btn-warning" ><i class="fas fa-edit"> Confirmar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const showModalDelete = () => {
    const div = document.createElement('div')

    const content = `
    <div class="modal fade" id="deleteuser" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Quieres deshabilitar este usuario?</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="col-md-12">
                            <h8>El usuario puede ser activado de nuevo más tarde.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" onclick="deleteUser(event)" name="btn" class=" btn btn-danger" id="iddbtndeleteuser"><i class="fas fa-times"> Deshabilitar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div
}

const showModalChangePass = (name, id_login) => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="changepass" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Editar contraseña del ${name}</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                <div class="form-group col-md-12 text-center">
                <h8 class="section-subheading text-muted" >Contraseña de acceso a la plataforma.</h8>
                <ul class="list-group">
                    <li id="min6" class="list-group-item"><small>Mínimo 6 caracteres</small></li>
                    <li id="max15" class="list-group-item"><small>Máximo 15 caracteres</small></li>
                    <li id="mai1" class="list-group-item"><small>Al menos 1 letra mayúscula</small></li>
                    <li id="num1" class="list-group-item"><small>Al menos 1 número</small></li>
                    <li id="esp1" class="list-group-item"><small>Al menos 1 personaje especial</small></li>
                    <li id="conf1" class="list-group-item"><small>Coincidencia de contraseña y confirmación</small></li>
                </ul>
            </div>
                    <div class="form-group col-md-6">          
                        <input type="password" placeholder="Contraseña" onkeyup="Check()" class="form-control" name="password" id="password" required>
                    </div>
                    <div class="form-group col-md-6">          
                    <input type="password" placeholder="Verificación de Contraseña" onkeyup="Check()" class="form-control" name="passwordconf" id="passwordconf" required>
                </div>
                <div class="form-group col-md-12 text-center">
                <div id="meter" ></div>
            </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button disabled type="submit" data-name="${name}" data-id_login="${id_login}" name="btn" onclick="changePassword(event)" class="btn btn-success" ><i class="fas fa-key"> Confirmar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}


const listOffice = (office) => {
    const line = document.createElement('option')

    line.value = office.id_office

    const content = ` ${office.name}</option>`

    line.innerHTML = content

    return line
}

const header = () => {
    const line = document.createElement('tr')

    const content =
        `
        <th scope="col">Opciones</th>
        <th scope="col">Nombre</th>
        <th scope="col">Perfil</th>
        <th scope="col">E-mail Organizacional</th>
        <th scope="col">Fecha de Nacimiento</th>
        <th scope="col">Fecha de Registro</th>
    </tr>`
    line.innerHTML = content

    return line
}


const createUser = () => {
    const line = document.createElement('div')

    const content =
        `
        <div class="modal fade" id="createuser" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Registrar nuevo Usuario</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <form id="formInsertUser" onsubmit="createUser(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input placeholder="Nombre" class="form-control" id="name" name="name" type="text" required>
                            </div>
                            <div class="form-group col-md-6">
                                <input placeholder="Fecha de Nacimiento" class="form-control" id="dateBirthday"
                                    name="dateBirthday" type="date">
                            </div>
                            <div class="form-group col-md-12">
                                <input placeholder="Email Organização" class="form-control" id="mailenterprise"
                                    name="mailenterprise" type="email" required>
                            </div>
                            <div class="form-group col-md-6">
                                <select name="perfil" id="perfil" class="form-control" required>
                                    <option value="" disabled selected>Perfil</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Vendedor</option>
                                    <option value="3">Depositero</option>
                                    <option value="4">Gerente</option>
                                    <option value="5">Personal Administrativo</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <select class="form-control" name="office" id="office" required>
                                    <option value="" disabled selected>Sucursal</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <input placeholder="Acceso al sistema" class="form-control" id="mail" name="mail"
                                    type="text" required>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="password" placeholder="Contraseña" class="form-control" name="password"
                                    id="password" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-success"><i class="fas fa-check"> Crear</i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
    line.innerHTML = content

    return line
}


const viewUser = (user) => {


    const content =
        `
        <div class="container col-md-12 text-center">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-6 text-left">
            <button data-back-manager onclick="listUser(event)" type="button" class="btn btn-secondary">
                <i class="fas fa-chevron-left"></i> Volver a la lista
            </button>

        </div>
        <div class="col-md-6 text-right">
            <div class="btn-group" role="group">
                <button id="btnGroupDrop1" type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    Opciones
                </button>
                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                    <a class="dropdown-item" data-toggle="modal" data-target="#edituser" onclick="modalEditUser(event)"
                        href="" data-id_login="${user.id_login}" data-id_user="${user.id_user}" data-name="${user.name}"
                        data-dateBirthday="${user.dateBirthdayDesc}" data-perfil="${user.perfil}"
                        data-office="${user.id_office}" data-mail="${user.mail}"
                        data-mailenterprise="${user.mailenterprise}"> <i class="fas fa-edit" style="color:#3498DB;"></i>
                        Editar usuario</a>
                    <a class="dropdown-item" data-toggle="modal" data-target="#deleteuser"
                        onclick="modalDeleteUser(event)" href="" data-id_user="${user.id_user}" data-id_login="${user.id_login}" data-name="${user.name}"><i
                            class="fas fa-trash" style="color:#CC0000;"></i> Deshabilitar usuario</a>
                    <a class="dropdown-item" data-toggle="modal" data-target="#changepass"
                        onclick="modalChangePass(event)" href="" data-id_user="${user.id_user}" data-id_login="${user.id_login}" data-name="${user.name}"><i
                            class="fas fa-key" style="color:#DAA520;"></i> Editar contraseña</a>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12 p-4 text-center">
            <div class="picture-container p-4">
                <div class="picture">
                    <a data-toggle="modal" data-target="#janelaImagem">
                        <i class="fas fa-user fa-4x text-gray-400 float-center"></i>
                    </a>
                </div>
            </div>
            <h4>${user.name}</h4>
        </div>

        <div class="col-md-12 p-3">
            <div class="card shadow mb-2">
                <div class="card-header text-white bg-secondary"><strong>Dados:</strong></div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="tel"><strong>Acceso: </strong>${user.mail}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="dtnascimento"><strong>E-mail Organização:
                                </strong>${user.mailenterpriseDesc}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="Sexo"><strong>Fecha de Nacimiento: </strong>${user.dateBirthdayDesc}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="Sexo"><strong>Fecha de Registro: </strong>${user.dateReg}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="tel"><strong>Sucursal: </strong>${user.office}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="tel"><strong>Perfil: </strong>${user.perfilDesc}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 p-3 text-left">
            <div class="card">
                <div class="card-header text-white bg-secondary"><strong>Acceso a PowerBi:</strong></div>
                <div class="form-row p-3">
                    <div class="form-group col-md-1.5">
                    <button data-btn-powerbi onclick="addModalPowerBi(event)" data-toggle="modal" data-target="#addpowerbi" href=""
                    data-id_login="${user.id_login}" data-name="${user.name}" type="button"
                    class="btn btn-success">
                    <i class="fas fa-plus"></i> Nuevo Informe
                </button>
                    </div>
                </div>
            </div>
            <table class="table table-bordered text-center" id="powerbiuserlist" width="100%" cellspacing="0"></table>
        </div>
        <div class="col-md-6 p-3 text-right">
            <div class="card">
                <div class="card-header text-white text-left bg-secondary"><strong>Acceso a Depósito:</strong></div>
                <div class="form-row p-3">
                    <div class="form-group col-md-1.5">
                        <button data-btn-stock onclick="addModalStock(event)" data-toggle="modal" data-target="#addstock" href=""
                            data-id_login="${user.id_login}" data-name="${user.name}" type="button"
                            class="btn btn-success">
                            <i class="fas fa-plus"></i> Nuevo Depósito
                        </button>
                    </div>
                </div>
                <table class="table table-bordered text-center" id="stock" width="100%" cellspacing="0"></table>
            </div>
        </div>
    </div>
</div>
    `

    return content
}

const listPowerBiAdmin = (powerbi, id_login) => {

    const content = [
        `
        <a onclick="viewBi(event)" href="" data-title="${powerbi.title}" data-url="${powerbi.url}"><i class="fas fa-eye" style="color:#666600;"></i></a>
        <a data-toggle="modal" data-target="#editpowerbi" onclick="modalEditBi(event)" href="" data-id_login="${id_login}" data-id_powerbi="${powerbi.id_powerbi}" data-title="${powerbi.title}" data-url="${powerbi.url}" data-type="${powerbi.type}"><i class="fas fa-edit" style="color:#32CD32;"></i></a>
        <a data-toggle="modal" data-target="#deletepowerbi" onclick="modalDeleteBi(event)" href="" data-id_login="${id_login}" data-id_powerbi="${powerbi.id_powerbi}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>
        `,
        `${powerbi.title}`,
        `${powerbi.typedesc}`,
        `${powerbi.dateReg}`,
    ]

    return content
}

const buttons = () => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button type="button" data-toggle="modal" onclick="modalCreateUser(event)" class="btn btn-success">
            Registrar Usuario
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    
    return divbtn
}


export const View = {
    showTable,
    showModalInsert,
    showModalDelete,
    showModalEdit,
    header,
    createUser,
    listOffice,
    showModalChangePass,
    viewUser,
    listPowerBiAdmin,
    buttons
}