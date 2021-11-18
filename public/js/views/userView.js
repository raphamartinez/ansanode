
const line = (user) => {
    const content = [
        `<a btn-view-user data-id_login="${user.id_login}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
        `${user.name}`,
        `${user.perfilDesc}`,
        `${user.mailenterprise}`,
        `${user.dateBirthday}`,
        `${user.dateReg}`
    ]

    return content
}

const edit = () => {
    const div = document.createElement('div')

    div.innerHTML =  `
    <div class="modal fade" id="edit" tabindex="-1" >
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar usuario</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-edit>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-6">          
                            <input type="text" placeholder="Nombre" class="form-control" name="name" id="name" required>
                        </div>
                        <div class="form-group col-md-6">          
                        <input type="date" placeholder="Fecha de cumpleaños" class="form-control" name="dateBirthday" id="dateBirthday">
                    </div>
                    <div class="form-group col-md-12">
                    <input placeholder="Email Organização" class="form-control" id="mailenterprise" name="mailenterprise" type="email" required>
                </div>
                    <div class="form-group col-md-6">   
                        <select class="form-control" name="perfil" id="perfil" required>
                        <option value="0" disabled>Perfil</option>
                        <option value="1">Administrador</option>
                        <option value="2">Vendedor</option>
                        <option value="3">Depositero</option>
                        <option value="4">Gerente</option>
                        <option value="5">Personal Administrativo</option>
                        <option value="6">Encarregado de Sucursal</option>
                        <option value="7">Auditor</option>
                    </select>
                    </div>
                    <div class="form-group col-md-6">   
                    <select title="Sucursal" class="form-control" name="office" id="office" multiple required>
                </select>
                </div>
                    <div class="form-group col-md-12">          
                    <input type="text" placeholder="Acceso" class="form-control" name="mail" id="mail" required>
                </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success" ><i class="fas fa-edit"> Editar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>`

    return div
}

const del = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="delete" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Quieres deshabilitar este usuario?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-delete>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="col-md-12">
                            <h8>El usuario puede ser activado de nuevo más tarde.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger"><i class="fas fa-times"> Deshabilitar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const password = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="modalpassword" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cambiar contraseña</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-password>
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
                            <input type="password" placeholder="Contraseña" onkeyup="Check(event)" class="form-control" name="password" id="pass" required>
                        </div>
                        <div class="form-group col-md-6">          
                        <input type="password" placeholder="Verificación de Contraseña" onkeyup="Check(event)" class="form-control" name="passwordconf" id="checkpassword" required>
                    </div>
                    <div class="form-group col-md-12 text-center">
                    <div id="meter" ></div>
                </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button disabled type="submit" class="btn btn-success"><i class="fas fa-key"> Confirmar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>`

    return div
}


const create = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="create" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Registrar nuevo usuario</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                    </button>
                </div>
                <form data-form-create-user>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input placeholder="Nombre" class="form-control" id="name" name="name" 
                                type="text" required>
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
                                <option value="0" disabled>Perfil</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Vendedor</option>
                                    <option value="3">Depositero</option>
                                    <option value="4">Gerente</option>
                                    <option value="5">Personal Administrativo</option>
                                    <option value="6">Encarregado de Sucursal</option>
                                    <option value="7">Auditor</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <select title="Sucursal" class="form-control" name="office" id="office" 
                                multiple required>
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

    return div
}


const view = (user) => {


    const content =
        `
        <div class="container col-md-12 text-center">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-6 text-left">
            <button data-menu-user type="button" class="btn btn-secondary">
                <i class="fas fa-chevron-left"></i> Volver a la lista
            </button>

        </div>
        <div class="col-md-6 text-right">
            <div class="btn-group" role="group">
                <button id="btnGroupDrop1" type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    Opciones
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" data-btn-edit><i class="fas fa-edit" style="color:#3498DB;"></i> Editar usuario</a>
                    <a class="dropdown-item" data-toggle="modal" data-target="#delete">
                    <i class="fas fa-trash" style="color:#CC0000;"></i> Deshabilitar usuario</a>
                    <a class="dropdown-item" data-toggle="modal" data-target="#modalpassword">
                    <i class="fas fa-key" style="color:#DAA520;"></i> Editar contraseña</a>
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
            <h4 data-view-name >${user.name}</h4>
        </div>

        <div class="col-md-12 p-3">
            <div class="card shadow mb-2">
                <div class="card-header text-white bg-secondary"><strong>Dados:</strong></div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="mail" data-view-mail><strong>Acceso: </strong>${user.mail}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="mailenterprise" data-view-mailenterprise ><strong>E-mail Organização:
                                </strong>${user.mailenterpriseDesc}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="dateBirthday" data-view-dateBirthday ><strong>Fecha de Nacimiento: </strong>${user.dateBirthdayDesc}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="dateReg" data-view-dateReg><strong>Fecha de Registro: </strong>${user.dateReg}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="office" data-view-office ><strong>Sucursal: </strong>${user.office}</label>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="profile" data-view-profile ><strong>Perfil: </strong>${user.perfilDesc}</label>
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
                    <button data-toggle="modal" data-target="#powerbi" class="btn btn-success">
                    <i class="fas fa-plus"></i> Agregar acceso al informe
                    </button>
                    </div>
                </div>
            </div>
            <table class="table table-bordered text-center" id="powerbi" width="100%" cellspacing="0"></table>
        </div>
        <div class="col-md-6 p-3 text-right">
            <div class="card">
                <div class="card-header text-white text-left bg-secondary"><strong>Acceso a Depósito:</strong></div>
                <div class="form-row p-3">
                    <div class="form-group col-md-1.5">
                        <button data-toggle="modal" data-target="#stock" class="btn btn-success">
                            <i class="fas fa-plus"></i> Agregar acceso al stock
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

const buttons = () => {

    const divbtn = document.createElement('div')

    const content = ` 
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button btn-create-user class="btn btn-success" data-bs-toggle="modal" data-bs-target="#create">
            Registrar Usuario
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    
    return divbtn
}


export const View = {
    create,
    line,
    edit,
    view,
    del,
    password,
    buttons
}