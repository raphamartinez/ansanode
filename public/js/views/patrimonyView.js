const tableImage = (file, patrimony) => {
    const div = document.createElement('div')
    div.classList.add('col-md-2', 'mb-2')
    div.innerHTML = `
    <a><span data-action style="top:0%; left: 2%;" data-url="${file.url}" data-id="${file.id}" data-name="${file.name}" data-id_patrimony="${file.id_patrimony}" data-image-delete
    class="btn-delete-image position-absolute translate-middle badge rounded-pill bg-danger">
    X
    <span class="visually-hidden"></span></span></a>
        <img data-url="${file.url}" data-id="${file.id}" data-office="${patrimony.office}" data-plate="${patrimony.plate}" data-name="${patrimony.name}" data-type="${patrimony.type}" data-desc="${patrimony.desc}" data-note="${patrimony.note}" data-id_patrimony="${file.id_patrimony}" data-date="${file.datereg}" width="250" height="250" src="${file.url}" class="img-fluid full-view">
        `

    return div
}



const header = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="row justify-content-md-center pt-4">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Buscar los patrimonios</h6>
            </div>
            <div class="card-body">
                <form data-search-patrimony >
                    <div class="form-row">
                        <div class="select-pure form-group offset-md-3 col-md-3">
                        </div>
                        <div class="form-group col-md-3">
                            <select title="Sucursal" class="form-control selectpicker" id="office" name="office" multiple
                            data-office>
                            </select>
                        </div>
                        <div class="form-group text-center col-md-12">
                            <button class="btn btn-info" type="submit">Buscar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>`

    return div
}

const table = () => {
    const div = document.createElement('div')
    div.innerHTML = `<div div-table-patrimony class="d-none row justify-content-md-center">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header">
                <div class="form-row">
                    <div class="form-group col-12">
                        <h6 class="m-0 font-weight-bold text-primary">Listado del patrimonio</h6>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-bordered text-center" id="dataPatrimony" width="100%" cellspacing="0"></table>
            </div>
        </div>
    </div>
    </div>`

    return div
}

const dropImage = (url) => {
    const div = document.createElement('div')
    div.innerHTML = `
    <div class="modal fade" id="deleteImage" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Borrar Imagen</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-delete-image-patrimony >
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group text-center col-md-12">
                        <h6>¿Quieres borrar la imagen abajo?</h6>
                        </div>
                        <div class="form-group text-center col-md-12">
                            <img width="250" height="250" src="${url}" class="img-fluid rounded">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger"><i class="text-white fas fa-trash"> Borrar</i></button>
                </div>
            </form>
        </div>
    </div>
</div>
    `

    return div
}

const drop = () => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="deletepatrimony" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" >
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Eliminar Patrimonio</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-delete-patrimony>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el patrimonio ?</h6>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger"><i class="fas fa-trash"> Eliminar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const upload = () => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="upload" tabindex="-1" >
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Upload</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-upload-patrimony>
                <div class="modal-body">
                <div class="form-row">
                    <div class="input-group">
                        <div class="custom-file">
                            <input id="newfile" name="file" type="file" multiple
                                class="custom-file-input" required>
                            <label class="custom-file-label" for="inputGroupFile01">Foto</label>
                        </div>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-upload"> Upload</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const add = () => {
    const div = document.createElement('div')

    div.innerHTML = `
<div data-div-travels class="row justify-content-md-center">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header">
                <div class="form-row">
                    <div class="form-group text-center col-12">
                        <h6 class="m-0 font-weight-bold text-primary">Agregar </h6>
                    </div>
                </div>
            </div>
            <div class="card-body">
            <form data-add-patrimony>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <input placeholder="Nombre" class="form-control" id="name" name="name" type="text" required>
                        </div>
                        <div class="form-group col-md-6">
                            <input placeholder="Plaqueta" class="form-control" id="plate" name="plate" type="text" required>
                        </div>
                        <div class="form-group col-md-6">
                            <select class="form-control" id="type" name="type" data-type-add required>
                                <option value="" disabled selected>Tipo</option>
                                <option value="Alineadora" >Alineadora</option>
                                <option value="Balanceadora" >Balanceadora</option>
                                <option value="Calibrador" >Calibrador</option>
                                <option value="Cañón de inflado" >Cañón de inflado</option>
                                <option value="Compressor" >Compressor</option>
                                <option value="Desmontadora" >Desmontadora</option>
                                <option value="Elevador" >Elevador</option>
                                <option value="Gabineta da Alineadora" >Gabineta da Alineadora</option>
                                <option value="Gato Hidráulico" >Gato Hidráulico</option>
                                <option value="Lavadora de cubiertas" >Lavadora de cubiertas</option>
                                <option value="Prensa Hidráulica" >Prensa Hidráulica</option>
                                <option value="Rampa" >Rampa</option>
                                <option value="Rectificador (a)" >Rectificador (a)</option>
                                <option value="Regulador de Farol" >Regulador de Farol</option>
                                <option value="Caja/mesa de Herramienta" >Caja/mesa de Herramienta</option>
                                <option value="Teléfono" >Teléfono</option>
                                <option value="Extintor" >Extintor</option>
                                <option value="Otro" >Otro</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <select title="Sucursal" class="form-control" id="officenew" name="office" required data-office-add>
                            <option value="" disabled selected>Sucursal</option>
                            </select>
                        </div>
                        <div class="form-group col-md-12">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="file" required multiple>
                                <label id="filename" class="custom-file-label" for="file">Insertar archivos</label>
                            </div>
                        </div>
                        <div class="form-row col-md-12" data-add-desc>
                        
                        </div>
                        <div class="form-group col-md-12">
                            <textarea placeholder="Comentarios adicionales" class="form-control" name="description" id="description" rows="2"></textarea>
                        </div>
                        <div class="form-group col-md-12">
                            <textarea placeholder="Notas" class="form-control" name="note" id="note" rows="2"></textarea>
                        </div>
                        <div class="form-group col-md-12 text-right">
                        <button id="btnadd" type="submit" class="btn btn-success"><i class="fas fa-check"> Agregar</i></button>  
                        </div> 
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>`

    return div
}

const edit = (patrimony) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="edit" tabindex="-1" >
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Patrimonio</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-edit-patrimony>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                        <label>Nombre</label>
                            <input value="${patrimony.name}" placeholder="Insira lo nombre" class="form-control" id="name" name="name" 
                            type="text" required>
                        </div>
                        <div class="form-group col-md-6">
                        <label>Plaqueta</label>
                            <input value="${patrimony.plate}" placeholder="Insira la plaqueta" class="form-control" id="plate" name="plate" type="text" required>
                        </div>
                        <div class="form-group col-md-6">
                        <label>Tipo</label>
                            <input value="${patrimony.type}" class="form-control" id="type" name="type" type="text" disabled>
                        </div>
                        <div class="form-group col-md-6">
                        <label>Sucursal</label>
                            <select title="Seleccione una sucursal" class="form-control" id="office" name="office" data-office-edit required>
                            <option value="" disabled selected>Sucursal</option>
                            </select>
                        </div>
                        <div class="form-row col-md-12" data-edit-desc></div>
                            <div class="form-group col-md-12">
                            <label>Comentarios adicionales</label>
                                <textarea value="${patrimony.description}" class="form-control" name="description" id="description" rows="2">${patrimony.description}</textarea>
                            </div>
                            <div class="form-group col-md-12">
                            <label>Notas</label>
                                <textarea class="form-control" value="${patrimony.note}" name="note" id="note" rows="2">${patrimony.note}</textarea>
                            </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success"><i class="fas fa-edit"> Editar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}
export const View = {
    add,
    edit,
    upload,
    drop,
    dropImage,
    header,
    table,
    tableImage
}