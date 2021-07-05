const showModalSearch = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="search" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="false">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Listar Articulos</h5>
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
                        <input type="text" placeholder="Código do Articulo" class="form-control" name="artcode" id="artcode">
                    </div> 
                    <div class="form-group col-md-12">          
                    <input type="text" placeholder="Nombre do Articulo" class="form-control" name="itemname" id="itemname">
                </div>
                <div class="form-group col-md-6">   
                <select class="selectpicker form-control" multiple name="itemgroup" id="itemgroup">
                <option value="" disabled selected>Grupo de Articulo</option>
                </select>        
                </div>
                    <div class="form-group col-md-6">          
                    <select class="selectpicker form-control" multiple name="stock" id="stock">
                    <option value="" disabled selected>Deposito</option>
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
        `${item.PriceList}`,
        `${item.ItemGroup}`,
        `${item.ArtCode}`,
        `${item.ItemName}`,
        `${item.Price}`,
        `${item.StockQty}`,
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

    btn.classList.add("btn btn-primary")

    btn.appendChild= '<i class="fas fa-search">Nueva busca</i>'

    return btn
}


export const View = {
    showModalSearch,
    listOption,
    listItems,
    showModalStock,
    newLine,
    btnNewSearch
}