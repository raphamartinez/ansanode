

const header = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="row justify-content-md-center">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Nuevo Contacto</h6>
            </div>
            <div class="card-body">
                <form data-form-crm>
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="contactdate">Fecha de Contacto</label>
                            <input data-contactdate type="date" name="contactdate" id="contactdate" class="form-control"
                            required>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="client">Cliente</label>
                            <input list="clientlist" type="text" name="client" id="client" placeholder="Informe el cliente" class="form-control" required>
                            <datalist data-client id="clientlist"></datalist>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="name">Nombre del Representante</label>
                            <input data-name type="text" name="name" id="name" placeholder="Representante del cliente" class="form-control"
                            required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="phone">Teléfono</label>
                            <input data-phone type="text" name="phone" id="phone" class="form-control" >
                        </div>
                        <div class="form-group col-md-6">
                            <label for="mail">E-mail</label>
                            <input data-mail type="mail" name="mail" id="mail" class="form-control" >
                        </div>
                        <div class="form-group col-4">
                        <div class="form-row">
                            <div class="form-group col-12">
                            <label for="product">Producto</label>
                            <input list="productlist" class="custom-select" placeholder="Informe lo producto" id="product" name="product">
                            <datalist data-product id="productlist"></datalist>
                            </div>
                            </div>
                            <div class="form-row">
                            <div class="form-group col-12">
                            <label for="classification">Probabilidad de venta</label>
                            <select class="form-control" id="classification">
                                <option value="" disabled selected>Seleccionar</option>
                                <option value="1">-50%</option>
                                <option value="2">50%</option>
                                <option value="3">75%</option>
                                <option value="4">100%</option>
                            </select>
                            </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group text-center col-12">
                                    <button data-add-product class="btn btn-success" type="button">Agregar Producto</button>   
                                </div>
                            </div>
                            <div class="row-fluid">
                            <label for="description">Comentario</label>
                            <textarea data-description placeholder="Comentarios adicionales sobre el contacto" class="form-control" name="description" id="description" rows="3"></textarea>
                        </div>
                        </div>
                        <div class="form-group col-8">
                            <label for="products">Todos los productos ofrecidos</label>
                            <select data-products multiple class="form-control" name="products" id="products"></select>
                        </div>
                        <div class="form-group text-right col-md-12">
                            <button class="btn btn-success" type="submit">Agregar Contacto</button>
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
    div.innerHTML = `
    
    <div class="row justify-content-md-center">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Buscar Contactos</h6>
            </div>
            <div class="card-body">
                <form data-search-crm>
                    <div class="form-row">
                        <div class="form-group col-md-3">
                            <h6>Fecha Inicial</h6>
                            <input data-datestart type="date" name="start" id="start" class="form-control"
                                required>
                        </div>
                        <div class="form-group col-md-3">
                            <h6>Fecha Final</h6>
                            <input data-dateend type="date" name="end" id="end" class="form-control"
                                required>
                        </div>
                        <div class="form-group col-md-3">
                        <h6>Sucursal</h6>
                            <select title="Filtrar sucursal" class="form-control selectpicker office" id="office" name="office" multiple
                            data-office>
                            </select>
                        </div>
                        <div class="form-group col-md-3">
                        <h6>Vendedores</h6>
                            <select title="Filtrar vendedores" class="form-control selectpicker seller" id="code" name="code" multiple
                                data-code>
                            </select>
                        </div>
                        <div class="form-group text-center col-md-12">
                            <button class="btn btn-primary" type="submit">Buscar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 
        
<div data-div-table-crms class="d-none row justify-content-md-center" >
    <div class="col-10" >
        <div class="card shadow mb-4">
            <div class="card-header">
                <div class="form-row">
                    <div class="form-group col-12">
                        <h6 class="m-0 font-weight-bold text-primary">Listado de Contactos</h6>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="form-group text-center offset-5 col-2">
                    <select class="form-control" id="status" name="status" required style="display:none;"
                        data-status>
                        <option value="0" selected>Todos los status</option>
                        <option value="1">De Acuerdo</option>
                        <option value="2">Atención</option>
                    </select>
                </div>
                <table class="table table-bordered text-center" id="dataCrm" width="100%" cellspacing="0"></table>
            </div>
        </div>
    </div>
    </div>`

    return div
}

export const View = {
    header,
    table
}