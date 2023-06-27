import {actualizarTabla} from "../js/tabla.js";
import {createSuperheroe,getSuperheroesFetch ,deleteSuperheroe, updateSuperheroe } from "./peticiones.js";
import {crearOptions } from "../js/armas.js";
import { Superheroe } from "../js/superheroe.js";


const $seccionTabla = document.getElementById("table");
const $formulario = document.forms[0];
const $botonAltaMod = document.getElementById("button_alta_mod"); 
const $botonEliminar = document.getElementById("button_eliminar"); 
const $selectEditorial = document.getElementById("selectEditorial"); 
const $txtId = document.getElementById("txtId"); 
const $checkboxes = document.querySelectorAll('input[name="modTabla"]'); 
const $inputPromedioFuerza = document.querySelector('#txtPromedioFuerza');

  //POR FETCH
  const obtenerSuperheroes = async () => {
    try {
      const data = await getSuperheroesFetch();
      return data;
    } catch (error) {
      console.error(error);
      return []; 
    }
  };
  
  let superheroes = [];
  obtenerSuperheroes()
    .then((data) => {
      superheroes = data;
      ReiniciarFormulario(superheroes);
      crearOptions();
      console.log(superheroes);
    })
    .catch((error) => {
      console.error(error);
    });

 

 

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
    marcarTodosChecked();
    $selectEditorial.selectedIndex=0;
  }else if(e.target.matches("input[value='Filtrar']")){ //ver como acceder mas simple
    handlerSort();
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
      const nuevoSuperheroe = new Superheroe(null,txtNombre.value,parseInt(rangeFuerza.value),txtAlias.value,rdoEditorial.value,selectArma.value);
      console.log(nuevoSuperheroe);
      if (nuevoSuperheroe != null) handlerCreate(nuevoSuperheroe);
      
    }else{
        const modSuperheroe = new Superheroe(parseInt(txtId.value),txtNombre.value,parseInt(rangeFuerza.value),txtAlias.value, rdoEditorial.value,selectArma.value);
        if (modSuperheroe != null) handlerUpdate(modSuperheroe);
    }
  });


///-----------------EVENT HANDLERS----------------------

function handlerCreate(nuevoSuperheroe) {
  createSuperheroe(nuevoSuperheroe)
    .then(() => {
      return obtenerSuperheroes();
    })
    .then(superheroes => {
      console.log("Alta Exitosa");
      ReiniciarFormulario(superheroes);
    })
    .catch(error => {
      console.error(error);
    });
}
function handlerUpdate(editSuperheroe) {
  updateSuperheroe(editSuperheroe)
    .then(() => {
      return obtenerSuperheroes();
    })
    .then(superheroes => {
      console.log("Modificacion Exitosa");
      ReiniciarFormulario(superheroes);
    })
    .catch(error => {
      console.error(error);
    });

}
function handlerDelete(id) {
  const confirmacion = confirm("Estás seguro de que deseas borrar este superheroe?");
  if (confirmacion) {
    deleteSuperheroe(id)
      .then(() => {
        return obtenerSuperheroes();
      })
      .then(superheroes => {
        ReiniciarFormulario(superheroes);
      })
      .catch(error => {
        alert(error);
        console.error(error);
      });
  }
}

function handlerSort() {
  MostrarTablaFiltrada();
}


///-----------------MODIFICADORES DEL HTML----------------------
function ReiniciarFormulario(superheroes){
  if (superheroes.length) {
    $inputPromedioFuerza.value = calcularPromedioFuerzaReduce(superheroes);
    actualizarTabla($seccionTabla, superheroes);
  }else{
    actualizarTabla($seccionTabla, superheroes);
  }
  $formulario.reset();
  $txtId.value="";
  $botonAltaMod.value="Guardar Superheroe";
  $botonEliminar.style.setProperty("display","none");
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

function obtenerValoresCheckbox(){
  const valoresSeleccionados = [];
  $checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      valoresSeleccionados.push(checkbox.value);
    }
  });
  return valoresSeleccionados;
}
function marcarTodosChecked() {
  $checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

function MostrarTablaFiltrada(){
  const valorFiltro = $selectEditorial.value;
  if(valorFiltro!="todos"){
    console.log(valorFiltro);
    const superheroesFiltrados = filtrarPorEditorialFilter();
    console.log(superheroesFiltrados);
    const superheroesFiltradosYModificados = modificarColumnasTablaMap(superheroesFiltrados);
    console.log(superheroesFiltradosYModificados);
    ReiniciarFormulario(superheroesFiltradosYModificados);
  }else{
    const superheroesFiltradosYModificados = modificarColumnasTablaMap(superheroes);
    console.log(superheroesFiltradosYModificados);
    ReiniciarFormulario(superheroesFiltradosYModificados);
  }
}


/////////MAP REDUCE FILTRE
function filtrarPorEditorialFilter(){
  const valorFiltro = $selectEditorial.value;
  if(valorFiltro!="todos"){
    const superheroesFiltrados = superheroes.filter(superheroe => superheroe.editorial === valorFiltro);
     return superheroesFiltrados;
  }else{
    return superheroes;
  }
}

//se realizo aparte ya que al filtrar sin la columna fuerza nada Nan
function calcularPromedioFuerzaReduce(superheroes){
    const superheroesFiltrados = filtrarPorEditorialFilter();
    const sumaPrecios = superheroesFiltrados.reduce((total, superheroe) => total + superheroe.fuerza, 0);
    const promedioPrecios = sumaPrecios / superheroes.length;
    return promedioPrecios;
  }
 

function modificarColumnasTablaMap(superheroesFiltrados){

  const columnasSeleccionadas = obtenerValoresCheckbox();
  const superheroesConColumnasSeleccionadas = superheroesFiltrados.map(superheroe => {
    const nuevoSuperheroe = {};
    columnasSeleccionadas.forEach(columna => {
      nuevoSuperheroe[columna] = superheroe[columna];
    });
    return nuevoSuperheroe;
  });
  return superheroesConColumnasSeleccionadas;
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
