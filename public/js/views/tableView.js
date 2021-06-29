const header = () => {
    const table = document.createElement('table')

    table.setAttribute("id", "dataTable");
    table.setAttribute("width", "100%");
    table.setAttribute("cellspacing", "0");

    const content =
        `
        <thead data-table-head></thead>
        <tbody data-table-body></tbody>
        `
    table.innerHTML = content

    return table
}


const footer = () => {
    const content =
        `</tbody></table>`

    return content
}



export const ViewTable = {
    header,
    footer
}