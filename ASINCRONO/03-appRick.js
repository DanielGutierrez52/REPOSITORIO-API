const formulario = document.getElementById("busqueda");
const inputNombre = document.getElementById("nombre");
const divResultados = document.querySelector(".resultados");
const urlCharacters = "https://rickandmortyapi.com/api/character/";
const paginacion = document.querySelector(".pagination-container");
// Obtener la plantilla desde el documento
const template = document.querySelector("template");
let paginaActual = 1;
async function getCharactersByName(name, page) {
    const urlFetch = `${urlCharacters}?name=${name}&page=${page}`;
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;
}

function pintarPersonajes(personajes) {
    divResultados.innerHTML = ""; // Limpiar resultados anteriores
    //PONEMOS EL NUMERO DE PAGINA
    const numero = document.getElementById("numero");
    numero.textContent = `Página ${paginaActual}`;

    personajes.results.forEach(element => {
        // Clonar la plantilla
        const card = template.content.cloneNode(true).querySelector(".card");

        // Actualizar el contenido de la tarjeta
        card.querySelector(".card-img-top").src = element.image;
        card.querySelector(".card-img-top").alt = element.name;
        card.querySelector(".card-title").textContent = element.name;
        card.querySelector(".card-text").textContent = `${element.species}, ${element.status}`;

        // Adjuntar la tarjeta al contenedor de resultados
        divResultados.appendChild(card);

    });

    console.log(personajes);
}
function updatePaginationButtons(info) {
    const { pages, next, prev } = info;
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    prevButton.disabled = !prev;
    nextButton.disabled = !next;
}

async function cargaPersonajes(name, page) {
    const characters = await getCharactersByName(name, page);
    pintarPersonajes(characters);
    updatePaginationButtons({
        pages: characters.info.pages,
        next: characters.info.next,
        prev: characters.info.prev,
    });
    console.log(updatePaginationButtons);
}

formulario.addEventListener("submit", e => {
    e.preventDefault();
    const name = inputNombre.value.trim();
    getCharactersByName(name)
        .then(characters => {
            pintarPersonajes(characters);
        });
});

paginacion.addEventListener("click", (e) => {
    if (e.target.id === "prevPage" && paginaActual > 1) {
        paginaActual--;
    } else if (e.target.id === "nextPage") {
        paginaActual++;
    }

    const name = inputNombre.value.trim();
    cargaPersonajes(name, paginaActual);
});