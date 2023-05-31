import {actualizarTabla, obtenerUltimoId } from "../js/tabla.js";
import {crearOptions } from "../js/armas.js";
import { Superheroe } from "../js/superheroe.js";

const $seccionTabla = document.getElementById("table");
const $formulario = document.forms[0];
const $botonAltaMod = document.getElementById("button_alta_mod"); 
const $botonEliminar = document.getElementById("button_eliminar"); 
const $txtId = document.getElementById("txtId"); 

const $spinner = document.querySelector('#spinner'); 
const superheroes = JSON.parse(localStorage.getItem("superheroes")) || [];
//al iniciar el programa carga la tabla con los datos disponibles en localStorage
$spinner.style.display = "block";
setTimeout(() => {
  $spinner.style.display = "none";
  ReiniciarFormulario(superheroes);
}, 3000);

crearOptions();


//manejador de eventos para acceder a la tabla
window.addEventListener("click", function (e) {
    if (e.target.matches("td")) {
      const tr = e.target.parentElement.dataset.id;
    
      const superheroeSeleccionado = superheroes.find((an) => an.id == tr);
      cargarFormSuperheroe($formulario, superheroeSeleccionado);
    }else if(e.target.matches("input[value='Eliminar Superheroe']")){ //ver como acceder mas simple
      handlerDelete(parseInt($formulario.txtId.value));
  }else if(e.target.matches("input[value='Cancelar']")){ //ver como acceder mas simple
    ReiniciarFormulario(superheroes);
  }
  });


$formulario,
  addEventListener("submit", (e) => {
    e.preventDefault();
    const {txtId,txtNombre,txtAlias,rdoEditorial,rangeFuerza,selectArma} = $formulario;
    if(!ValidacionesSuperheroe(txtNombre,txtAlias,rdoEditorial,rangeFuerza,selectArma)){
        console.log("Revisar Datos");
        return;
    }

    //-----------------ALTA--------------------
    if (txtId.value === "") {
      console.log(obtenerUltimoId(superheroes));
      const nuevoSuperheroe = new Superheroe(obtenerUltimoId(superheroes),txtNombre.value,parseInt(rangeFuerza.value),txtAlias.value,rdoEditorial.value,selectArma.value);
      console.log(nuevoSuperheroe);
      if (nuevoSuperheroe != null) handlerCreate(nuevoSuperheroe);
      
    }else{
        const modSuperheroe = new Superheroe(parseInt(txtId.value),txtNombre.value,parseInt(rangeFuerza.value),txtAlias.value, rdoEditorial.value,selectArma.value);
        if (modSuperheroe != null) handlerUpdate(modSuperheroe);
    }
    ReiniciarFormulario(superheroes);
  });



///-----------------EVENT HANDLERS----------------------
function handlerCreate(nuevoSuperheroe) {
  superheroes.push(nuevoSuperheroe);
  console.log("Alta Exitosa");
}

function handlerUpdate(editSuperheroe) {
  let index = superheroes.findIndex((an) => an.id == editSuperheroe.id);
  superheroes.splice(index, 1, editSuperheroe);
  console.log("Modificacion Exitosa");

}

function handlerDelete(id) {
  let index = superheroes.findIndex((an) => an.id == id);
  const confirmacion = confirm("Estás seguro de que deseas borrar este superheroe?");
  if (confirmacion) {
    superheroes.splice(index, 1);
    ReiniciarFormulario(superheroes);
  }
}


///-----------------MODIFICADORES DEL HTML----------------------
function ReiniciarFormulario(superheroes){
  if (superheroes.length) {
    actualizarTabla($seccionTabla, superheroes);
    actualizarStorage("superheroes", superheroes);
  }else{
    actualizarTabla($seccionTabla, superheroes);
    actualizarStorage("superheroes", superheroes);
  }
  $formulario.reset();
  $txtId.value="";
  $botonAltaMod.value="Guardar Superheroe";
  $botonEliminar.style.setProperty("display","none");
}


function actualizarStorage(clave, data) {
  isEmpty(clave)
 localStorage.setItem(clave, JSON.stringify(data));
}

function cargarFormSuperheroe(formulario, superheroe) {
formulario.txtId.value = superheroe.id;
formulario.txtNombre.value = superheroe.nombre;
formulario.txtAlias.value = superheroe.alias;
formulario.rdoEditorial.value = superheroe.editorial;
formulario.rangeFuerza.value = superheroe.fuerza;
formulario.selectArma.value = superheroe.arma;
$botonAltaMod.value="Modificar Superheroe";
$botonEliminar.style.setProperty("display","inline-block");
}



  

///-----------------VALIDACIONES----------------------
function isEmpty(str) {
  return str.trim() === "";
}

function ValidacionesSuperheroe(txtNombre,txtAlias,rdoEditorial,rangeFuerza,selectArma) {
  if (
    isEmpty(txtNombre.value) ||
    isEmpty(txtAlias.value) ||
    isEmpty(rdoEditorial.value) ||
    isEmpty(rangeFuerza.value) 
  ) {
    alert("Revisar empty")

    return false;
  }

  const transaccion = rdoEditorial.value.toLowerCase();
  if (transaccion !== "marvel" && transaccion !== "dc") {
    alert("Revisar Editorial")
    return false;
  }

  if (
    isNaN(parseInt(rangeFuerza.value)) 
  ) {
    alert("Revisar fuerza")
    return false;
  }

  if (
    parseFloat(rangeFuerza.value) <= 0 
  ) {
    alert("Revisar fuerza")
    return false;
  }

  return true;
}
