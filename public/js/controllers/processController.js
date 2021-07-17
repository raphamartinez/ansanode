const btnReturn = document.querySelector('[data-return]')

btnReturn.addEventListener('click', async (event) => {
    try {
        const url = '../admin/dashboard.html'
        window.location.href = url
    } catch (error) {
        alert(error)
    }
})


