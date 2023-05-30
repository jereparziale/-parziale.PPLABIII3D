export const crearTabla = (data,colorCabecera) => {
  if (!Array.isArray(data)) return null;



  const tabla = document.createElement("table");

  //le apendeo la cabecera y saco los valores del primer elemento
  tabla.appendChild(crearCabecera(data[0],colorCabecera));
  tabla.appendChild(crearCuerpo(data));

  return tabla;
};

const crearCabecera = (elemento,colorCabecera) => {
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.style.setProperty("background-color",colorCabecera);

  for (const key in elemento) {
    if(key==="id") continue;
    const th = document.createElement("th");
    th.textContent = key;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  return thead;
};



const crearCuerpo = (data) => {
  const tbody = document.createElement("tbody");
  //recorro el json
  data.forEach((elementoFila) => {
    const row = document.createElement("tr");

    for (const key in elementoFila) {
        if(key==="id"){
            //le agrega un property a la row
            row.dataset.id=elementoFila[key];

        }else{
            const td = document.createElement("td");

            td.textContent = elementoFila[key];
          
            row.appendChild(td);
        }
     }
    tbody.appendChild(row);
  });
  return tbody;
};




export const actualizarTabla = (contenedor,data)=>{
  //haschildnodes trae si tiene hijos
  while(contenedor.hasChildNodes()){
    //si tiene tabla la borro
    contenedor.removeChild(contenedor.firstElementChild);
  }
  
  contenedor.appendChild(crearTabla(data,"coral"));
}


export const obtenerUltimoId = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return 1;
  }

  const ultimoElemento = data[data.length - 1];
  const ultimoId = ultimoElemento.id;

  return isNaN(ultimoId) ? 1 : parseInt(ultimoId) + 1;
};
