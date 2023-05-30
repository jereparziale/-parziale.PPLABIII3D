import {actualizarTabla, obtenerUltimoId } from "../js/tabla.js";
import { Anuncio } from "../js/anuncio.js";


const $seccionTabla = document.getElementById("table");
const $seccionAnuncio = document.getElementById("article-anuncio");
const $filtrosTabla = document.getElementById("filtros-tabla");
const $formulario = document.forms[0];
const $botonAltaMod = document.getElementById("button_alta_mod"); 
const $botonEliminar = document.getElementById("button_eliminar"); 
const $spinner = document.querySelector('#spinner'); 
const $selectOrden = document.querySelector('#selectOrden');
const $selectDireccion = document.querySelector('#selectDireccion');
const anuncios = JSON.parse(localStorage.getItem("anuncios"));


//al iniciar el programa carga la tabla con los datos disponibles en localStorage
$spinner.style.display = "block";
$filtrosTabla.style.setProperty("display","none");
$seccionAnuncio.style.setProperty("display","none");
setTimeout(() => {
  $spinner.style.display = "none";
  IniciarReiniciarFormulario(anuncios);
}, 3000);


//manejador de eventos para acceder a la tabla
window.addEventListener("click", function (e) {
    if (e.target.matches("td")) {
      const tr = e.target.parentElement.dataset.id;
    
      const anuncioSeleccionado = anuncios.find((an) => an.id == tr);
      cargarFormAnuncio($formulario, anuncioSeleccionado);
    }else if(e.target.matches("input[value='Eliminar Anuncio']")){ //ver como acceder mas simple
      handlerDelete(parseInt($formulario.txtId.value));
  }else if(e.target.matches("input[value='Cancelar']")){ //ver como acceder mas simple
    IniciarReiniciarFormulario(anuncios);
  }else if(e.target.matches("input[value='Filtrar']")){ //ver como acceder mas simple
    handlerSort();
  }
  });

$formulario,
  addEventListener("submit", (e) => {
    e.preventDefault();

    const { txtId,txtTitulo,rdoTransaccion,txtDescripcion,txtPrecio,txtCantBaños,txtCantAutos,txtCantHabitaciones} = $formulario;
    if(!ValidacionesAnuncio(txtTitulo,rdoTransaccion,txtDescripcion,txtPrecio,txtCantBaños,txtCantAutos,txtCantHabitaciones)){
        console.log("Revisar Datos");
        return;
    }

    //-----------------ALTA--------------------
    if (txtId.value === "") {
      const nuevoAnuncio = new Anuncio(
        obtenerUltimoId(anuncios),txtTitulo.value,rdoTransaccion.value,txtDescripcion.value, parseFloat(txtPrecio.value), parseInt(txtCantBaños.value),parseInt(txtCantAutos.value),parseInt(txtCantHabitaciones.value)
      );
      console.log(nuevoAnuncio);
      if (nuevoAnuncio != null) handlerCreate(nuevoAnuncio);
      
    }else{
        console.log("actualizando...");
        const modAnuncio = new Anuncio(txtId.value,txtTitulo.value,rdoTransaccion.value,txtDescripcion.value, parseFloat(txtPrecio.value), parseInt(txtCantBaños.value),parseInt(txtCantAutos.value),parseInt(txtCantHabitaciones.value));
        if (modAnuncio != null) handlerUpdate(modAnuncio);
    }
    IniciarReiniciarFormulario(anuncios);

  });



///-----------------EVENT HANDLERS----------------------
function handlerCreate(nuevoAnuncio) {
  anuncios.push(nuevoAnuncio);
  console.log("Alta Exitosa");
}

function handlerUpdate(editAnuncio) {
  let index = anuncios.findIndex((an) => an.id == editAnuncio.id);
  anuncios.splice(index, 1, editAnuncio);
  console.log("Modificacion Exitosa");

}

function handlerDelete(id) {
  let index = anuncios.findIndex((an) => an.id == id);
  const confirmacion = confirm("Estás seguro de que deseas borrar este anuncio?");
  if (confirmacion) {
    anuncios.splice(index, 1);
    IniciarReiniciarFormulario(anuncios);
  }
}

function handlerSort() {
  MostrarTablaOrdenada(anuncios);
}


///-----------------MODIFICADORES DEL HTML----------------------

function IniciarReiniciarFormulario(anuncios){
  if (anuncios.length) {
    $filtrosTabla.style.setProperty("display","block");
    actualizarTabla($seccionTabla, anuncios);
    actualizarStorage("anuncios", anuncios);
  }else{
    anuncios = [];
    $filtrosTabla.style.setProperty("display","none");
    actualizarTabla($seccionTabla, anuncios);
    actualizarStorage("anuncios", anuncios);
  }
  $formulario.reset();
  $botonAltaMod.value="Guardar Anuncio";
  $botonEliminar.style.setProperty("display","none");
  $seccionAnuncio.style.setProperty("display","none");
  
}


function actualizarStorage(clave, data) {
  isEmpty(clave)
 localStorage.setItem(clave, JSON.stringify(data));
}

function cargarFormAnuncio(formulario, anuncio) {
formulario.txtId.value = anuncio.id;
formulario.txtTitulo.value = anuncio.titulo;
formulario.rdoTransaccion.value = anuncio.transaccion;
formulario.txtDescripcion.value = anuncio.descripcion;
formulario.txtPrecio.value = anuncio.precio;
formulario.txtCantBaños.value = anuncio.cantBaños;
formulario.txtCantAutos.value = anuncio.cantAutos;
formulario.txtCantHabitaciones.value = anuncio.cantHab;

cargarAnuncio(anuncio);
$botonAltaMod.value="Modificar Anuncio";
$botonEliminar.style.setProperty("display","inline-block");
$seccionAnuncio.style.setProperty("display","block");
}
function cargarAnuncio(anuncio) {
document.getElementById("titulo").textContent = anuncio.titulo;
document.getElementById("descripcion").textContent = anuncio.descripcion;
document.getElementById("alquiler_venta").textContent = anuncio.transaccion;
document.getElementById("precio").textContent = anuncio.precio;
document.getElementById("cantBaños").textContent = anuncio.cantBaños;
document.getElementById("cantAutos").textContent = anuncio.cantAutos;
document.getElementById("cantHabitaciones").textContent = anuncio.cantHab;
}

///-----------------SORT----------------------
function compararPorPropiedadDireccion(propiedad, direccion) {
  return function(a, b) {
    const valorA = a[propiedad];
    const valorB = b[propiedad];

    if (direccion === 'asc') {
      return valorA - valorB;
    } else if (direccion === 'desc') {
      return valorB - valorA;
    } else {
      // Si la dirección no es 'asc' ni 'desc', retornamos 0 para mantener el orden original
      return 0;
    }
  };
}

function filtrarData(data,funcionComparacion)
{
  if(data.length){
    const arrayOrdenado = [...data];
    arrayOrdenado.sort(funcionComparacion);
    return arrayOrdenado;
  }
}

function seleccionadorDeOrdenamientoAnuncios(data){
    return filtrarData(data,compararPorPropiedadDireccion($selectOrden.value,$selectDireccion.value));
  }

function MostrarTablaOrdenada(anuncios){

  const anunciosOrdenados=seleccionadorDeOrdenamientoAnuncios(anuncios);

  actualizarTabla($seccionTabla, anunciosOrdenados);
}
  

///-----------------VALIDACIONES----------------------
function isEmpty(str) {
  return str.trim() === "";
}

function ValidacionesAnuncio(
  txtTitulo,
  rdoTransaccion,
  txtDescripcion,
  txtPrecio,
  txtCantBaños,
  txtCantAutos,
  txtCantHabitaciones
) {
  if (
    isEmpty(txtTitulo.value) ||
    isEmpty(rdoTransaccion.value) ||
    isEmpty(txtDescripcion.value) ||
    isEmpty(txtPrecio.value) ||
    isEmpty(txtCantBaños.value) ||
    isEmpty(txtCantAutos.value) ||
    isEmpty(txtCantHabitaciones.value)
  ) {
    console.log("Revisar empty")

    return false;
  }

  const transaccion = rdoTransaccion.value.toLowerCase();
  if (transaccion !== "venta" && transaccion !== "alquiler") {
    console.log("Revisar rdo")

    return false;
  }

  if (
    isNaN(parseFloat(txtPrecio.value)) ||
    isNaN(parseInt(txtCantBaños.value)) ||
    isNaN(parseInt(txtCantAutos.value)) ||
    isNaN(parseInt(txtCantHabitaciones.value))
  ) {
    console.log("Revisar numeros")
    return false;
  }

  if (
    parseFloat(txtPrecio.value) <= 0 ||
    parseInt(txtCantBaños.value) <= 0 ||
    parseInt(txtCantAutos.value) < 0 ||
    parseInt(txtCantHabitaciones.value) <= 0
  ) {
    console.log("Revisar cantidad")

    return false;
  }

  return true;
}
