const listMails = (mail) => {

    const content = [
        `<a onclick="ViewMailPowerbi(event)" href="" data-id_mailpowerbi="${mail.id_mailpowerbi}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>
        <a onclick="modaldeleteMailSchedule(event)" href="" data-id_mailpowerbi="${mail.id_mailpowerbi}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${mail.recipients}`,
        `${mail.cc}`,
        `${mail.cco}`,
        `${mail.title}`,
        `${mail.body}`,
        `${mail.countatt}`,
        `${mail.datereg}`
    ]

    return content
}


const optionSchedule = (date) => {
    const line = document.createElement('option')

    line.value = date

    line.innerHTML = date

    return line
}



const addschedule = (id_mailpowerbi) => {
    const div = document.createElement('div')

    const content = ``

    div.innerHTML = content

    return div

}

export const ViewMail = {
    listMails,
    optionSchedule,
    addschedule,
}