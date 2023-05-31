const $arrayArmas = ["Armadura","Espada","Martillo","Escudo","Arma de Fuego", "Flechas"];


const armas = JSON.parse(localStorage.getItem("armas")) || [];
if(!armas.lenght){
    armas.push(...$arrayArmas);
}


export const crearOptions = () => {
    const $select = document.getElementById("selectArma");
    //recorro el json
    armas.forEach((arma) => {
      const $option = document.createElement("option");
      $option.value=arma;
      $option.textContent=arma;
      $select.appendChild($option);
    });
  };