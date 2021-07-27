import { ViewDashboard } from "../views/dashboardView.js"
import { Service } from "../services/powerbiService.js"
import { ServiceHistory } from "../services/historyService.js"

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    let divadmin = document.querySelector('[data-adm]')
    let divitem = document.querySelector('[data-item]')


    let user = JSON.parse(sessionStorage.getItem('user'))

    let perfil = user.perfil
    let history
    let lastupdate
    if (perfil !== 1) {
        divadmin.innerHTML = " "
        divitem.innerHTML = " "
        history = await ServiceHistory.historyDashboard()
        lastupdate = await ServiceHistory.listWebscraping()
    } else {
        history = await ServiceHistory.historyDashboard()
        lastupdate = await ServiceHistory.listWebscraping()
    }

    let title = document.querySelector('[data-title]')

    let cardHistory = document.querySelector('[data-card]')


    ViewDashboard.showCardHistory(cardHistory, history)
    ViewDashboard.showCardBd(cardHistory, lastupdate)


    let name = user.name.substring(0, (user.name + " ").indexOf(" "))
    let username = document.querySelector('[data-username]')
    username.innerHTML = name
    loading.innerHTML = " "
    title.innerHTML = "Informaciones"
}


$("#selectormenu").hover(
    function () {
        $('#navbarResponsive').collapse('show');
        $(".nav-item ").hover(
            function() {
              $(this).children('.collapse').collapse('show');
            }, function() {
              $(this).children('.collapse').collapse('hide');
            }
          );
        }, function () {
        $("#mainNav").hover(function () {
            $('#navbarResponsive').collapse('hide');
            $('.nav-link ').parent('.nav-item ').collapse('hide');
        })
    }
);


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

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

const powerbis = await Service.listComplete()

autocomplete(document.getElementById("searchcomplete"), powerbis);