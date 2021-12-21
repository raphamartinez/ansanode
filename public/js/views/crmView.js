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

export const View = {
    drop
}