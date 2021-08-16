const sidebar = () => {
    const div = document.createElement('div')

    const content = `
    <div class="container-fluid">

    <div class="row gutters-sm">
      <div class="col-md-4 d-none d-md-block">
        <div class="card">
          <div class="card-body">
            <nav class="nav flex-column text-left nav-pills nav-gap-y-1">
              <a href="#profile" data-toggle="tab" class="nav-item nav-link has-icon nav-link-faded active">
              <i class="fas fa-file"> Archivos</i>
              </a>
              <a onclick="mailList(event)" href="#account" data-toggle="tab" class="nav-item nav-link has-icon nav-link-faded">
              <i class="fas fa-envelope"> Correo electrónico</i>  
              </a>
              <a href="#security" data-toggle="tab" class="nav-item nav-link has-icon nav-link-faded">
              <i class="fas fa-shield-alt"> Seguridad</i>  
              </a>
              <a href="#notification" data-toggle="tab" class="nav-item nav-link has-icon nav-link-faded">
              <i class="fas fa-bell"> Notificaciones</i>  
              </a>
            </nav>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-header border-bottom mb-3 d-flex d-md-none">
            <ul class="nav nav-tabs card-header-tabs nav-gap-x-1" role="tablist">
              <li class="nav-item">
                <a href="#profile" data-toggle="tab" class="nav-link has-icon active"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></a>
              </li>
              <li class="nav-item">
                <a href="#account" data-toggle="tab" class="nav-link has-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></a>
              </li>
              <li class="nav-item">
                <a href="#security" data-toggle="tab" class="nav-link has-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></a>
              </li>
              <li class="nav-item">
                <a href="#notification" data-toggle="tab" class="nav-link has-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></a>
              </li>
            </ul>
          </div>
          <div class="card-body tab-content">
            <div class="tab-pane active" id="profile">
              <h6>Ajustes de Archivo</h6>
              <hr>
              <form>
                <div class="form-group">
                  <label for="fullName">URL de descarga</label>
                  <input type="text" class="form-control" id="fullName" aria-describedby="fullNameHelp" placeholder="System" value="System">
                  <small id="fullNameHelp" class="form-text text-muted">Puede descargar el archivo a un repositorio en un servidor interno.</small>
                </div>
                <button type="button" class="btn btn-primary">Actualizar URL</button>
                <button type="reset" class="btn btn-secondary">Restablecer modificaciones</button>
              </form>
            </div>
            <div class="tab-pane" id="account">
              <h6>Ajustes de Correo Electrônico</h6>
              <hr>
              <div class="form-group">
              <button onclick="modaladdmail(event)" type="button" class="btn btn-success">Nuevo correo electrónico</button>
              </div>
              <div class="form-group">
              <table class="table table-bordered" id="tablemail" ></table>
              </div>
            </div> 
            <div class="tab-pane" id="security">
              <h6>Ajustes de Seguridad</h6>
              <hr>
              Hasta ahora no hay ajustes.
            </div>
            <div class="tab-pane" id="notification">
              <h6>Ajustes de notificaciones y correos electrónicos 
              </h6>
              <hr>
              <form>
                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1" checked="">
                    <label class="custom-control-label" for="customCheck1">Reciba correos electrónicos automáticos</label>
                  </div>
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck2" checked="">
                    <label class="custom-control-label" for="customCheck2">Reciba notificaciones automáticas</label>
                  </div>
                </div>
                <div class="form-group mb-0">
                  <ul class="list-group list-group-sm">
                    <li class="list-group-item has-icon">
                    Nuevos informes
                      <div class="custom-control custom-control-nolabel custom-switch ml-auto">
                        <input type="checkbox" class="custom-control-input" id="customSwitch1" checked="">
                        <label class="custom-control-label" for="customSwitch1"></label>
                      </div>
                    </li>
                    <li class="list-group-item has-icon">
                    Nuevos Stocks
                      <div class="custom-control custom-control-nolabel custom-switch ml-auto">
                        <input type="checkbox" class="custom-control-input" id="customSwitch2">
                        <label class="custom-control-label" for="customSwitch2"></label>
                      </div>
                    </li>
                    <li class="list-group-item has-icon">
                    Nuevos correos electrónicos programados 
                      <div class="custom-control custom-control-nolabel custom-switch ml-auto">
                        <input type="checkbox" class="custom-control-input" id="customSwitch3" checked="">
                        <label class="custom-control-label" for="customSwitch3"></label>
                      </div>
                    </li>
                    <li class="list-group-item has-icon">
                    Nuevos archivos
                      <div class="custom-control custom-control-nolabel custom-switch ml-auto">
                        <input type="checkbox" class="custom-control-input" id="customSwitch4" checked="">
                        <label class="custom-control-label" for="customSwitch4"></label>
                      </div>
                    </li>
                    <li class="list-group-item has-icon">
                    Alertas
                      <div class="custom-control custom-control-nolabel custom-switch ml-auto">
                        <input type="checkbox" class="custom-control-input" id="customSwitch5">
                        <label class="custom-control-label" for="customSwitch5"></label>
                      </div>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
`
    div.innerHTML = content

    return div
}

export const ViewSettings = {
    sidebar
}