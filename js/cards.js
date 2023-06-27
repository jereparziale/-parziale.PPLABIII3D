import {getSuperheroes} from "../js/ajaxCards.js";

  const crearArticle = (data) => {
    const $seccion = document.getElementById("seccion-cards");
    data.forEach((elementoFila) => {
        const article = document.createElement("article");
        article.classList.add("card", "bg-primary", "text-dark");
        article.style.width = "18rem";

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        for (const key in elementoFila) {
            if (key == "id") continue;

            const p = document.createElement("p");
            p.textContent = key + ": " + elementoFila[key];
            cardBody.appendChild(p);
        }

        article.appendChild(cardBody);
        $seccion.appendChild(article);
    });
};

async function obtenerSuperheroes() {
  try {
    const data = await getSuperheroes();
    return data; 
  } catch (error) {
    console.error(error);
  }
}
let superheroes = [];
obtenerSuperheroes()
  .then(data => {
    superheroes = data;
    crearArticle(superheroes);
  })
  .catch(error => {
    console.error(error);
  });