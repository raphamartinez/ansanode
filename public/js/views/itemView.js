const buttonsearchstock = (title) => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button type="button" data-toggle="modal" data-target="#search" class="btn btn-success">
            Nueva Consulta
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    title.appendChild(divbtn)

}

const buttonsearchprice = (title) => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button type="button" data-toggle="modal" data-target="#searchPrice" class="btn btn-success">
            Nueva Consulta
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    title.appendChild(divbtn)

}

const showModalSearch = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="search" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="false">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Listado de Stock</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <input type="text" placeholder="Codigo del Articulo" class="form-control" name="artcode" id="artcode">
                    </div> 
                    <div class="form-group col-md-6">          
                    <input type="text" placeholder="Nombre del Artículo" class="form-control" name="itemname" id="itemname">
                </div>
                <div class="form-group col-md-6">   
                <select class="selectpicker form-control" multiple name="itemgroup" id="itemgroup">
                <option value= "" disabled selected>Grupo de Artículo</option>
                </select>        
                </div>
                    <div class="form-group col-md-6">          
                    <select class="selectpicker form-control" multiple name="stock" id="stock">
                    <option value= "" disabled selected>Deposito</option>
                    </select> 
                    </div>
                    <div class="form-group col-md-12">
                    <label for="antecedente">¿Artículos con Stock 0?</label>
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
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" onclick="search(event)" name="btn"  class="btn btn-success"><i class="fas fa-search"> Buscar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const showModalPrice = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="searchPrice" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="false">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Lista de Precios y Saldos</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                <div class="form-group col-md-6">
                <select class="selectpicker form-control"a name="pricelist" id="pricelist" required>
                <option value="MINORISTA">Minorista (Padrón)</option>
                <option value="MAYORISTA">Mayorista</option>
                <option value="PROMOCION">Promocion</option>
                </select>
            </div> 
                    <div class="form-group col-md-6">
                        <input type="text" placeholder="Codigo del Articulo" class="form-control" name="artcode" id="artcode">
                    </div> 
                    <div class="form-group col-md-12">          
                    <input type="text" placeholder="Nombre del Artículo" class="form-control" name="itemname" id="itemname">
                </div>
                <div class="form-group col-md-12">   
                <select class="selectpicker form-control" multiple name="itemgroup" id="itemgroup">
                <option value= "" disabled selected>Grupo de Artículo</option>
                </select>        
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" onclick="searchPrice(event)" name="btn"  class="btn btn-success"><i class="fas fa-search"> Buscar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const showModalGoodyear = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="searchGoodyear" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="false">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Informe Goodyear</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">
                     <h6 class="text-center">Fecha de Inicio</h6>
                        <input type="date" placeholder="Fecha de Inicio" class="form-control" name="datestart" id="datestart">
                    </div> 
                    <div class="form-group col-md-6">
                    <h6 class="text-center">Fecha Final</h6>
                        <input type="date" placeholder="Fecha Final" class="form-control" name="dateend" id="dateend">
                    </div> 
                    <div class="form-group col-md-12">
                    <select class="selectpicker form-control" multiple name="office" id="office" required>
                    <option value= "" disabled selected>Sucursal</option>
                    </select>
                </div> 
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" onclick="searchGoodyear(event)" name="btn"  class="btn btn-success"><i class="fas fa-search"> Buscar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const listOption = (doc) => {
    const line = document.createElement('option')

    line.value = doc

    const content = ` ${doc}</option>`

    line.innerHTML = content

    return line
}

const listItems = (item) => {

    const content = [
        `<a onclick="listStocks(event)" href="" data-artcode="${item.ArtCode}" data-artname="${item.ItemName}" data-cant="${item.StockQty}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
        `${item.ItemGroup}`,
        `${item.ArtCode}`,
        `${item.ItemName}`,
        `${item.StockQty}`,
    ]

    return content
}

const listPrice = (item) => {

    const content = [
        `${item.PriceList}`,
        `${item.ItemGroup}`,
        `${item.ArtCode}`,
        `${item.ItemName}`,
        `${item.Price}`
    ]

    return content
}

const listGoodyear = (item) => {

    const content = [
        `<a onclick="listStocks(event)" href="" data-artcode="${item.ArtCode}" data-artname="${item.ItemName}" data-cant="${item.StockQty}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
        `${item.ArtCode}`,
        `${item.ItemName}`,
        `${item.StockQty}`,
        `${item.SalesQty}`
    ]

    return content
}

const showModalStock = (artname, artcode, cant) => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="modalstock" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
<div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Depositos del Articulo</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form>
            <div class="modal-body">
                <div class="form-row">
                <div class="form-group mb-4 col-md-6 text-center">
                  <strong>Nombre: </strong>${artname}
                </div> 
                <div class="form-group mb-4 col-md-6 text-center">
                  <strong>Código: </strong>${artcode}
                </div> 
                    <div class="form-group col-md-12">
<table  class="table text-center" id="tablestocks">
<thead>
<tr>
        <th scope="col">Deposito</th>
        <th scope="col">Cant Articulos</th>
</tr>
</thead>
<tbody id="tbodystock"></tbody>
</table>
                </div> 
                <hr>
                <div class="form-group col-md-12 text-center">
                <strong>Monto: </strong>${cant}
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Vuelve</button>
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const newLine = (obj) => {
    const line = document.createElement('tr')

    const content =
        ` <th scope="row">${obj.StockDepo}</th>
        <td>${obj.Qty}</td>
      </tr>`

    line.innerHTML = content

    return line
}



const btnNewSearch = () => {
    const btn = document.createElement('button')


    btn.appendChild = '<i class="fas fa-search">Nueva busca</i>'

    return btn
}

const listOffice = (office) => {
    const line = document.createElement('option')

    line.value = office.code

    const content = ` ${office.name}</option>`

    line.innerHTML = content

    return line
}


export const View = {
    showModalSearch,
    listOffice,
    listOption,
    listItems,
    showModalStock,
    showModalPrice,
    newLine,
    btnNewSearch,
    listPrice,
    showModalGoodyear,
    listGoodyear,
    buttonsearchstock,
    buttonsearchprice
}