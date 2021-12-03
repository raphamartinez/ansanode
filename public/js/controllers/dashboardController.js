import { Connection } from '../services/connection.js'

window.listGoalSalesmanId = listGoalSalesmanId
async function listGoalSalesmanId(event) {

    let isExpanded = event.currentTarget.children

    if (isExpanded.length === 1) {

        const card = event.currentTarget
        const id_salesman = card.getAttribute("data-id_salesman")

        let goals = await Connection.noBody(`sellergoal/${id_salesman}`, 'GET')

        let div = document.createElement('div');
        div.className = "collapse col-md-12 sellergoal"

        await goals.forEach(goal => {
            div.appendChild(ViewDashboard.progress(goal))
        })

        card.appendChild(div)

        $('.sellergoal').collapse()
    } else {
        $('.sellergoal').collapse('hide')

        event.currentTarget.children[1].remove()
    }
}