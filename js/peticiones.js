const URL = "http://localhost:3000/superheroes";
const $loader = document.getElementById("loader");
const $contenedor_lista = document.getElementById("contenedor-lista");
$loader.classList.add("oculto");
$contenedor_lista.classList.add("oculto");


export const getSuperheroesFetch = () => {

  return new Promise((resolve, reject) => {
    $contenedor_lista.classList.add("oculto");
    $loader.classList.remove("oculto");
    fetch(URL)
      .then((res) => {
        if (res.ok) {
          resolve(res.json()); 
        } else {
          reject(res); 
        }
      })
      .catch((err) => {
        reject(new Error(`Error: ${err.status} - ${err.statusText}`));
      })
      .finally(() => {
        $loader.classList.add("oculto");
        $contenedor_lista.classList.remove("oculto");
      });
  });
};




export const createSuperheroe = (data) => {
  return new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  $contenedor_lista.classList.add("oculto");

  $loader.classList.remove("oculto");
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
      }
      $loader.classList.add("oculto");
      $contenedor_lista.classList.remove("oculto");
    }
  });
  xhr.open("POST", URL);
  xhr.setRequestHeader("Content-Type", "application/json;chartset=utf-8");
  xhr.send(JSON.stringify(data));
});
}




export const deleteSuperheroe = (id) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    $contenedor_lista.classList.add("oculto");
    $loader.classList.remove("oculto");
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
        }
        $contenedor_lista.classList.remove("oculto");
        $loader.classList.add("oculto");
      }
    });

    xhr.open("DELETE", URL + "/" + id);
    xhr.send();
  });
};


export const updateSuperheroe = (data) => {
  return new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  $contenedor_lista.classList.add("oculto");
  $loader.classList.remove("oculto");
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
      }
      $contenedor_lista.classList.remove("oculto");
      $loader.classList.add("oculto");
    } 
  });
  xhr.open("PUT", URL + "/" + data.id);
  xhr.setRequestHeader("Content-Type", "application/json;chartset=utf-8");
  xhr.send(JSON.stringify(data));
});
};
