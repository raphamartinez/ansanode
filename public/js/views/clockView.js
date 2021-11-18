
const header = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="row justify-content-md-center">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Buscar</h6>
            </div>
            <div class="card-body">
                <form data-form-clock>
                    <div class="form-row">
                    <div class="form-group col-12 text-center align-items-bottom">
                        <h6>Filtrar Período</h6> 
                        </div>
                        <div class="form-group offset-md-3 col-md-3">
                            <h6>Fecha Inicial</h6>
                            <input data-datestart type="date" name="start" id="start" class="form-control"
                                required>
                        </div>
                        <div class="form-group col-md-3">
                            <h6>Fecha Final</h6>
                            <input data-dateend type="date" name="end" id="end" class="form-control"
                                required>
                        </div>
                        <div class="form-group offset-md-3 col-md-2">
                            <select title="Tipo" class="form-control selectpicker" id="type" name="type" data-type>
                                <option value="0" selected>Todos los tipos</option>
                                <option value="1">Entrada</option>
                                <option value="2">Salida</option>
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                            <select title="Sucursal" class="form-control selectpicker" id="office" name="office" multiple
                            data-office>
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                            <select title="Empleados" class="form-control selectpicker" id="code" name="code" multiple
                                data-code>
                            </select>
                        </div>
                        <div class="form-group text-center col-md-12">
                            <button class="btn btn-success" type="submit">Buscar</button>
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
    div.innerHTML = `<div data-div-travels class="row justify-content-md-center">
    <div class="col-10">
        <div class="card shadow mb-4">
            <div class="card-header">
                <div class="form-row">
                    <div class="form-group text-center col-12">
                        <h6 class="m-0 font-weight-bold text-primary">Listado </h6>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="form-group text-center offset-5 col-2">
                    <select class="form-control" id="status" name="status" required style="display:none;"
                        data-status>
                        <option value="0" selected>Todos los status</option>
                        <option value="1">En horário</option>
                        <option value="2">Fuera de horário</option>
                    </select>
                </div>
                <table class="table table-bordered text-center" id="dataClock" width="100%" cellspacing="0"></table>
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