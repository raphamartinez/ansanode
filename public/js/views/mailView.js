const listMails = (mail) => {

    const content = [
        `<a onclick="ViewMailPowerbi(event)" href="" data-id_mailpowerbi="${mail.id_mailpowerbi}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>
        <a onclick="modaldeleteMailSchedule(event)" href="" data-id_mailpowerbi="${mail.id_mailpowerbi}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${mail.recipients}`,
        `${mail.cc}`,
        `${mail.cco}`,
        `${mail.title}`,
        `${mail.body}`,
        `${mail.countatt}`,
        `${mail.datereg}`
    ]

    return content
}

const modaladdmail = () => {
    const div = document.createElement('div')

    const content = `<div class="modal fade" id="modalmailschedule" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Formulario de programación de correo electrónico</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
            </div>
            <div class="modal-body">
                <form id="formmail" name="formmail" role="form" data-toggle="validator" accept-charset="utf-8">
                    <div id="smartwizard">
                        <ul>
                            <li><a href="#step-1">Paso 1<br/><small>Correo electrónico</small></a></li>
                            <li><a href="#step-2">Paso 2<br/><small>Archivos adjuntos</small></a></li>
                            <li><a href="#step-3">Paso 3<br/><small>Calendario de envío</small></a></li>
                            <li><a href="#step-4">Paso 3<br/><small>Confirmación</small></a></li>
                        </ul>
                        <div>
                            <div id="step-1">
                                <div id="form-step-0" class="form-row" role="form" data-toggle="validator">
                                    <div class="form-group col-md-12 text-center">
                                        <h5 class="modal-title">Correo electrónico</h5>
                                    </div>
                                    <div class="modal-body">
                                        <div class="form-row">
                                            <div class="form-group col-md-12">
                                                <input id="for" name="for" type="text" class="form-control"
                                                    placeholder="Para" required>
                                            </div>
                                            <div class="form-group col-md-12">
                                                <input name="cc" id="cc" type="text" class="form-control"
                                                    placeholder="Cc" required>
                                            </div>
                                            <div class="form-group col-md-12">
                                                <input name="cco" id="cco" type="text" class="form-control"
                                                    placeholder="Cco" required>
                                            </div>
                                            <div class="form-group col-md-12">
                                                <input name="title" id="title" type="text" class="form-control"
                                                    placeholder="Título" required>
                                            </div>
                                            <div class="form-group col-md-12">
                                                <textarea required name="message" type="text" id="message" class="form-control"
                                                    placeholder="Mensaje" style="height: 120px;"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="step-2">
                                <div id="form-step-1" class="row" role="form" data-toggle="validator">
                                    <div class="form-group col-md-12 text-center">
                                        <h5 class="modal-title">Archivos adjuntos</h5>
                                        <h8 class="section-subheading text-muted">Agregue el enlace del informe que se
                                            adjuntará al correo electrónico.</h8>
                                    </div>
                                    <div class="form-group col-md-12 text-center">
                                    <h8 class="modal-title">Listado de Informes</h8>
                                    <select required name="bis" id="bis" class="form-control" required>
                                    <option value="" default disabled selected>Informes</option>
                                </select>
                                </div>
                                <div class="form-group col-md-12 text-center">
                                <button onclick="addbimail(event)" class="btn btn-success">Agregar Informe</button>
                                </div> 
                                <div class="form-group col-md-12 text-center">
                                <h8 class="modal-title">ou</h8>
                                </div>
                                    <div class="form-group col-md-12">
                                        <input name="urlinput" id="urlinput" type="url" class="form-control"
                                            placeholder="URL del Informe">
                                    </div>
                                    <div class="form-group col-md-12 text-center">
                                    <button onclick="addurlmail(event)" class="btn btn-success">Agregar URL</button>
                                    </div> 
                                    <div class="form-group col-md-12 text-center">
                                        <h8 class="modal-title">Lista de archivos adjuntos</h8>
                                        <select required name="url" id="url" class="form-control" required multiple>
                                    </select>
                                    </div>
                                </div>
                            </div>
                            <div id="step-3">
                                <div id="form-step-2" class="row" role="form" data-toggle="validator">
                                    <div class="form-group col-md-12 text-center">
                                        <h5 class="modal-title">Calendario de envío</h5>
                                    </div>                                    
                                    <div class="form-group col-md-12 text-center">
                                    <input class="form-control" type="datetime-local" name="date" id="date" multiple>
                                    </div>
                                    <div class="form-group col-md-12 text-center">
                                    <button onclick="addoptionschedule(event)" class="btn btn-success">Agregar envio programado</button>
                                    </div>
                                    <div class="form-group col-md-12 text-center">
                                        <h8 class="modal-title">Lista de Envíos programados</h8>
                                        <select required name="schedule" id="schedule" class="form-control" required multiple>
                                    </select>
                                    </div>
                                </div>
                            </div>
                            <div id="step-4">
                                <div id="form-step-3" class="row" role="form" data-toggle="validator">
                                    <div class="form-group col-md-12 text-center">
                                        <h5 class="modal-title">Confirmar la programación del correo electrónico</h5>
                                    </div>
                                    <hr>
                                    <div class="form-group col-md-12 text-center">
                                        <label for="typejpg"><strong>
                                        ¿Desea fusionar los archivos adjuntos en un solo archivo o mantenerlos separados?</strong></label>
                                        <div class="custom-control custom-radio custom-control-inline" color:black>
                                            <input type="radio" class="custom-control-input perfil" id="typejpg"
                                                name="type" value="1" onclick="changeDisabled()" required>
                                            <label class="custom-control-label" for="typejpg">Reunir</label>
                                        </div>
                                        <div class="custom-control custom-radio custom-control-inline" color:black>
                                            <input type="radio" class="custom-control-input perfil" id="typepdf"
                                                name="type" value="2" onclick="changeDisabled()">
                                            <label class="custom-control-label" for="typepdf">Manténgase separado</label>
                                        </div>
                                    </div>
                                    <div class="col-md-12 text-center">
                                        <button onclick="newmail(event)" id="btnmail" class="btn btn-success text-uppercase" type="submit"
                                            disabled>Agregar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>`
    div.innerHTML = content

    return div
}

const optionSchedule = (date) => {
    const line = document.createElement('option')

    line.value = date

    line.innerHTML = date

    return line
}

const optionBis = (powerbis) => {
    const line = document.createElement('option')

    line.value = powerbis.url

    let data

    if(powerbis.name !== undefined) {
        data = `${powerbis.name} - ${powerbis.title}`
    }else{
        data = powerbis.title
    }
    

    line.innerHTML = data

    return line
}

const optionURL = (value, innerhtml) => {
    const line = document.createElement('option')

    line.value = value

    const data = innerhtml

    line.innerHTML = data

    return line
}

const viewMail = (mail) => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="viewmail" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="false">
<div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Correo electrónico programado</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                <div class="form-group col-md-12 text-left">
                    <h5 class="text-center"><strong>Suscribirse</strong></h5>
                    <h8><strong>Para:</strong> ${mail.details[0].recipients}</h8>
                    </div> 
                    <div class="form-group col-md-12 text-left">
                    <h8><strong>Cc:</strong> ${mail.details[0].cc}</h8>
                    </div> 
                    <div class="form-group col-md-12 text-left">
                    <h8><strong>Cco:</strong> ${mail.details[0].cco}</h8>
                    <hr>
                    </div> 
                    <div class="form-group col-md-12 text-center">
                    <h5><strong>Título del E-mail:</strong> ${mail.details[0].title}</h5>
                    <hr>
                    </div> 
                    <div class="form-group col-md-12 text-center">  
                    <h5><strong>Cuerpo del correo electronico</strong></h5>        
                    <textarea class="form-control" style="height: 90px;" disabled>${mail.details[0].body}</textarea>                
                    </div>
                <div class="form-group col-md-12 text-center">   
                <h5><strong>Archivos Adjuntos:</strong></h5>
                <p>Se envían archivos adjuntos: ${mail.details[0].type}</p>
                <div class="form-group col-md-12 text-left">
                <button onclick="modaladdattachment(event)" data-id_mailpowerbi="${mail.details[0].id_mailpowerbi}" class="btn btn-success">Agregar adjunto</button>
                </div>
                <table class="table table-bordered text-center" id="tableattachment" width="100%" cellspacing="0"></table>
                <hr> 
                </div>
                <div class="form-group col-md-12 text-center">
                    <h5><strong>Calendario de envío: </strong></h5>
                    <div class="form-group col-md-12 text-left">
                    <button onclick="modaladdschedule(event)" data-id_mailpowerbi="${mail.details[0].id_mailpowerbi}" class="btn btn-success">Agregar envio</button>
                    </div>
                    <table class="table table-bordered text-center" id="tablescheduling" width="100%" cellspacing="0"></table> 
                </div>
                </div>
            </div>
            <div class="modal-footer">
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const lineSchedule = (schedule) => {
    const content = [
        `<a onclick="modaldeleteSchedule(event)" href="" data-id_mailscheduling="${schedule.id_mailscheduling}" data-id_mailpowerbi="${schedule.id_mailpowerbi}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${schedule.date}`
    ]

    return content
}

const lineAttachment = (attachment) => {
    const content = [
        `<a onclick="modalviewAttachment(event)" href="" data-id_mailattachment="${attachment.id_mailattachment}" data-url="${attachment.url}" data-id_mailpowerbi="${attachment.id_mailpowerbi}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>
        <a onclick="modaldeleteAttachment(event)" href="" data-id_mailattachment="${attachment.id_mailattachment}" data-id_mailpowerbi="${attachment.id_mailpowerbi}"><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${attachment.url}`
    ]

    return content
}

const deleteMailSchedule = (id_mailpowerbi) => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="deleteMailSchedule" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">¿Eliminar el correo electrónico programado?</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class=" col-md-12">
                            <h8>El correo electrónico se eliminará y no se podrá volver a ver.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <a data-id_mailpowerbi="${id_mailpowerbi}"  onclick="deleteMailSchedule(event)" name="btn" id="btn" class=" btn btn-danger"><i class="fas fa-times"> Eliminar</i></a>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const deleteSchedule = (id_mailscheduling, id_mailpowerbi) => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="deleteSchedule" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Eliminar horario</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class=" col-md-12">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <a data-id_mailscheduling="${id_mailscheduling}" data-id_mailpowerbi="${id_mailpowerbi}" onclick="deleteSchedule(event)" name="btn" id="btn" class=" btn btn-danger"><i class="fas fa-times"> Eliminar</i></a>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const deleteAttachment = (id_mailattachment, id_mailpowerbi) => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="deleteAttachment" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">¿Eliminar adjunto?</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class=" col-md-12">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <a data-id_mailattachment="${id_mailattachment}" data-id_mailpowerbi="${id_mailpowerbi}"  onclick="deleteAttachment(event)" name="btn" id="btn" class=" btn btn-danger"><i class="fas fa-times"> Eliminar</i></a>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div
}

const addattachment = (id_mailpowerbi) => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="addattachment" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Agregar archivo adjunto</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                            <h8 class="section-subheading text-muted text-center">Agregue el enlace del informe que se
                                adjuntará al correo electrónico.</h8>
                        </div>
                        <div class="form-group col-md-12 text-center">
                        <h8 class="modal-title">Listado de Informes</h8>
                        <select required name="bis" id="bis" class="form-control" required>
                        <option value="" default disabled selected>Informes</option>
                    </select>
                    </div>
                    <div class="form-group col-md-12 text-center">
                    <button onclick="addbimail(event)" class="btn btn-success">Agregar Informe</button>
                    </div> 
                    <div class="form-group col-md-12 text-center">
                    <h8 class="modal-title">ou</h8>
                    </div>
                        <div class="form-group col-md-12">
                            <input name="urlinput" id="urlinput" type="text" class="form-control"
                                placeholder="URL del Informe">
                        </div>
                        <div class="form-group col-md-12 text-center">
                        <button onclick="addurlmail(event)" class="btn btn-success">Agregar URL</button>
                        </div> 
                        <div class="form-group col-md-12 text-center">
                            <h8 class="modal-title">Lista de archivos adjuntos</h8>
                            <select required name="url" id="url" class="form-control" required multiple>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <a data-id_mailpowerbi="${id_mailpowerbi}"  onclick="addattachment(event)" name="btn" id="btn" class=" btn btn-success"><i class="fas fa-plus"> Agregar</i></a>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const addschedule = (id_mailpowerbi) => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="addschedule" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Agregar calendario de correo electrónico</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
            <div class="form-row col-md-12 text-center">
            <div class="form-group col-md-12 text-center">
            <input class="form-control" type="datetime-local" name="date" id="date" multiple>
            </div>
            <div class="form-group col-md-12 text-center">
            <button onclick="addoptionschedule(event)" class="btn btn-success">Agregar envio programado</button>
            </div>
            <div class="form-group col-md-12 text-center">
                <h8 class="modal-title">Lista de Envíos programados</h8>
                <select required name="schedule" id="schedule" class="form-control" required multiple>
            </select>
            </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <a data-id_mailpowerbi="${id_mailpowerbi}"  onclick="addschedule(event)" name="btn" id="btn" class=" btn btn-success"><i class="fas fa-plus"> Agregar</i></a>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const viewAttachment = (url, id_mailpowerbi, id_mailattachment) => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="viewAttachment" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Archivo adjunto</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12 text-center">  
                    <iframe style="width: 1100px;height: 520px;" frameborder="0" scrolling="no" src="${url}"></iframe>
                    </div>
                    <hr>
                    <div class="form-group col-md-12 text-center">  
                        <a data-dismiss="modal" data-id_mailattachment="${id_mailattachment}" data-id_mailpowerbi="${id_mailpowerbi}" id="deletefile" onclick="modaldeleteAttachment(event)" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

export const ViewMail = {
    listMails,
    modaladdmail,
    optionSchedule,
    optionBis,
    optionURL,
    viewMail,
    lineSchedule,
    lineAttachment,
    deleteMailSchedule,
    deleteAttachment,
    deleteSchedule,
    addattachment,
    addschedule,
    viewAttachment
}