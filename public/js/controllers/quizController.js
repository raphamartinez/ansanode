import { Connection } from '../services/connection.js'
import { View } from "../views/quizView.js"

const chartRadar = () => {
    const ctx = document.querySelector('[data-chart-radar]')

    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Motivacion', 'Social', 'Salud y Ocio', 'Intelectual', 'Financiero', 'Cuidado Personal', 'Crecimiento Personal', 'Carrera', 'Amor'],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',

                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',

                ],
                borderWidth: 3
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "#000",
                    fontSize: 18,
                    fontStyle: "bold"
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    pointLabels: {
                        font: {
                            size: 15,
                            color: "#000",
                            style: "bold"
                        }
                    }
                }
            }
        }
    });


    const viewInterview = async (event) => {
        const option = document.querySelector('[data-names-one] option:checked')
        const id_quiz = option.getAttribute('data-id_quiz')
        const id = event.target.value

        const responses = await Connection.noBody(`interview/${id_quiz}/${id}`, 'GET')

        const divemotion = document.querySelectorAll('[div-attr]')

        let averagedt = []
        responses.forEach(response => {
            averagedt.push(parseFloat(response.average))
        })

        Array.from(divemotion).forEach(div => {
            let response = responses.find(response => response.classification == div.getAttribute('div-attr'))

            if (response) {
                div.innerHTML = response.average
            } else {
                div.innerHTML = "0"
            }
        })

        document.querySelector('[div-attr-min]').innerHTML = Math.min(...averagedt);
        document.querySelector('[div-attr-max]').innerHTML = Math.max(...averagedt);

        let avg = averagedt.reduce((a, b) => a + b)
        avg = avg / averagedt.length

        document.querySelector('[div-attr-average]').innerHTML = avg.toFixed(1)

        chart.data.datasets[0].data = averagedt
        chart.data.datasets[0].label = option.innerHTML
        chart.update();
    }


    document.querySelector('[data-names-one]').addEventListener('change', viewInterview, false)
}


const chartcomparation = () => {
    const ctxcomparation = document.querySelector('[data-chart-comparation]')

    const chartcomparation = new Chart(ctxcomparation, {
        type: 'line',
        data: {
            labels: ['Produtor', 'Integrador', 'Administrador', 'Empreendedor'],
            datasets: [{
                label: 'Condiciones favorables',
                data: [0],
                backgroundColor: [
                    'rgba(24, 226, 147, 0.4)',
                ],
                borderColor: [
                    'rgba(24, 226, 147, 0.9)',
                ],
                borderWidth: 3
            },
            {
                label: 'Condiciones de estr??s',
                data: [0],
                backgroundColor: [
                    'rgba(255, 93, 75, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 93, 75, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });

    const ctxpositive = document.querySelector('[data-chart-positive]')

    const chartpositive = new Chart(ctxpositive, {
        type: 'bar',
        data: {
            labels: ['Produtor', 'Integrador', 'Administrador', 'Empreendedor'],
            datasets: [{
                label: 'Condiciones favorables',
                data: [0],
                backgroundColor: [
                    'rgba(24, 226, 147, 0.4)',
                ],
                borderColor: [
                    'rgba(24, 226, 147, 0.9)',
                ],
                borderWidth: 3
            },
            {
                label: 'Condiciones de estr??s ',
                data: [0],
                backgroundColor: [
                    'rgba(255, 93, 75, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 93, 75, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });

    const viewInterview = async (event) => {
        const option = document.querySelector('[data-names-two] option:checked')
        const id_quiz = option.getAttribute('data-id_quiz')
        const id = event.target.value

        const responses = await Connection.noBody(`interview/${id_quiz}/${id}`, 'GET')

        let maxpositive = 0
        let positive = 0
        let maxnegative = 0
        let negative = 0
        let positivedt = []
        let negativedt = []
        responses.forEach(response => {

            if (response.classification <= 4) {
                if (response.average > maxpositive) {
                    maxpositive = response.average
                    positive = response.classification
                }

                positivedt.push(response.average)
            } else {
                if (response.average > maxnegative) {
                    maxnegative = response.average
                    negative = response.classification
                }

                negativedt.push(response.average)
            }
        })

        switch (positive) {
            case 1:
                positive = "Produtor"
                document.querySelector('[data-letter-emphasis-p]').innerHTML = `Acci??n, Hacer que las cosas sucedan, Le gusta obtener resultados a corto plazo.`
                document.querySelector('[data-letter-time-p]').innerHTML = `Presente`
                document.querySelector('[data-letter-satisfaction-p]').innerHTML = `Le gustan los resultados inmediatos, le gusta hacer que las cosas sucedan y recibir "retroalimentaci??n" sobre sus esfuerzos.??Le gusta estar a cargo.`
                document.querySelector('[data-letter-strong-p]').innerHTML = `Pragm??tico, asertivo, directivo, orientado a resultados, objetivo, competitivo, confiable, basa sus opiniones en hechos.`
                document.querySelector('[data-letter-weak-p]').innerHTML = `No ve a largo plazo, act??a primero y piensa despu??s, arrogante, desconfiando de los dem??s.`
                document.querySelector('[data-letter-phone-p]').innerHTML = `Directo al grano (Corto y grueso).`
                document.querySelector('[data-letter-writing-p]').innerHTML = `Breve, orientado a la acci??n, urgente.`
                document.querySelector('[data-letter-clothing-p]').innerHTML = `Informal, sencillo, funcional, alineado sin exagerar.`
                document.querySelector('[data-letter-house-p]').innerHTML = `Pr??ctico y funcional.`
                document.querySelector('[data-letter-style-p]').innerHTML = `Intuici??n`
                document.querySelector('[data-letter-occupation-p]').innerHTML = `Constructores, pilotos, banqueros, inversores, deportistas profesionales, vendedores, modelos, emprendedores, pioneros.`
                document.querySelector('[data-letter-application-p]').innerHTML = `Pragm??tico, Asertivo, Directivo, Orientado a Resultados, Objetivo, Basado en Hechos, Competitivo, Confiado.`
                document.querySelector('[data-letter-advice-p]').innerHTML = `Habla en t??rminos de resultados;??sea ??????espec??fico y al grano;??reforzar los resultados pasados;??conf??e en su comportamiento de percepci??n (Ej: energ??a, vibraci??n, competitividad, velocidad de acci??n, etc.);??indicar la urgencia en cuanto a plazos, aspectos financieros y resultados;??hablar en t??rminos de corto plazo cuando se trata de planes, resultados del cambio;??enfatizar planes de acci??n;??establecer plazos breves.`
                break
            case 2:
                positive = "Integrador"
                document.querySelector('[data-letter-emphasis-p]').innerHTML = `Sensaci??n, Emociones, Interacciones.`
                document.querySelector('[data-letter-time-p]').innerHTML = `??Pasado`
                document.querySelector('[data-letter-satisfaction-p]').innerHTML = `Le gusta "leer entre l??neas", le gusta promover los contactos sociales.`
                document.querySelector('[data-letter-strong-p]').innerHTML = `Espont??neo, Persuasivo, Emp??tico, Leal, Introspectivo, Se identifica con los valores tradicionales, Se preocupa por los sentimientos de los dem??s.`
                document.querySelector('[data-letter-weak-p]').innerHTML = `Impulsivo, manipulador, excesivamente personalizado, sentimental, subjetivo, estimula conflictos, pospone.??A menudo se ve asaltado por sentimientos de culpa.`
                document.querySelector('[data-letter-phone-p]').innerHTML = `Amable, afable, a veces demasiado.`
                document.querySelector('[data-letter-writing-p]').innerHTML = `Altamente personalizado.`
                document.querySelector('[data-letter-clothing-p]').innerHTML = `Colorido, informal, orientado al estado de ??nimo.`
                document.querySelector('[data-letter-house-p]').innerHTML = `Informal, acogedor, personalizado.`
                document.querySelector('[data-letter-style-p]').innerHTML = `Pensamiento`
                document.querySelector('[data-letter-occupation-p]').innerHTML = `Vendedores, escritores, profesores, relaciones p??blicas, trabajadores sociales, psic??logos, secretarias, animadores y locutores.`
                document.querySelector('[data-letter-application-p]').innerHTML = `Espont??neo, Persuasivo, Emp??tico, Se identifica con los valores tradicionales, cuestionador, Introspectivo, Estimula las relaciones afectivas, leal.`
                document.querySelector('[data-letter-advice-p]').innerHTML = `Muestre apoyo e inter??s;??enfatice su propia necesidad de ayuda;??confiar en su (a) comportamiento sentimental (Ej: entusiasmo, lealtad, sensibilidad, etc.);??muestre reconocimiento por sus logros;??sea ??????emp??tico y comprensivo;??ser alentador??ofrece tu ayuda personal;??estar disponible para una relaci??n m??s cercana y personal;??Sea flexible manteniendo la puerta abierta para negociar.`
                break
            case 3:
                positive = "Administrador"
                document.querySelector('[data-letter-emphasis-p]').innerHTML = `L??gica, Organizaci??n, An??lisis, Consulta Sistem??tica.`
                document.querySelector('[data-letter-time-p]').innerHTML = `Pasado, Presente y Futuro`
                document.querySelector('[data-letter-satisfaction-p]').innerHTML = `Le gusta analizar a fondo un problema para implementar soluciones.??Le gustan las cosas bien organizadas y dise??adas met??dicamente.`
                document.querySelector('[data-letter-strong-p]').innerHTML = `Comunicador eficaz, prudente, estable, objetivo, racional, anal??tico y deliberado.`
                document.querySelector('[data-letter-weak-p]').innerHTML = `Indeciso, muy cauteloso, sobreanalizador, poco din??mica, demasiado serio y r??gido, controlado y controlador.`
                document.querySelector('[data-letter-phone-p]').innerHTML = `Cort??s, profesional.??Habla lenta y r??tmicamente.`
                document.querySelector('[data-letter-writing-p]').innerHTML = `Bien organizado, estructurado espec??fico.`
                document.querySelector('[data-letter-clothing-p]').innerHTML = `Conservador, discreto, combina colores.`
                document.querySelector('[data-letter-house-p]').innerHTML = `Convencional, de buen gusto, organizado, sobrio.`
                document.querySelector('[data-letter-style-p]').innerHTML = `Sentimiento`
                document.querySelector('[data-letter-occupation-p]').innerHTML = `Abogados, ingenieros, profesores, contables, programadores inform??ticos.`
                document.querySelector('[data-letter-application-p]').innerHTML = `Se comunica bien, cuidadoso, prudente, considera alternativas, equilibrado, objetivo, racional, anal??tico.`
                document.querySelector('[data-letter-advice-p]').innerHTML = `Sea l??gico y est?? bien organizado;??ser espec??fico y orientado a los detalles, confiar en su comportamiento racional (Ej: enfoque l??gico, cauteloso, anal??tico, etc.);??vincular los resultados pasados ??????con las preocupaciones presentes y el potencial futuro a corto plazo;??darle suficiente tiempo para cubrir los conceptos b??sicos y todos los detalles;??enfatizar fecha l??mite, evidencias, experiencias previas, detalles, etc.??Solicite planes de cambio detallados;??proporcione tiempo suficiente para obtener resultados de calidad;??Sea expl??cito.`
                break
            case 4:
                positive = "Empreendedor"
                document.querySelector('[data-letter-emphasis-p]').innerHTML = `Ideas, conceptos, teor??as, innovaci??n, enfoque a largo plazo.`
                document.querySelector('[data-letter-time-p]').innerHTML = `Futuro`
                document.querySelector('[data-letter-satisfaction-p]').innerHTML = `Derivado del mundo de las posibilidades, est?? orientado a la resoluci??n de problemas pero no est?? particularmente interesado en implementar soluciones.`
                document.querySelector('[data-letter-strong-p]').innerHTML = `Original, Imaginativo, Creativo, Idealista, Intelectual, Tenaz, Conceptual.`
                document.querySelector('[data-letter-weak-p]').innerHTML = `Irreal, desenfocado, dogm??tico, impr??ctico, fantasioso, desconectado.`
                document.querySelector('[data-letter-phone-p]').innerHTML = `Impersonal, distante, prolijo.`
                document.querySelector('[data-letter-writing-p]').innerHTML = `Escribe de la misma forma que habla: intelectual y usando t??rminos abstractos.`
                document.querySelector('[data-letter-clothing-p]').innerHTML = `Impredecible, no le importan los detalles ni las combinaciones de colores.`
                document.querySelector('[data-letter-house-p]').innerHTML = `Futurista, moderno, creativo`
                document.querySelector('[data-letter-style-p]').innerHTML = `Percepci??n`
                document.querySelector('[data-letter-occupation-p]').innerHTML = `Cient??ficos, investigadores, escritores, maestros, planificadores de negocios.??Profesiones vinculadas a la generaci??n de ideas.`
                document.querySelector('[data-letter-application-p]').innerHTML = `Original, Imaginativo, Creativo, Visi??n Amplia, Carism??tico, Idealista, Intelectual, Conceptual.`
                document.querySelector('[data-letter-advice-p]').innerHTML = `Confiar en su comportamiento intuitivo (a) (Ej: enfoque creativo, visi??n, facilidad para relacionar conceptos, etc.);??permitir que el interlocutor utilice su creatividad y enfoque innovador en el an??lisis de problemas;??expresar su inter??s a largo plazo;??estar orientado al futuro;??hablar en t??rminos de ideas integrales;??conf??e en su forma intelectual de ver las cosas.`
                break
            default:
                positive = "Sin respuesta"
                document.querySelector('[data-letter-emphasis-p]').innerHTML = ``
                document.querySelector('[data-letter-time-p]').innerHTML = ``
                document.querySelector('[data-letter-satisfaction-p]').innerHTML = ``
                document.querySelector('[data-letter-strong-p]').innerHTML = ``
                document.querySelector('[data-letter-weak-p]').innerHTML = ``
                document.querySelector('[data-letter-phone-p]').innerHTML = ``
                document.querySelector('[data-letter-writing-p]').innerHTML = ``
                document.querySelector('[data-letter-clothing-p]').innerHTML = ``
                document.querySelector('[data-letter-house-p]').innerHTML = ``
                document.querySelector('[data-letter-style-p]').innerHTML = ``
                document.querySelector('[data-letter-occupation-p]').innerHTML = ``
                document.querySelector('[data-letter-application-p]').innerHTML = `Sin respuesta`
                document.querySelector('[data-letter-advice-p]').innerHTML = `Sin respuesta`
                break
        }

        switch (negative) {
            case 5:
                negative = "Produtor"
                document.querySelector('[data-letter-emphasis-n]').innerHTML = `Acci??n, Hacer que las cosas sucedan, Le gusta obtener resultados a corto plazo.`
                document.querySelector('[data-letter-time-n]').innerHTML = `Presente`
                document.querySelector('[data-letter-satisfaction-n]').innerHTML = `Le gustan los resultados inmediatos, le gusta hacer que las cosas sucedan y recibir "retroalimentaci??n" sobre sus esfuerzos.??Le gusta estar a cargo.`
                document.querySelector('[data-letter-strong-n]').innerHTML = `Pragm??tico, asertivo, directivo, orientado a resultados, objetivo, competitivo, confiable, basa sus opiniones en hechos.`
                document.querySelector('[data-letter-weak-n]').innerHTML = `No ve a largo plazo, act??a primero y piensa despu??s, arrogante, desconfiando de los dem??s.`
                document.querySelector('[data-letter-phone-n]').innerHTML = `Directo al grano (Corto y grueso).`
                document.querySelector('[data-letter-writing-n]').innerHTML = `Breve, orientado a la acci??n, urgente.`
                document.querySelector('[data-letter-clothing-n]').innerHTML = `Informal, sencillo, funcional, alineado sin exagerar.`
                document.querySelector('[data-letter-house-n]').innerHTML = `Pr??ctico y funcional.`
                document.querySelector('[data-letter-style-n]').innerHTML = `Intuici??n`
                document.querySelector('[data-letter-occupation-n]').innerHTML = `Constructores, pilotos, banqueros, inversores, deportistas profesionales, vendedores, modelos, emprendedores, pioneros.`
                document.querySelector('[data-letter-application-n]').innerHTML = `No razona a largo plazo, Obsesivo en busca de estatus, Egoc??ntrico, act??a primero, piensa despu??s, desconf??a de los dem??s, dominante, arrogante.`
                document.querySelector('[data-letter-advice-n]').innerHTML = `Reuniones largas y detalladas;??insistir en metas a largo plazo;??insistir en que sea organizado, l??gico y racional;??ser vago??dar demasiados detalles a la vez;??ser demasiado intelectual;??hable primero de los "por qu??" en lugar de "qu?? hacer".`
                break
            case 6:
                negative = "Integrador"
                document.querySelector('[data-letter-emphasis-n]').innerHTML = `Sensaci??n, Emociones, Interacciones.`
                document.querySelector('[data-letter-time-n]').innerHTML = `??Pasado`
                document.querySelector('[data-letter-satisfaction-n]').innerHTML = `Le gusta "leer entre l??neas", le gusta promover los contactos sociales.`
                document.querySelector('[data-letter-strong-n]').innerHTML = `Espont??neo, Persuasivo, Emp??tico, Leal, Introspectivo, Se identifica con los valores tradicionales, Se preocupa por los sentimientos de los dem??s.`
                document.querySelector('[data-letter-weak-n]').innerHTML = `Impulsivo, manipulador, excesivamente personalizado, sentimental, subjetivo, estimula conflictos, pospone.??A menudo se ve asaltado por sentimientos de culpa.`
                document.querySelector('[data-letter-phone-n]').innerHTML = `Amable, afable, a veces demasiado.`
                document.querySelector('[data-letter-writing-n]').innerHTML = `Altamente personalizado.`
                document.querySelector('[data-letter-clothing-n]').innerHTML = `Colorido, informal, orientado al estado de ??nimo.`
                document.querySelector('[data-letter-house-n]').innerHTML = `Informal, acogedor, personalizado.`
                document.querySelector('[data-letter-style-n]').innerHTML = `Pensamiento`
                document.querySelector('[data-letter-occupation-n]').innerHTML = `Vendedores, escritores, profesores, relaciones p??blicas, trabajadores sociales, psic??logos, secretarias, animadores y locutores.`
                document.querySelector('[data-letter-application-n]').innerHTML = `Impulsivo, Manipulador, demasiado personalizador, sentimental, dilatorio, dominando el sentimiento de culpa, Estimula los conflictos.`
                document.querySelector('[data-letter-advice-n]').innerHTML = `Permita que pasen largos per??odos de tiempo sin contacto personal;??ser muy exigente;??ser fr??o y distante;??predicar verdades esperando reacciones inmediatas;??ponerlo en situaciones dif??ciles que requieren acciones r??pidas, precisas y anal??ticas;??esperar a que se establezcan los plazos.`
                break
            case 7:
                negative = "Administrador"
                document.querySelector('[data-letter-emphasis-n]').innerHTML = `L??gica, Organizaci??n, An??lisis, Consulta Sistem??tica.`
                document.querySelector('[data-letter-time-n]').innerHTML = `Pasado, Presente y Futuro`
                document.querySelector('[data-letter-satisfaction-n]').innerHTML = `Le gusta analizar a fondo un problema para implementar soluciones.??Le gustan las cosas bien organizadas y dise??adas met??dicamente.`
                document.querySelector('[data-letter-strong-n]').innerHTML = `Comunicador eficaz, prudente, estable, objetivo, racional, anal??tico y deliberado.`
                document.querySelector('[data-letter-weak-n]').innerHTML = `Indeciso, muy cauteloso, sobreanalizador, poco din??mica, demasiado serio y r??gido, controlado y controlador.`
                document.querySelector('[data-letter-phone-n]').innerHTML = `Cort??s, profesional.??Habla lenta y r??tmicamente.`
                document.querySelector('[data-letter-writing-n]').innerHTML = `Bien organizado, estructurado espec??fico.`
                document.querySelector('[data-letter-clothing-n]').innerHTML = `Conservador, discreto, combina colores.`
                document.querySelector('[data-letter-house-n]').innerHTML = `Convencional, de buen gusto, organizado, sobrio.`
                document.querySelector('[data-letter-style-n]').innerHTML = `Sentimiento`
                document.querySelector('[data-letter-occupation-n]').innerHTML = `Abogados, ingenieros, profesores, contables, programadores inform??ticos.`
                document.querySelector('[data-letter-application-n]').innerHTML = `Largo, indeciso, demasiado cauteloso, demasiado anal??tico, impersonal, fr??o y poco din??mico, controlador y demasiado controlado, serio, r??gido.`
                document.querySelector('[data-letter-advice-n]').innerHTML = `Ser demasiado agresivo o dominante;??enfatizar demasiado los resultados finales;??esperar decisiones r??pidas basadas en datos incompletos, ser demasiado emocionales o sentimentales;??use caminos m??s cortos para ahorrar tiempo;??gerencial por crisis;??sobrecarga;??espere que las prioridades se perciban como usted las percibe.`
                break
            case 8:
                negative = "Empreendedor"
                document.querySelector('[data-letter-emphasis-n]').innerHTML = `Ideas, conceptos, teor??as, innovaci??n, enfoque a largo plazo.`
                document.querySelector('[data-letter-time-n]').innerHTML = `Futuro`
                document.querySelector('[data-letter-satisfaction-n]').innerHTML = `Derivado del mundo de las posibilidades, est?? orientado a la resoluci??n de problemas pero no est?? particularmente interesado en implementar soluciones.`
                document.querySelector('[data-letter-strong-n]').innerHTML = `Original, Imaginativo, Creativo, Idealista, Intelectual, Tenaz, Conceptual.`
                document.querySelector('[data-letter-weak-n]').innerHTML = `Irreal, desenfocado, dogm??tico, impr??ctico, fantasioso, desconectado.`
                document.querySelector('[data-letter-phone-n]').innerHTML = `Impersonal, distante, prolijo.`
                document.querySelector('[data-letter-writing-n]').innerHTML = `Escribe de la misma forma que habla: intelectual y usando t??rminos abstractos.`
                document.querySelector('[data-letter-clothing-n]').innerHTML = `Impredecible, no le importan los detalles ni las combinaciones de colores.`
                document.querySelector('[data-letter-house-n]').innerHTML = `Futurista, moderno, creativo`
                document.querySelector('[data-letter-style-n]').innerHTML = `Percepci??n`
                document.querySelector('[data-letter-occupation-n]').innerHTML = `Cient??ficos, investigadores, escritores, maestros, planificadores de negocios.??Profesiones vinculadas a la generaci??n de ideas.`
                document.querySelector('[data-letter-application-n]').innerHTML = `Poco realista, Fuera de foco, En el mundo lunar, Dispersivo, Fuera de l??nea, Fuera de pie, Dogm??tico, NADA Pr??ctico.`
                document.querySelector('[data-letter-advice-n]').innerHTML = `Espere velocidad y comportamiento orientado a la acci??n;??apoy??ndose en un enfoque muy afable y personal;??espero que se lleve bien con mucha gente;??aprovechar a las personas que conoce, las relaciones y la lealtad como formas de influir en los dem??s;??sea ??????demasiado espec??fico;??ser anal??tico y demasiado detallado;??ser demasiado agresivo, dominante o exigente;??esperar contribuciones pragm??ticas y con los pies en la tierra;??Permitir plena autonom??a.`
                break
            default:
                negative = "Sin respuesta"
                document.querySelector('[data-letter-emphasis-n]').innerHTML = ``
                document.querySelector('[data-letter-time-n]').innerHTML = ``
                document.querySelector('[data-letter-satisfaction-n]').innerHTML = ``
                document.querySelector('[data-letter-strong-n]').innerHTML = ``
                document.querySelector('[data-letter-weak-n]').innerHTML = ``
                document.querySelector('[data-letter-phone-n]').innerHTML = ``
                document.querySelector('[data-letter-writing-n]').innerHTML = ``
                document.querySelector('[data-letter-clothing-n]').innerHTML = ``
                document.querySelector('[data-letter-house-n]').innerHTML = ``
                document.querySelector('[data-letter-style-n]').innerHTML = ``
                document.querySelector('[data-letter-occupation-n]').innerHTML = ``
                document.querySelector('[data-letter-application-n]').innerHTML = `Sin respuesta`
                document.querySelector('[data-letter-advice-n]').innerHTML = `Sin respuesta`
                break
        };

        if (positive) {
            document.querySelector('[data-title-max-positive]').innerHTML = `${positive}<span div-max-positive class="badge bg-success rounded-pill text-white">${maxpositive}</span>`
        } else {
            document.querySelector('[data-title-max-positive]').innerHTML = `${positive}<span div-max-positive class="badge bg-success rounded-pill text-white"> - </span>`
        }
        if (negative) {
            document.querySelector('[data-title-max-negative]').innerHTML = `${negative}<span div-max-negative class="badge bg-danger rounded-pill text-white">${maxnegative}</span>`
        } else {
            document.querySelector('[data-title-max-negative]').innerHTML = `${negative}<span div-max-negative class="badge bg-danger rounded-pill text-white"> - </span>`
        }

        document.querySelector('[data-confusion]').innerHTML = ""
        if (positive === negative) document.querySelector('[data-confusion]').innerHTML = `<h5 class="text-warning">En caso de contradicci??nes y/o confusi??nes a la hora de responder el cuestionario, existe la posibilidad que las personalidades en Condici??n Favorable y Condici??n de Estr??s sean iguales.</h5>`

        chartcomparation.data.datasets[0].data = positivedt;
        chartcomparation.data.datasets[1].data = negativedt;
        chartcomparation.update();

        chartpositive.data.datasets[0].data = positivedt;
        chartpositive.data.datasets[1].data = negativedt;
        chartpositive.update();
    }


    document.querySelector('[data-names-two]').addEventListener('change', viewInterview, false);
}


const listQuiz = async () => {

    if ($.fn.DataTable.isDataTable('#dataQuiz')) {
        $('#dataQuiz').dataTable().fnClearTable();
        $('#dataQuiz').dataTable().fnDestroy();
        $('#dataQuiz').empty();
    };

    const quiz = await Connection.noBody('quiz', 'GET');

    let dtquiz = [];

    await quiz.forEach(obj => {
        let options = `<a><i data-action data-title="${obj.title}" data-id="${obj.id}" class="btn-view fas fa-eye"></i></a>
        <a><i data-action data-title="${obj.title}" data-id="${obj.id}" class="btn-send fas fa-envelope" style="color:#00BFFF;"></i></a>`

        const field = [options, obj.title, obj.interviews, obj.datereg]
        dtquiz.push(field)
    });

    await $("#dataQuiz").DataTable({
        destroy: true,
        data: dtquiz,
        columns: [
            { title: "Opciones" },
            { title: "Nombre" },
            { title: "Activos" },
            { title: "Fecha de Registro" }
        ],
        paging: false,
        ordering: true,
        info: false,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        searching: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
}


const view = async (event) => {
    const id_quiz = event.target.getAttribute("data-id");
    const title = event.target.getAttribute("data-title");

    document.querySelector('[data-loading]').style.display = "block";

    const quiz = await Connection.noBody(`viewquiz/${id_quiz}`, 'GET');
    document.querySelector('[data-view-quiz]').innerHTML = "";

    const div = document.createElement('div');
    div.classList.add('mb-2', 'col-lg-12', 'text-center');
    div.innerHTML = `<h5> Cuestionario - ${title}</h5><div data-quiz class="row justify-content-md-center"></div>`;

    document.querySelector('[data-view-quiz]').appendChild(div);

    $('html,body').animate({
        scrollTop: $('[data-view-quiz]').offset().top - 100
    }, 'slow');

    await quiz.forEach(question => {

        if (question.type === "range") {
            document.querySelector('[data-quiz]').appendChild(View.range(question));
        }

        if (question.type === "int") {
            document.querySelector('[data-quiz]').appendChild(View.int(question));
        }
    })
    document.querySelector('[data-loading]').style.display = "none";

    document.querySelector('[data-view-quiz]').addEventListener('change', (event) => {
        if (event.target && event.target.className == "form-range") {
            try {
                let int = parseInt(event.target.value);

                if (int > 0 && int < 0) return event.target.value = 0;

                event.target.parentElement.nextElementSibling.children[0].value = int;
            } catch (error) {
                alert("Car??cter no v??lido, ingrese solo n??meros.")
            }
        }

        if (event.target && event.target.className == "form-control border-3") {
            try {
                let int = parseInt(event.target.value);

                if (int > 10 || int < 0) return event.target.value = 0;

                event.target.parentElement.previousElementSibling.children[0].value = int;
            } catch (error) {
                alert("Car??cter no v??lido, ingrese solo n??meros.");
            }
        }

        if (event.target && event.target.className == "form-control-color me-1") {
            try {
                let int = parseInt(event.target.value);
                let index = event.target.getAttribute('data-index');

                if (int > 4 || int < 0) return event.target.value = 0;

                const lis = event.path[2].children;

                let li1 = lis[0].children[0].getAttribute('data-index');
                if (index !== li1) if (event.target.value === lis[0].children[0].value) lis[0].children[0].value = 0;
                let li2 = lis[1].children[0].getAttribute('data-index');
                if (index !== li2) if (event.target.value === lis[1].children[0].value) lis[1].children[0].value = 0;
                let li3 = lis[2].children[0].getAttribute('data-index');
                if (index !== li3) if (event.target.value === lis[2].children[0].value) lis[2].children[0].value = 0;
                let li4 = lis[3].children[0].getAttribute('data-index');
                if (index !== li4) if (event.target.value === lis[3].children[0].value) lis[3].children[0].value = 0;

            } catch (error) {
                alert("Car??cter no v??lido, ingrese solo n??meros.");
            }
        }
    })
}

const send = (event) => {
    const quiz = {
        id_quiz: event.target.getAttribute('data-id'),
        title: event.target.getAttribute('data-title')
    }

    document.querySelector('[data-modal]').appendChild(View.send());

    $('#send').modal('show');

    document.querySelector('[data-form-send]').addEventListener('submit', async (event) => {
        event.preventDefault();

        document.querySelector('[data-loading]').style.display = "block";

        const date = new Date();
        const user = {
            name: event.currentTarget.name.value,
            mail: event.currentTarget.mail.value,
            datereg: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            status: 0
        };

        const obj = await Connection.body('quiz', { user, quiz }, 'POST');

        $('#send').modal('hide');

        document.querySelector('[data-loading]').style.display = "none";

        alert(obj.msg);
    })
}

document.querySelector('#dataQuiz').addEventListener('click', (event) => {
    if (event.target && event.target.nodeName === "I" && event.target.matches("[data-action]")) {
        if (event.target.classList[0] === 'btn-view') return view(event);
        if (event.target.classList[0] === 'btn-send') return send(event);
    }
})

const listInterview = async () => {

    const interviews = await Connection.noBody('interviews', 'GET');

    interviews.forEach(interview => {
        let select
        switch (interview.id_quiz) {
            case 7:
                select = document.querySelector('[data-names-one]');
                break;
            case 8:
                select = document.querySelector('[data-names-two]');
                break;
        }

        const option = document.createElement('option');
        option.value = interview.id;
        option.dataset.id_quiz = interview.id_quiz;
        option.innerHTML = interview.name;
        select.appendChild(option);
    })

    $('#nameone').selectpicker("refresh");
    $('#nametwo').selectpicker("refresh");
}

listQuiz();
listInterview();

chartRadar();
chartcomparation();

document.querySelector('[data-print-first]').addEventListener('click', async () => {

    const option = document.querySelector('[data-names-one] option:checked');

    if (!option.value) return alert("Seleccione uno nombre.");

    await $("#imgLogo,[data-div-chart-radar], [data-quiz-two-row-two], #break_page, [data-quiz-two-row-three], [data-text-desc-quiz-one]").printThis({
        header: `<div class="sticky-top text-center"><img src="https://informes.americaneumaticos.com.py/img/ansalogomin.png" alt="Logo ANSA"></div>
            <div class="row-fluid mb-2 pt-2 text-center text-primary"><div class="col-12 text-center">
            <h1>Cuestion??rio de Vida - ${document.querySelector('[data-names-one] :checked').innerHTML}</h1>
            </div></div>`,
        footer: `<div class="fixed-bottom text-center"><img src="https://informes.americaneumaticos.com.py/img/ansalogomin.png" alt="Logo ANSA"></div>`,
        pageTitle: `Cuestion??rio de Vida - ${document.querySelector('[data-names-one] :checked').innerHTML}`,
        importStyle: true,
        importCSS: true,
        loadCSS: ['https://informes.americaneumaticos.com.py/css/sb-admin-2.css', 'https://informes.americaneumaticos.com.py/css/style.css', 'https://informes.americaneumaticos.com.py/css/dataTables.bootstrap4.min.css'],
        canvas: true,
    });
});

document.querySelector('[data-print-second]').addEventListener('click', () => {

    const option = document.querySelector('[data-names-two] option:checked');

    if (!option.value) return alert("Seleccione uno nombre.");

    $("[data-div-quiz-two-graph], #break_page_two, [data-div-quiz-two-person], #break_page_three, [data-div-quiz-two-style]").printThis({
        header: `<div class="sticky-top text-center"><img src="https://informes.americaneumaticos.com.py/img/ansalogomin.png" alt="Logo ANSA"></div>
            <div class="row-fluid mb-2 pt-2 text-center text-primary"><div class="col-12 text-center">
            <h1>Cuestion??rio de Personalidad - ${document.querySelector('[data-names-two] :checked').innerHTML}</h1>
            </div></div>`,
        footer: `<div class="fixed-bottom text-center"><img src="https://informes.americaneumaticos.com.py/img/ansalogomin.png" alt="Logo ANSA"></div>`,
        pageTitle: `Cuestion??rio de Personalidad - ${document.querySelector('[data-names-two] :checked').innerHTML}`,
        importStyle: true,
        importCSS: true,
        loadCSS: ['https://informes.americaneumaticos.com.py//css/sb-admin-2.css', 'https://informes.americaneumaticos.com.py//css/style.css', 'https://informes.americaneumaticos.com.py//css/dataTables.bootstrap4.min.css'],
        canvas: true,
    });
});

