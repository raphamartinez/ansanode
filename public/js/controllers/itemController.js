// import { View } from "../views/itemView.js"
// import { Connection } from '../services/connection.js'

// window.listItems = listItems

// async function listItems() {

//     let loading = document.querySelector('[data-loading]')
//     try {

//         const fields = await Connection.noBody('stockuser', 'GET')

//         if (fields === false) {
//             return alert("No tiene acceso a ningún stock, solicite acceso a un administrador.")
//         }

//         loading.style.display = "block"


//         let title = document.querySelector('[data-title]')
//         let powerbi = document.querySelector('[data-powerbi]')
//         const cardHistory = document.querySelector('[data-card]')
//         let modal = document.querySelector('[data-modal]')
//         let settings = document.querySelector('[data-settings]');
//         document.querySelector('[data-features]').innerHTML = ""

//         settings.innerHTML = ''
//         modal.innerHTML = " "

//         if ($.fn.DataTable.isDataTable('#dataTable')) {
//             $('#dataTable').dataTable().fnClearTable();
//             $('#dataTable').dataTable().fnDestroy();
//             $('#dataTable').empty();
//         }

//         title.innerHTML = "Listado de Stock"
//         View.buttonsearchstock(title)

//         powerbi.innerHTML = " "
//         cardHistory.style.display = 'none';

//         modal.appendChild(View.showModalSearch())
//         const selectstock = document.getElementById('stock')
//         const selectitemgroup = document.getElementById('itemgroup')

//         fields.stocks.forEach(obj => {
//             selectstock.appendChild(View.listOption(obj.StockDepo))
//         });

//         fields.groups.forEach(obj => {
//             selectitemgroup.appendChild(View.listOption(obj.Name))
//         });
//         $('#stock').selectpicker();
//         $('#itemgroup').selectpicker();
//         document.getElementById("stockartsi").checked = true;

//         const items = await Connection.noBody('itemscomplete', 'GET')

//         autocompletecod(document.getElementById("artcode"), items);
//         autocompletename(document.getElementById("itemname"), items);

//         loading.style.display = "none"
//         $('#search').modal('show')

//     } catch (error) {

//     }
// }



// window.listStocks = listStocks

// async function listStocks(event) {
//     event.preventDefault()

//     let loading = document.querySelector('[data-loading]')
//     loading.style.display = "block"

//     let modal = document.querySelector('[data-modal]')
//     const btn = event.currentTarget
//     const artcode = btn.getAttribute("data-artcode")
//     const artname = btn.getAttribute("data-artname")
//     const cant = btn.getAttribute("data-cant")

//     modal.innerHTML = ''
//     modal.appendChild(View.showModalStock(artname, artcode, cant))

//     const data = await Connection.noBody(`stockbyitem/${artcode}`, 'GET')

//     let tbodystock = document.getElementById('tbodystock')

//     tbodystock.innerHTML = ''

//     data.forEach(obj => {
//         tbodystock.appendChild(View.newLine(obj))
//     });

//     const items = await Connection.noBody('itemscomplete', 'GET')
//     autocompletecod(document.getElementById("artcode"), items);
//     autocompletename(document.getElementById("itemname"), items);

//     loading.style.display = "none"
//     $('#modalstock').modal('show')
// }


// window.listPrice = listPrice

// async function listPrice() {

//     let loading = document.querySelector('[data-loading]')
//     try {

//         const fields = await Connection.noBody('stockuser', 'GET')
//         if (fields === false) {
//             return alert("No tiene acceso a ningún stock para ver los artículos, solicite acceso a un administrador.")
//         }

//         loading.style.display = "block"

//         let title = document.querySelector('[data-title]')
//         let powerbi = document.querySelector('[data-powerbi]')
//         const cardHistory = document.querySelector('[data-card]')
//         let modal = document.querySelector('[data-modal]')
//         let settings = document.querySelector('[data-settings]');
//         document.querySelector('[data-features]').innerHTML = ""

//         modal.innerHTML = " "
//         modal.appendChild(View.showModalPrice())

//         if ($.fn.DataTable.isDataTable('#dataTable')) {
//             $('#dataTable').dataTable().fnClearTable();
//             $('#dataTable').dataTable().fnDestroy();
//             $('#dataTable').empty();
//         }

//         title.innerHTML = "Lista de Precios y Saldos"
//         View.buttonsearchprice(title)
//         powerbi.innerHTML = " "
//         cardHistory.style.display = 'none';
//         settings.innerHTML = " "


//         const selectitemgroup = document.getElementById('itemgroup')

//         fields.groups.forEach(obj => {
//             selectitemgroup.appendChild(View.listOption(obj.Name))
//         });
//         $('#itemgroup').selectpicker();
//         const items = await Connection.noBody('itemscomplete', 'GET')

//         autocompletecod(document.getElementById("artcode"), items);
//         autocompletename(document.getElementById("itemname"), items);

//         loading.style.display = "none"
//         $('#searchPrice').modal('show')

//     } catch (error) {

//     }
// }

// window.searchPrice = searchPrice

// async function searchPrice(event) {
//     event.preventDefault()
//     $('#searchPrice').modal('hide')

//     let loading = document.querySelector('[data-loading]')
//     loading.style.display = "block";

//     try {

//         const btn = event.currentTarget
//         const pricelist = btn.form.pricelist.value
//         const arritemgroup = document.querySelectorAll('#itemgroup option:checked')
//         const itemgroup = Array.from(arritemgroup).map(el => `'${el.value}'`);

//         const artcode = btn.form.artcode.value
//         const itemname = btn.form.itemname.value

//         const search = {
//             pricelist: pricelist,
//             itemgroup: itemgroup,
//             artcode: artcode,
//             itemname: itemname
//         }

//         const data = await Connection.body('price', { search: search }, 'POST')

//         let dtview = [];
//         data.forEach(obj => {
            // const field = View.listPrice(obj)
//             dtview.push(field)
//         });

//         let title = document.querySelector('[data-title]')

//         if ($.fn.DataTable.isDataTable('#dataTable')) {
//             $('#dataTable').dataTable().fnClearTable();
//             $('#dataTable').dataTable().fnDestroy();
//             $('#dataTable').empty();
//         }

//         title.innerHTML = ``

//         title.innerHTML = "Lista de Precios y Saldos"
//         View.buttonsearchprice(title)
//         const text = document.createElement('h5')
//         text.style.color = 'gray'
//         text.style.fontSize = '1rem'
//         text.style.alignContent = 'left'

//         text.innerHTML += `<br>Filtros<br>`
//         if (itemgroup.length > 0) text.innerHTML += `Grupo de Artículo: ${itemgroup}<br>`
//         if (pricelist) text.innerHTML += `Promocion: ${pricelist}<br>`
//         if (artcode) text.innerHTML += `Cod: ${artcode}<br>`
//         if (itemname) text.innerHTML += `Articulo: ${itemname}`

//         title.appendChild(text)

//         let user = JSON.parse(sessionStorage.getItem('user'))

//         let perfil = user.perfil

//         if (perfil !== 1) {
//             $(document).ready(function () {
//                 $("#dataTable").DataTable({
//                     data: dtview,
//                     columns: [
//                         { title: "Promocion" },
//                         { title: "Grupo" },
//                         { title: "Cod Articulo" },
//                         { title: "Nombre" },
//                         { title: "Precio" }
//                     ],
//                     paging: true,
//                     ordering: true,
//                     info: true,
//                     scrollY: false,
//                     scrollCollapse: true,
//                     scrollX: true,
//                     autoHeight: true,
//                     lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
//                     pagingType: "numbers",
//                     searchPanes: true,
//                     fixedHeader: false
//                 }
//                 )
//             })
//         } else {
//             $(document).ready(function () {
//                 $("#dataTable").DataTable({
//                     data: dtview,
//                     columns: [
//                         { title: "Promocion" },
//                         { title: "Grupo" },
//                         { title: "Cod Articulo" },
//                         { title: "Nombre" },
//                         { title: "Precio" }
//                     ],
//                     paging: true,
//                     ordering: true,
//                     info: true,
//                     scrollY: false,
//                     scrollCollapse: true,
//                     scrollX: true,
//                     autoHeight: true,
//                     lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
//                     pagingType: "numbers",
//                     searchPanes: true,
//                     fixedHeader: false,
//                     dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
//                         "<'row'<'col-sm-12'tr>>" +
//                         "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
//                         "<'row'<'col-sm-12'B>>",
//                     buttons: [
//                         'copy', 'csv', 'excel', 'pdf', 'print'
//                     ]
//                 }
//                 )
//             })

//             $('#itemgroup').val('')
//             $('#artcode').val('')
//             $('#itemname').val('')
//         }
//         loading.style.display = "none"
//     } catch (error) {
//         console.log(error);
//         loading.style.display = "none"
//         alert(error)
//     }
// }


// window.listGoodyear = listGoodyear

// async function listGoodyear() {

//     let loading = document.querySelector('[data-loading]')
//     loading.style.display = "block";

//     try {
//         let title = document.querySelector('[data-title]')
//         let powerbi = document.querySelector('[data-powerbi]')
//         const cardHistory = document.querySelector('[data-card]')
//         let modal = document.querySelector('[data-modal]')
//         let settings = document.querySelector('[data-settings]');
//         document.querySelector('[data-features]').innerHTML = ""

//         settings.innerHTML = " "
//         modal.innerHTML = " "
//         powerbi.innerHTML = " "
//         cardHistory.style.display = 'none';
//         modal.appendChild(View.showModalGoodyear())

        // const offices = await Connection.noBody('offices', 'GET')
        // const divoffice = document.getElementById('office')
        // offices.forEach(office => {
        //     divoffice.appendChild(View.listOffice(office))
        // });
        // $('#office').selectpicker();
        // $('#itemgroup').selectpicker();

//         if ($.fn.DataTable.isDataTable('#dataTable')) {
//             $('#dataTable').dataTable().fnClearTable();
//             $('#dataTable').dataTable().fnDestroy();
//             $('#dataTable').empty();
//         }

//         title.innerHTML = "Informe Goodyear"
//         View.buttonsearchgoodyear(title)

//         loading.style.display = "none"
//         $('#searchGoodyear').modal('show')
//     } catch (error) {
//     }
// }


// window.searchGoodyear = searchGoodyear

// async function searchGoodyear(event) {
//     event.preventDefault()

//     try {

        // const btn = event.currentTarget
        // const datestart = btn.form.datestart.value
        // const dateend = btn.form.dateend.value
        // const arroffice = document.querySelectorAll('#office option:checked')
        // const office = Array.from(arroffice).map(el => `'${el.value}'`);
        // const arritemgroup = document.querySelectorAll('#itemgroup option:checked')
        // const itemgroup = Array.from(arritemgroup).map(el => `'${el.value}'`);

        // const search = {
        //     datestart: datestart,
        //     dateend: dateend,
        //     office: office,
        //     itemgroup: itemgroup
        // }

        // if (!datestart || !dateend) return alert("¡El período es obligatorio!")

//         $('#searchGoodyear').modal('hide')

//         let loading = document.querySelector('[data-loading]')
//         loading.style.display = "block";

//         const data = await Connection.body('goodyear', { search: search }, 'POST')
//         let dtview = [];
//         data.forEach(obj => {
//             const field = View.listGoodyear(obj)
//             dtview.push(field)
//         });

//         let title = document.querySelector('[data-title]')
//         title.innerHTML = `Informe Goodyear`
//         View.buttonsearchgoodyear(title)

//         const text = document.createElement('h5')
//         text.style.color = 'gray'
//         text.style.fontSize = '1rem'
//         text.style.alignContent = 'left'

//         text.innerHTML += `<br>Filtros<br>`
//         if (office.length > 0) text.innerHTML += `<br>Sucursal: ${office}<br>`
//         if (itemgroup.length > 0) text.innerHTML += `<br>Grupo de Item: ${itemgroup}<br>`
//         if (datestart && dateend) text.innerHTML += `Curso del Tiempo ${datestart} até ${dateend}<br>`

//         title.appendChild(text)

//         let user = JSON.parse(sessionStorage.getItem('user'))

//         let perfil = user.perfil

//         if ($.fn.DataTable.isDataTable('#dataTable')) {
//             $('#dataTable').dataTable().fnClearTable();
//             $('#dataTable').dataTable().fnDestroy();
//             $('#dataTable').empty();
//         }

//         if (perfil !== 1) {
//             $(document).ready(function () {
//                 $("#dataTable").DataTable({
//                     data: dtview,
//                     columns: [
                        // { title: "Opciones" },
                        // { title: "Cod Articulo" },
                        // { title: "Nombre" },
                        // { title: "Cant Stock" },
                        // { title: "Cant Vendido" }
                    // ],
//                     paging: true,
//                     ordering: true,
//                     info: true,
//                     scrollY: false,
//                     scrollCollapse: true,
//                     scrollX: true,
//                     autoHeight: true,
//                     lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
//                     pagingType: "numbers",
//                     searchPanes: true,
//                     fixedHeader: false
//                 }
//                 )
//             })
//         } else {
//             $(document).ready(function () {
//                 $("#dataTable").DataTable({
//                     data: dtview,
//                     columns: [
//                         { title: "Opciones" },
//                         { title: "Cod Articulo" },
//                         { title: "Nombre" },
//                         { title: "Cant Stock" },
//                         { title: "Cant Vendido" }
//                     ],
//                     paging: true,
//                     ordering: true,
//                     info: true,
//                     scrollY: false,
//                     scrollCollapse: true,
//                     scrollX: true,
//                     autoHeight: true,
//                     lengthMenu: [[50, 100, 150, 200], [50, 100, 150, 200]],
//                     pagingType: "numbers",
//                     searchPanes: true,
//                     fixedHeader: false,
//                     dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
//                         "<'row'<'col-sm-12'tr>>" +
//                         "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
//                         "<'row'<'col-sm-12'B>>",
//                     buttons: [
//                         'copy', 'csv', 'excel', 'pdf', 'print'
//                     ]
//                 }
//                 )
//             })
//         }

//         loading.style.display = "none"
//     } catch (error) {
//         console.log(error);
//         loading.style.display = "none"
//         alert(error)
//     }
// }


// function autocompletecod(inp, arr) {
//     var currentFocus;
//     inp.addEventListener("input", function (e) {
//         var a, b, i, val = this.value;
//         closeAllLists();
//         if (!val) { return false; }
//         currentFocus = -1;
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         this.parentNode.appendChild(a);
//         for (i = 0; i < arr.length; i++) {
//             if (arr[i].ArtCode.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//                 b = document.createElement("DIV");
//                 b.innerHTML = "<strong>" + arr[i].ArtCode.substr(0, val.length) + "</strong>";
//                 b.innerHTML += arr[i].ArtCode.substr(val.length);
//                 b.innerHTML += `<input type='hidden' value='${arr[i].ArtCode}'>`;
//                 b.addEventListener("click", function (e) {
//                     inp.value = this.getElementsByTagName("input")[0].value;
//                     closeAllLists();
//                 });
//                 a.appendChild(b);
//             }
//         }
//     });

//     inp.addEventListener("keydown", function (e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//             currentFocus++;
//             addActive(x);
//         } else if (e.keyCode == 38) {
//             currentFocus--;
//             addActive(x);
//         } else if (e.keyCode == 13) {
//             e.preventDefault();
//             if (currentFocus > -1) {
//                 if (x) x[currentFocus].click();
//             }
//         }
//     });
//     function addActive(x) {
//         if (!x) return false;
//         removeActive(x);
//         if (currentFocus >= x.length) currentFocus = 0;
//         if (currentFocus < 0) currentFocus = (x.length - 1);
//         x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//         for (var i = 0; i < x.length; i++) {
//             x[i].classList.remove("autocomplete-active");
//         }
//     }
//     function closeAllLists(elmnt) {
//         var x = document.getElementsByClassName("autocomplete-items");
//         for (var i = 0; i < x.length; i++) {
//             if (elmnt != x[i] && elmnt != inp) {
//                 x[i].parentNode.removeChild(x[i]);
//             }
//         }
//     }
//     document.addEventListener("click", function (e) {
//         closeAllLists(e.target);
//     });
// }




// function autocompletename(inp, arr) {
//     var currentFocus;
//     inp.addEventListener("input", function (e) {
//         var a, b, i, val = this.value;
//         closeAllLists();
//         if (!val) { return false; }
//         currentFocus = -1;
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         this.parentNode.appendChild(a);
//         for (i = 0; i < arr.length; i++) {
//             if (arr[i].ItemName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//                 b = document.createElement("DIV");
//                 b.innerHTML = "<strong>" + arr[i].ItemName.substr(0, val.length) + "</strong>";
//                 b.innerHTML += arr[i].ItemName.substr(val.length);
//                 b.innerHTML += `<input type='hidden' value='${arr[i].ItemName}'>`;
//                 b.addEventListener("click", function (e) {
//                     inp.value = this.getElementsByTagName("input")[0].value;
//                     closeAllLists();
//                 });
//                 a.appendChild(b);
//             }
//         }
//     });

//     inp.addEventListener("keydown", function (e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//             currentFocus++;
//             addActive(x);
//         } else if (e.keyCode == 38) {
//             currentFocus--;
//             addActive(x);
//         } else if (e.keyCode == 13) {
//             e.preventDefault();
//             if (currentFocus > -1) {
//                 if (x) x[currentFocus].click();
//             }
//         }
//     });
//     function addActive(x) {
//         if (!x) return false;
//         removeActive(x);
//         if (currentFocus >= x.length) currentFocus = 0;
//         if (currentFocus < 0) currentFocus = (x.length - 1);
//         x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//         for (var i = 0; i < x.length; i++) {
//             x[i].classList.remove("autocomplete-active");
//         }
//     }
//     function closeAllLists(elmnt) {
//         var x = document.getElementsByClassName("autocomplete-items");
//         for (var i = 0; i < x.length; i++) {
//             if (elmnt != x[i] && elmnt != inp) {
//                 x[i].parentNode.removeChild(x[i]);
//             }
//         }
//     }
//     document.addEventListener("click", function (e) {
//         closeAllLists(e.target);
//     });
// }


