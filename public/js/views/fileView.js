
const directory = (title, div) => {
    const divbtn = document.createElement('div')

    const content = `    <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <div class="col-md-12 text-left">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Opciones
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a data-toggle="modal" data-target="#modalAddFile" onclick="modalAddFile(event)" class="dropdown-item"><i class="fa fa-plus"></i> Nuevo Archivo</a>
                <a data-toggle="modal" data-target="#janela" class="dropdown-item"><i class="fa fa-envelope"></i> Enviar por email</a>
            </div>
        </div>
        <button type="button" onclick="modalsearch(event)" class="btn btn-success">
        Buscar Archivos
        </button>
    </div>
</div>`

    divbtn.innerHTML = content
    title.appendChild(divbtn)

    div.innerHTML = ` 
    <div class="col-md-12">
    <div class="card shadow mb-3 responsive" >
        <div class="card-header"><strong>File-system</strong></div>
                        <div class="card-body">
                                <div id="filecontent" class="form-row col-md-12">
                            </div>
                        </div>
                    </div>
                </div>
                </div>`

}

const search = (modal) => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="modalsearch" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Búsqueda por archivo </h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Nombre del archivo" class="form-control" name="title" id="title" required>
                        </div>
                        <div class="form-group col-md-12"> 
                        <select class="selectpicker form-control" name="type" id="type" required>
                    <option value="" disabled selected>Tipo del archivo</option>
                    <option value="1" >Informe</option>
                    <option value="2">Personal</option>
                    <option value="3">Seguridad - Vehículos</option>
                    <option value="4">Seguridad - Sucursales</option>
                </select>
                    </div> 
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" onclick="searchfile(event)" name="btn" id="btn" class=" btn btn-success"><i class="fas fa-search"> Buscar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    modal.appendChild(div)

    return div

}


const modal = () => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="modaladdfile" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Agregar archivo </h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form enctype="multipart/form-data" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Título del archivo" class="form-control" name="title" id="title" required>
                        </div>
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Descripción del archivo"  class="form-control" name="description" id="description" required>
                        </div>
                        <div class="form-group col-md-12"> 
                        <select class="selectpicker form-control" name="type" id="type" required>
                    <option value="" disabled selected>Tipo</option>
                    <option value="1">Manual</option>
                    <option value="2">Documento</option>
                </select>
                    </div> 
                    <div class="form-group col-md-12"> 
                        <div class="form-group col-md-12 custom-file">
                            <input type="file" class="custom-file-input" id="file" name="file" required>
                            <label class="custom-file-label" for="customFile" id="fileName" name="fileName">Insertar archivo</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" name="btn" id="btn" onclick="upload(event)" class=" btn btn-success"><i class="fas fa-check"> Insertar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}


const pdf = () => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modalpdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">PDF</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">�</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12">      
                        <embed id="pdfac" src="" alt="" width="760" height="400" type='application/pdf'>
                    </div>
                    <div class="form-group col-md-12 text-center">     
                        <a id="deletefile" data-toggle="modal" data-target="#deletefile" data-id="" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a download href="" id="downloadpdf" class="download" style="color:#36b9cc"><i class="fas fa-download"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12">     
                        <div class="portfolio-caption">
                            <p class="item-intro text-muted text-center" id="descriptionfile"></p>
                        </div>
                    </div> 
                </div> 
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const video = () => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modalvideo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Video</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12">      
                        <video width="760" height="400" controls>
                            <source id="videoac" src="" alt="" type="video/mp4" >
                        </video>
                    </div>
                    <div class="form-group col-md-12 text-center">  
                        <a id="deletefile" data-toggle="modal" data-target="#deletefile" data-id="" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a id="downloadvideo" href="" class="download" download style="color:#36b9cc"><i class="fas fa-download"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12">    
                        <div class="portfolio-caption">
                            <p class="item-intro text-muted text-center" id="descriptionfile"></p>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const image = () => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modalimage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Imagen</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12">      
                        <img id="imagemAc" src="https://informes.americaneumaticos.com.py/img/background.jpg" alt="" class="img-fluid d-block mx-auto"/>
                    </div>
                    <hr>
                    <div class="form-group col-md-12 text-center">  
                        <a id="deletefile" data-toggle="modal" data-target="#deletefile" data-id="" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a id="download" href="" class="download" download style="color:#36b9cc"><i class="fas fa-download"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12"> 
                        <div class="portfolio-caption text-center">
                            <p class="item-intro text-muted" id="descriptionfile">Teste</p>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const deleteFile = () => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="deletefile" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Borrar archivo</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class=" col-md-12">
                            <h8>El archivo se eliminará de forma permanente.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" name="btn" id="btn" class=" btn btn-danger"><i class="fas fa-times"> Borrar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const file = (obj) => {
    const div = document.createElement('div')

    const content = ` <div class="col-md-2 p-2 text-center"> 
                          <a class="abrir" data-toggle="modal" data-target="#modalimage"><img src="https://informes.americaneumaticos.com.py/tmp/uploads/${obj.filename}" class="responsive img-fluid card mh-100"  style="width:146px; height:146px;"/></a>
                          <div class="form-row text-center"><h5>${obj.title}</h5></div>
                      </div>`

    div.innerHTML = content

    return div
}


const fileUpload = (filename,title) => {
    const div = document.createElement('div')

    const content = ` <div class="col-md-2 p-2 text-center"> 
                          <a class="abrir" data-toggle="modal" data-target="#modalimage"><img src="https://informes.americaneumaticos.com.py/tmp/uploads/${filename}" class="responsive img-fluid card mh-100"  style="width:146px; height:146px;"/></a>
                          <div class="form-row text-center"><h5>${title}</h5></div>
                      </div>`

    div.innerHTML = content

    return div
}

export const ViewFile = {
    directory,
    modal,
    pdf,
    video,
    image,
    deleteFile,
    search,
    file,
    fileUpload
}