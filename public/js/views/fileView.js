const url = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

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
                <a data-toggle="modal" data-target="#modalAddOffice" onclick="modalAddOffice(event)" class="dropdown-item"><i class="fab fa-microsoft"></i> Nuevo Office</a>

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
        <div class="card-header"><strong>Repositorio</strong></div>
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
                    <option value="1">Manual</option>
                    <option value="2">Documento</option>
                    <option value="3">Imagen</option>
                </select>
                    </div> 
                    <div class="form-group col-md-12">
                    <label for="antecedente">Quieres sacar artículos fuera de stock?</label>
                    <div class="custom-control custom-radio custom-control-inline" color:black>
                        <input type="radio" class="custom-control-input perfil" id="stockartsi" name="stockart" value="0" required>
                        <label class="custom-control-label" for="stockartsi">Sí</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline" color:black>
                        <input type="radio" class="custom-control-input perfil" id="stockartno" name="stockart" value="1">
                        <label class="custom-control-label" for="stockartno">No</label>
                    </div>  
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
                    <option value="3">Imagen</option>
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

const addoffice = () => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="modaladdoffice" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Agregar archivo Office </h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form enctype="multipart/form-data" method="POST">
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Título del Office" class="form-control" name="title" id="title" required>
                        </div>
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Descripción del Office"  class="form-control" name="description" id="description" required>
                        </div>
                        <div class="form-group col-md-12"> 
                        <select class="selectpicker form-control" name="mimetype" id="mimetype" required>
                    <option value="" disabled selected>Tipo de Office</option>
                    <option value="application/powerpoint">PowerPoint</option>
                    <option value="application/excel">Excel</option>
                    <option value="application/word">Word</option>
                </select>
                </div>
                        <div class="form-group col-md-12"> 
                        <select class="selectpicker form-control" name="type" id="type" required>
                    <option value="" disabled selected>Tipo</option>
                    <option value="10">PowerPoint</option>
                    <option value="11">Excel</option>
                    <option value="12">Word</option>
                </select>
                    </div> 
                    <div class="form-group col-md-12"> 
                            <input placeholder="Link del archivo - Office.com" type="text" class="form-control" id="link" name="link" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" name="btn" id="btn" onclick="uploadoffice(event)" class=" btn btn-success"><i class="fas fa-check"> Insertar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}


const pdf = (file) => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modalpdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">PDF</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12 text-center"> 
                    <h3>${file.title}</h3>     
                        <embed style="width: 1100px;height: 520px;" data-id_file="${file.id_file}"  id="pdfac" src="${protocol}//${url}/uploads/${file.src}" alt="${file.title}" width="760" height="400" type='application/pdf'>
                    </div>
                    <div class="form-group col-md-12 text-center">     
                        <a data-dismiss="modal" data-id_file="${file.id_file}" id="deletefile" onclick="modaldelete(event)" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a data-src="${protocol}//${url}/uploads/${file.src}" onclick="downloadFile(event)" href="" id="downloadpdf" class="download" style="color:#36b9cc"><i class="fas fa-download"></i></a>
                        <a id="sendmail" onclick="modalmail(event)" href="" class="mail" style="color:#32CD32"><i class="fas fa-paper-plane"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12">     
                    <div class="portfolio-caption text-center">
                    <p class="item-intro text-muted" id="descriptionfile">Descripción: ${file.description}</p>
                    <p class="item-intro text-muted" id="dateregFile">Fecha de Registro: ${file.datereg}</p>
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

const video = (file) => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modalvideo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Video</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12 text-center">      
                    <h3>${file.title}</h3> 
                        <video data-id_file="${file.id_file}"  width="1100" height="520" controls>
                            <source id="videoac" src="${protocol}//${url}/uploads/${file.src}" alt="${file.title}" type="video/mp4" >
                        </video>
                    </div>
                    <div class="form-group col-md-12 text-center">  
                        <a data-dismiss="modal" data-id_file="${file.id_file}" id="deletefile" onclick="modaldelete(event)"class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a data-src="${protocol}//${url}/uploads/${file.src}" id="downloadvideo" href="" class="download" onclick="downloadFile(event)" style="color:#36b9cc"><i class="fas fa-download"></i></a>
                        <a id="sendmail" onclick="modalmail(event)" href="" class="mail" style="color:#32CD32"><i class="fas fa-paper-plane"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12">    
                    <div class="portfolio-caption text-center">
                    <p class="item-intro text-muted" id="descriptionfile">Descripción: ${file.description}</p>
                    <p class="item-intro text-muted" id="dateregFile">Fecha de Registro: ${file.datereg}</p>
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

const image = (file) => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modalimage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Imagen</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12 text-center">  
                    <h3>${file.title}</h3>    
                        <img data-id_file="${file.id_file}" id="imagealt" src="${protocol}//${url}/uploads/${file.src}" alt="" class="img-fluid mx-auto d-block "/>
                    </div>
                    <hr>
                    <div class="form-group col-md-12 text-center">  
                        <a data-dismiss="modal" data-id_file="${file.id_file}" id="deletefile" onclick="modaldelete(event)" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a data-src="${protocol}//${url}/uploads/${file.src}" data-filename="${file.src}" id="download" href="" class="download" onclick="downloadFile(event)" style="color:#36b9cc"><i class="fas fa-download"></i></a>
                        <a data-id_file="${file.id_file}" id="sendmail" onclick="modalmail(event)" href="" class="mail" style="color:#32CD32"><i class="fas fa-paper-plane"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12"> 
                        <div class="portfolio-caption text-center">
                            <p class="item-intro text-muted" id="descriptionfile">Descripción: ${file.description}</p>
                            <p class="item-intro text-muted" id="dateregFile">Fecha de Registro: ${file.datereg}</p>
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

const office = (file) => {
    const div = document.createElement('div')

    const content = ` <div class="portfolio-modal modal fade" id="modaloffice" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Archivo Office</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-12 text-center">  
                    <h3>${file.title}</h3>    
                    <iframe style="width: 1100px;height: 520px;" frameborder="0" scrolling="no" src="${file.src}"></iframe>
                    </div>
                    <hr>
                    <div class="form-group col-md-12 text-center">  
                        <a data-dismiss="modal" data-id_file="${file.id_file}" id="deletefile" onclick="modaldelete(event)" class="trash" style="color:#b50909"><i class="fas fa-trash-alt"></i></a>
                        <a data-src="${file.src}" data-filename="${file.title}" id="download" href="" class="download" onclick="downloadFile(event)" style="color:#36b9cc"><i class="fas fa-download"></i></a>
                        <a data-id_file="${file.id_file}" id="sendmail" onclick="modalmail(event)" href="" class="mail" style="color:#32CD32"><i class="fas fa-paper-plane"></i></a>
                    </div>
                    <hr>
                    <div class="form-group col-md-12"> 
                        <div class="portfolio-caption text-center">
                            <p class="item-intro text-muted" id="descriptionfile">Descripción: ${file.description}</p>
                            <p class="item-intro text-muted" id="dateregFile">Fecha de Registro: ${file.datereg}</p>
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

const deleteFile = (id_file) => {
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
                    <a data-id_file="${id_file}"  onclick="deleteFile(event)" name="btn" id="btn" class=" btn btn-danger"><i class="fas fa-times"> Borrar</i></a>   
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

    const content = ` <div class="form-row p-3" id="${obj.id_file}div">
                          <div class="form-group col-md-12">  
                            <a class="abrir" onclick="modalfile(event)" data-id_file="${obj.id_file}" data-datereg="${obj.datereg}" data-mimetype="${obj.mimetype}" data-src="${obj.filename.replace(/ /g, "%20")}" data-id="${obj.id_file}" data-title="${obj.title}" data-description="${obj.description}" ><img src="${protocol}//${url}/${obj.fakename}" class="thumbnail img-responsive card" style="width:146px; height:146px;"/></a>
                          <div class="form-group col-md-12">
                          <p>${obj.title}</p>
                          </div>
                        </div>`

    div.innerHTML = content

    return div
}


const fileUpload = (obj) => {
    const div = document.createElement('div')

    const content = ` <div class="form-row p-3" id="${obj.id_file}div">
                        <div class="form-group col-md-12">  
                          <a class="abrir" onclick="modalfile(event)" data-id_file="${obj.id_file}" data-datereg="${obj.datereg}" data-mimetype="${obj.mimetype}" data-src="${obj.filename.replace(/ /g, "%20")}" data-id="${obj.id_file}" data-title="${obj.title}" data-description="${obj.description}" ><img src="${protocol}//${url}/${obj.fakename}" class="thumbnail img-responsive card" style="width:146px; height:146px;"/></a>
                          <div class="form-group col-md-12">
                          <p>${obj.title}</p>
                          </div>
                        </div>`

    div.innerHTML = content

    return div
}

const fileOffice = (obj) => {
    const div = document.createElement('div')

    const content = ` <div class="form-row p-3" id="${obj.id_file}div">
                        <div class="form-group col-md-12">  
                          <a class="abrir" onclick="modalfile(event)" data-id_file="${obj.id_file}" data-datereg="${obj.datereg}" data-mimetype="${obj.mimetype}" data-src="${obj.path}" data-title="${obj.title}" data-description="${obj.description}" ><img src="${obj.fakename}" class="thumbnail img-responsive card" style="width:146px; height:146px;"/></a>
                          <div class="form-group col-md-12">
                          <p>${obj.title}</p>
                          </div>
                        </div>`

    div.innerHTML = content

    return div
}

const sendMail = () => {
    const div = document.createElement('div')

    const content = ` <div class="modal fade" id="modalmail" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-wrapper">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-blue">
                    <h4 class="modal-title">Enviar correo electrónico</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
                </div>
                <form action="" method="POST" enctype="multipart/form-data" >
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <input id="for" name="for" type="text" class="form-control" placeholder="Por">
                            </div>
                            <div class="form-group col-md-12">
                                <input name="cc" id="cc" type="text" class="form-control" placeholder="Cc">
                            </div>
                            <div class="form-group col-md-12">
                                <input name="cco" id="cco" type="text" class="form-control" placeholder="Cco">
                            </div>
                            <div class="form-group col-md-12">
                                <input name="title" id="title" type="text" class="form-control" placeholder="Título">
                            </div>
                            <div class="form-group col-md-12">
                                <textarea name="message" type="text"  id="message" class="form-control" placeholder="Mensaje" style="height: 120px;"></textarea>
                            </div>
                            <div class="form-group col-md-12 custom-file">
                                <input type="file" class="custom-file-input" id="attachment" name="attachment">
                                <label class="custom-file-label" for="attachment" name="attachmentname">Adjunto archivo</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times"></i> Cancelar</button>
                        <button type="submit" class="btn btn-success pull-right"><i class="fa fa-envelope"></i> Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> `

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
    fileUpload,
    sendMail,
    addoffice,
    fileOffice,
    office
}