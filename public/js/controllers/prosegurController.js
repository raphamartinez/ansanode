import { Connection } from '../services/connection.js'

const init = async () => {
    const data = await Connection.noBody('prosegur/users', 'GET')

    let dtview = data.map(user => {
        return [
            `<a><i data-drop data-id="${user.id}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
            `${user.code}`,
            `${user.name}`,
            `${user.orden}`,
            `${user.contract}`,
            `${user.office}`,
            `${user.phone}`
        ]
    })

    $("#tableusers").DataTable({
        data: dtview,
        columns: [
            { title: "Opciones" },
            { title: "Cod" },
            { title: "Nombre" },
            { title: "Orden" },
            { title: "Contrato" },
            { title: "Sucursal" },
            { title: "Teléfono" }
        ],
        paging: true,
        ordering: true,
        info: true,
        scrollY: false,
        scrollX: true,
        autoHeight: true,
        scrollCollapse: true,
        responsive: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false
    })

    $("#tableusers").DataTable()
        .columns.adjust();
}

document.querySelector('[data-config-security]').addEventListener('click', init, false)


const submit = async (event) => {
    event.preventDefault();
    try {

        const user = {
            code: event.currentTarget.code.value,
            name: event.currentTarget.name.value,
            orden: event.currentTarget.orden.value,
            contract: event.currentTarget.contract.value,
            phone: event.currentTarget.phone.value,
            office: event.currentTarget.office.value,
        };

        const obj = await Connection.body('prosegur/user', { user }, 'POST');

        document.querySelector('[data-add-prosegur-user]').reset();
        document.querySelector('[data-prosegur-orders]').disabled = true;

        const rowNode = $('#tableusers').DataTable()
            .row
            .add([
                `<a><i data-drop data-id="${obj.id}" class="fas fa-trash" style="color:#CC0000;"></i></a>`,
                `${user.code}`,
                `${user.name}`,
                `${user.orden}`,
                `${user.contract}`,
                `${user.office}`,
                `${user.phone}`
            ])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });

        $('#addproseguruser').modal('hide')

        alert(obj.msg);
    } catch (error) {

    }

}

document.querySelector('[data-add-prosegur-user]').addEventListener('submit', submit, false)

const drop = (event) => {
    event.preventDefault()
    try {
        const tr = event.path[3]
        if (tr.className === "child") tr = tr.previousElementSibling

        const id = event.target.getAttribute("data-id")

        $('#deleteproseguruser').modal('show')

        const submit = async (event2) => {
            event2.preventDefault()

            const obj = await Connection.noBody(`prosegur/user/${id}`, 'DELETE')

            $('#tableusers').DataTable()
                .row(tr)
                .remove()
                .draw();

            $('#deleteproseguruser').modal('hide')

            document.querySelector('[data-drop-prosegur-user]').removeEventListener('submit', submit, false)
            alert(obj.msg)
        }

        document.querySelector('[data-drop-prosegur-user]').addEventListener('submit', submit, false)

    } catch (error) {

    }
}

const action = (event) => {
    if (event.target && event.target.matches('[data-drop]')) return drop(event)
}

document.querySelector('#tableusers').addEventListener('click', action, false)


const changeOffice = async (event) => {

    const value = event.target.value;

    const data = await Connection.noBody(`prosegur/order/${value}`, 'GET')

    const options = document.querySelectorAll('[data-prosegur-orders] option')
    Array.from(options).forEach(option => {
        let obj = data.find(obj => option.value == obj.orden )
        obj ? option.disabled = true : option.disabled = false
    })

    document.querySelector('[data-prosegur-orders]').disabled = false;
}

document.querySelector('[data-prosegur-office]').addEventListener('change', changeOffice, false)


