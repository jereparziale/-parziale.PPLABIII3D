
const superheroes = JSON.parse(localStorage.getItem("superheroes")) || [];


const crearArticle = (data) => {
    //recorro el json
    const $seccion = document.getElementById("seccion-cards");

    data.forEach((elementoFila) => {
      const article = document.createElement("article");

      for (const key in elementoFila) {
        const p = document.createElement("p");
        if(key=="id")continue;

        p.textContent = key+": "+elementoFila[key];
    
        article.appendChild(p);
       }
       article.classList.add("class-article");
       $seccion.appendChild(article);
    });
  };

  crearArticle(superheroes);