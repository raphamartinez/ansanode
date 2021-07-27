const sidebar = () => {
    const div = document.createElement('div')

    const content = `
    <div class="border-end bg-white p-5" id="sidebar-wrapper">
    <div class="sidebar-heading border-bottom bg-light"></div>
    <div class="list-group list-group-flush">
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Articulos</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Acceso al depósito</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Repositorio</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Notificaciones</a>
    </div>
</div>
`
    div.innerHTML = content

    return div
}

export const ViewSettings = {
    sidebar
}