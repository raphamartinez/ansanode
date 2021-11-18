import { ViewDashboard } from "../views/dashboardView.js"
import { Connection } from '../services/connection.js'


const listFav = () => {

    let array = JSON.parse(localStorage.getItem('favs'))

    if (array) {
        document.querySelector('[data-fav-help]').innerHTML = ""

        array.forEach(arr => {
            const a = document.createElement('a')

            a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
            a.dataset.toggle = "collapse"
            a.dataset.target = "#navbarResponsive"
            a.style.padding = "0rem 0.3rem"
            a.dataset.favaction = arr.action
            a.innerHTML = arr.name

            document.querySelector('[data-favs-list]').appendChild(a)

            document.querySelector(`[${arr.action}]`).setAttribute('data-menu-fav', '1')
        })
    }
}

const listRecents = () => {
    let array = JSON.parse(localStorage.getItem('recents'))

    if (array) {
        array.forEach(arr => {
            const a = document.createElement('a')

            a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
            a.dataset.toggle = "collapse"
            a.dataset.target = "#navbarResponsive"
            a.style.padding = "0rem 0.3rem"
            a.dataset.favaction = arr.action
            a.innerHTML = arr.name

            document.querySelector('[data-recent]').appendChild(a)
        })
    }
}

window.onload = async function () {

    document.querySelector('[data-loading]').style.display = "block"

    let cardHistory = document.querySelector('[data-card]')
    let user = JSON.parse(sessionStorage.getItem('user'))
    let history = await Connection.noBody('history', 'GET')

    ViewDashboard.showCardHistory(cardHistory, history.system)
    ViewDashboard.showCardBd(cardHistory, history.robot)

    $("#perfiladm").attr("data-id_login", user.id_login);

    switch (user.perfil) {
        case 1: {
            let goals = await Connection.noBody('sellersdashboard', 'GET')

            if (goals.length > 0) {
                cardHistory.appendChild(ViewDashboard.showGoals())

                let goaldashboard = document.getElementById('goaldashboard')

                goals.forEach(goal => {
                    goaldashboard.appendChild(ViewDashboard.sellers(goal))
                })
            }
        }
            break;
        case 2: {
            const adms = document.querySelectorAll('[data-adm]')
            Array.from(adms).forEach(adm => {
                adm.remove()
            })
            const items = document.querySelectorAll('[data-item]')
            Array.from(items).forEach(adm => {
                adm.remove()
            })

            const persons = document.querySelectorAll('[data-person]')
            Array.from(persons).forEach(person => {
                person.remove()
            })

            document.querySelector('[data-charge]').remove()
        }
            break;
        case 3: {
            const adms = document.querySelectorAll('[data-adm]')
            Array.from(adms).forEach(adm => {
                adm.remove()
            })
            const items = document.querySelectorAll('[data-item]')
            Array.from(items).forEach(adm => {
                adm.remove()
            })

            const persons = document.querySelectorAll('[data-person]')
            Array.from(persons).forEach(person => {
                person.remove()
            })

            document.querySelector('[data-charge]').remove()
        }
            break;
        case 4: {
            const adms = document.querySelectorAll('[data-adm]')
            Array.from(adms).forEach(adm => {
                adm.remove()
            })
            const items = document.querySelectorAll('[data-item]')
            Array.from(items).forEach(adm => {
                adm.remove()
            })

            const persons = document.querySelectorAll('[data-person]')
            Array.from(persons).forEach(person => {
                person.remove()
            })
        }
            break;
        case 5: {
            const adms = document.querySelectorAll('[data-adm]')
            Array.from(adms).forEach(adm => {
                adm.remove()
            })
            const items = document.querySelectorAll('[data-item]')
            Array.from(items).forEach(adm => {
                adm.remove()
            })

            const persons = document.querySelectorAll('[data-person]')
            Array.from(persons).forEach(person => {
                person.remove()
            })
            document.querySelector('[data-charge]').remove()
        }
            break;
        case 6: {
            const adms = document.querySelectorAll('[data-adm]')
            Array.from(adms).forEach(adm => {
                adm.remove()
            })
            const items = document.querySelectorAll('[data-item]')
            Array.from(items).forEach(adm => {
                adm.remove()
            })

            const persons = document.querySelectorAll('[data-person]')
            Array.from(persons).forEach(person => {
                person.remove()
            })

            const reports = document.querySelectorAll('[data-report]')
            Array.from(reports).forEach(report => {
                report.remove()
            })

            document.querySelector('[data-file-title]').remove()
            document.querySelector('[data-files]').remove()


            const titles = document.querySelectorAll('[data-menu-title]')
            Array.from(titles).forEach(title => {
                title.remove()
            })

            document.querySelector('[data-goals]').remove()
            document.querySelector('[data-management]').remove()
            document.getElementById('perfiladm').remove()
            document.querySelector('[data-salesorder]').remove()
        }
            break;
    }

    document.querySelector('[data-username]').innerHTML = user.name
    document.querySelector('[data-loading]').style.display = "none"
    document.querySelector('[data-title]').innerHTML = "Informaciones"

    listFav()
    listRecents()

    const clickFav = (event) => {
        if (event.target && event.target.matches("[data-favaction]")) {
            event.preventDefault()

            const action = event.target.getAttribute('data-favaction')

            document.querySelector(`[${action}]`).click();
        }
    }

    const showFav = (event) => {
        if (event.target && event.target.nodeName == "A" && !event.target.matches("[data-menu-fav]")) {
            event.target.parentElement.children[0].children[0].classList.add('fas', 'fa-star')
        }
    }

    const links = document.querySelectorAll('[data-div-link]')
    Array.from(links).forEach(link => {
        if (link.children[1] && link.children[1].matches("[data-menu-fav]")) {
            link.children[0].children[0].style.color = '#FFD700'
        } else {
            link.children[0].children[0].classList.remove('fas', 'fa-star')
        }
    })

    const divs = document.querySelectorAll('[data-div-link]')
    Array.from(divs).forEach(div => {
        div.addEventListener('mouseover', showFav, false)
    })


    document.querySelector('[data-fast-btns]').addEventListener('click', clickFav, false)
}

const btnMenu = document.querySelector('[data-selector-menu]')
btnMenu.addEventListener('mouseenter', (event) => {
    $('#navbarResponsive').collapse('show');
})

const modalMenu = document.querySelector('[data-modal-menu]')
modalMenu.addEventListener('mouseleave', (event) => {
    $('#navbarResponsive').collapse('hide');
})

const closeMenu = document.querySelector('[data-close-menu]')
closeMenu.addEventListener('click', (event) => {
    $('#navbarResponsive').collapse('hide');
})

const itemMenu = document.querySelectorAll('[menu-item]')
Array.from(itemMenu).forEach(item => {
    item.addEventListener('mouseenter', (event) => {
        event.target
    })
})

$(document).ready(function () {

    var timer;
    function debounce() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $("[data-fav]").fadeOut('fast');
        }, 250);
    }

    $(".d-block").hover(function () {
        // hover over
        $(this).children().show();
        clearTimeout(timer);
    }, function () {
        // hover out
        debounce();
    });

    $(".d-block").mouseleave(function (e) {
        debounce();
    });

    $(".d-block").mouseenter(function () {
        clearTimeout(timer);
    });
});

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].title.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].title.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].title.substr(val.length);
                b.innerHTML += `<input type='hidden' value='${arr[i].title}' data-url='${arr[i].url}' data-id='${arr[i].id_powerbi}' data-type='${arr[i].type}'>`;
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    inp.dataset.url = this.getElementsByTagName("input")[0].dataset.url
                    inp.dataset.id = this.getElementsByTagName("input")[0].dataset.id
                    inp.dataset.type = this.getElementsByTagName("input")[0].dataset.type
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", (event) => {
        let item = document.getElementById(this.id + "autocomplete-list");
        if (item) item = item.getElementsByTagName("div");
        if (event.keyCode == 40) {
            currentFocus++;
            addActive(item);
        } else if (event.keyCode == 38) {
            currentFocus--;
            addActive(item);
        } else if (event.keyCode == 13) {
            event.preventDefault();
            if (currentFocus > -1) {
                if (item) item[currentFocus].click();
            }
        }
    });

    const addActive = (item) => {
        if (!item) return false;
        removeActive(item);
        if (currentFocus >= item.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (item.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    const removeActive = (items) => {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }
    }

    const closeAllLists = (element) => {
        var items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            if (element != items[i] && element != inp) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

const powerbis = await Connection.noBody('powerbis', 'GET')
autocomplete(document.getElementById("searchcomplete"), powerbis);



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


document.querySelector('[data-form-logout]').addEventListener('submit', async (event) => {
    event.preventDefault()

    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))

    const data = await Connection.body('logout', { refreshToken: refreshToken }, 'POST')

    sessionStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    window.location.href = data.url
})

const addRecent = (event) => {
    let newarray = []
    const div = document.querySelector('[data-recent]')

    const newRecent = {
        name: event.target.outerText,
        action: event.target.getAttribute('data-menu-link')
    }

    let array = JSON.parse(localStorage.getItem('recents'))

    if (array) newarray = array
    if (newarray.length >= 5) {
        array.shift()
        document.querySelector('[data-recent]').children[4].remove()
    }

    let pos = newarray.findIndex(i => i.action === newRecent.action);

    if (pos > -1) {
        newarray.splice(pos, 1)
        div.children[pos].remove()
    }

    newarray.unshift(newRecent)

    localStorage.setItem('recents', JSON.stringify(newarray))

    const a = document.createElement('a')

    a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
    a.dataset.toggle = "collapse"
    a.dataset.target = "#navbarResponsive"
    a.style.padding = "0rem 0.3rem"
    a.dataset.favaction = newRecent.action
    a.innerHTML = newRecent.name

    div.prepend(a)
}

const addFav = (event) => {
    event.preventDefault()
    const div = document.querySelector('[data-favs-list]')

    let newarray = []

    const newfav = {
        name: event.currentTarget.getAttribute('data-fav-name'),
        action: event.currentTarget.getAttribute('data-fav-action')
    }

    let array = JSON.parse(localStorage.getItem('favs'))

    if (array) newarray = array

    let pos = newarray.findIndex(i => i.action === newfav.action);

    if (pos === -1) {

        event.path[2].children[0].setAttribute('data-menu-fav', '1')
        event.path[2].children[0].children[0].style.color = '#FFD700'

        newarray.push(newfav)

        localStorage.setItem('favs', JSON.stringify(newarray))

        const a = document.createElement('a')

        a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
        a.dataset.toggle = "collapse"
        a.dataset.target = "#navbarResponsive"
        a.style.padding = "0rem 0.3rem"
        a.dataset.favaction = newfav.action
        a.innerHTML = newfav.name

        document.querySelector('[data-fav-help]').innerHTML = ""
        div.appendChild(a)
    }else{
        newarray.splice(pos, 1)
        div.children[pos].remove()

        localStorage.setItem('favs', JSON.stringify(newarray))
        event.path[2].children[0].children[0].style.color = '#fff7ba29'

    }
}

const favs = document.querySelectorAll('[data-fav]')

Array.from(favs).forEach(fav => {
    fav.addEventListener('click', addFav, false)
})

const buttons = document.querySelectorAll('[data-menu-link]')

Array.from(buttons).forEach(btn => {
    btn.addEventListener('click', addRecent, false)
})