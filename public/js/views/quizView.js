const time = (time) => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="init" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Quieres deshabilitar este usuario?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-delete>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="col-md-12">
                            <h8>Tienes ${time} minutos para terminar la prueba, ¿quieres empezar ahora?
                            Una vez que expire el tiempo, no se agregarán respuestas.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger"><i class="fas fa-times"> Sí lo deseo.</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const range = (question, id_interview) => {
    const div = document.createElement('div')
    div.classList.add('col-lg-8', 'text-center', 'mb-2')
    div.dataset.quiz

    div.innerHTML = ` 
    <div class="card shadow">
        <div class="card-header text-primary" data-title>
            ${question.title}
        </div>
        <div class="card-body">
            <div class="form-row">
                <div class="form-group col-md-11">
                    <input type="range" class="form-range" min="0" max="10" step="1" value="0" data-id_interview="${id_interview}" data-id="${question.id}"
                        id="customRange3">
                </div>
                <div class="form-group col-md-1 align-items-center justify-content-center">
                    <input type="number" class="form-control border-3" min="0" max="10" step="1" value="0" data-id_interview="${id_interview}" data-id="${question.id}"
                        id="customRange3">
                </div>
            </div>
        </div>
    </div>`

    return div
}

const int = (question, id_interview) => {
    const div = document.createElement('div')
    div.classList.add('col-lg-8', 'text-center', 'mb-2')
    div.dataset.quiz

    div.innerHTML = ` 
    <div class="card shadow">
    <div class="card-header text-primary" data-title>
         ${question.title}
    </div>
    <div class="card-body">
        <div class="form-row">
            <div class="form-group text-left col-md-12">
                <ul class="list-group">
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[0].id}" data-index="1">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[0].title}
                    </li>
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[1].id}" data-index="2">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[1].title}
                        </li>
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[2].id}" data-index="3">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[2].title}
                        </li>
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[3].id}" data-index="4">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[3].title}
                        </li>
                  </ul>
            </div>
        </div>
    </div>
</div>`

    return div
}

const send = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="send" tabindex="-1" >
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Enviar Cuestionario</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-send>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Nombre" class="form-control" name="name" id="name" required>
                        </div>
                        <div class="form-group col-md-12">
                        <input placeholder="Email del destinatario" class="form-control" id="mail" name="mail" type="email" required>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success" ><i class="fas fa-paper-plane"> Enviar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>`

    return div
}

const table = () => {
    const div = document.createElement('div')
    div.innerHTML = `
`

    return div
}


const view = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    `

    return div
}


const title1 = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="col-md-12 mb-2 text-center"><p class="h6">Esta es una herramienta muy eficaz para mejorar el equilibrio de tu vida. Te ayuda a identificar gráficamente las áreas en tu vida en las cuáles hay que dedicarles más energía y más trabajo, y en muy poco tiempo. También te ayuda a entender en donde necesitas establecer un límite.</p></div>`

    return div
}

const title2 = () => {
    const div = document.createElement('div')
    div.classList.add('row', 'mb-2')

    div.innerHTML = `
    <div class="col-md-12 mb-2 text-center text-primary"><p class="h5">No es posible acertar o equivocarse en este cuestionario.</p></div>


    <div class="col-md-12 mb-2 text-center"><p class="h6">Básicamente, este es un instrumento que le permite describir los estilos relativos que utiliza en su relación con los demás. Leerá una serie de declaraciones autodescriptivas, donde cada declaración es seguida por cuatro alternativas diferentes. deberá indicar el orden en el que cree que cada alternativa es relevante para usted.</p></div>

    <div class="col-md-12 mb-2 text-center"><p class="h6">En la hoja de respuestas a la derecha de cada alternativa, indique el número (4,3,2 o 1) según la alternativa que más le parezca.</p></div>

    <div class="row">
        <div class="col-md-6 offset-md-3 mb-2 list-group text-center">
        <label>Use el número:</label>
           <a href="#" class="list-group-item list-group-item-action list-group-item-success">4 para la alternativa que más le parezca</a>
           <a href="#" class="list-group-item list-group-item-action list-group-item-info">3 para el próximo más cercano</a>
           <a href="#" class="list-group-item list-group-item-action list-group-item-warning">2 para el siguiente y el número</a>
           <a href="#" class="list-group-item list-group-item-action list-group-item-danger">1 para la alternativa que le parezca menos</a>
      </div>
    </div>


    <div class="col-md-12 mb-2 text-center text-secondary"><p class="h6">Use cada número solo una vez. Incluso si dos de las alternativas están muy cerca, marque ambas.</p></div>
    <div class="col-md-12 mb-2 text-center text-secondary">Use todos los números en la hoja de respuestas.</p></div>
`

    return div
}

export const View = {
    table,
    time,
    range,
    int,
    send,
    view,
    title1,
    title2
}