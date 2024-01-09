const inputNombre = document.getElementById("nombre");
const divResultados = document.querySelector(".resultados");
const formulariocharacters = document.getElementById("busquedacharacters");
const urlcharacters = "https://comicvine.gamespot.com/api/characters/?api_key=91f4d07eb8e740d68d1e9a1fe488fc84923de6e5&format=json";
const cajaOrden = document.getElementById("orden");
// Obtener la plantilla desde el documento
const template = document.querySelector("template");
let cards = document.querySelector(".resultados");

//SACAMOS TODOS LOS QUE QUERAMOS AL PRINCIPIO
window.onload = function () {
    getcharactersByName("")
        .then(volumes => {
            pintarcharacters(volumes);
        });
}
//POR SI QUEREMOS HACER ORDEN
cajaOrden.addEventListener('change', function () {
    orden = this.value;

});
//COGER LOS CHARACTERS pOR NOMBRE
async function getcharactersByName(name) {
    const urlFetch = `${urlcharacters}&filter=name:${name}&sort=dsf:${orden}`;
    console.log("a");
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;

}
//PINTA MUCHOS CARACTERES
function pintarcharacters(personajes) {
    divResultados.innerHTML = ""; // Limpiar resultados anteriores

    //En el caso de que no encuentre resultados.

    if (personajes.results.length == 0) {
        divResultados.innerHTML = "<h2>No se encontraron resultados</h2>";
    }
    personajes.results.forEach(element => {
        // Clonar la plantilla
        const card = template.content.cloneNode(true).querySelector(".card");

        // Actualizar el contenido de la tarjeta
        card.querySelector(".card-img-top").src = element.image.medium_url;
        card.querySelector(".card-img-top").alt = element.name;
        card.querySelector(".card-title").textContent = element.name;
        card.querySelector(".card-text").textContent = element.real_name;

        card.dataset.name = element.name;
        // Adjuntar la tarjeta al contenedor de resultados
        divResultados.appendChild(card);
        console.log(element);
    });
}

//Pinta uno solo
function pintarcharacter(personajes) {
    divResultados.innerHTML = ""; // Limpiar resultados anteriores

    //En el caso de que no encuentre resultados.

    if (personajes.results.length == 0) {
        divResultados.innerHTML = "<h2>No se encontraron resultados</h2>";
    }
    element = personajes.results[0];

    //SACAR SOLO UN RESULTADO
    const card = template.content.cloneNode(true).querySelector(".card");

    // Actualizar el contenido de la tarjeta
    card.querySelector(".card-img-top").src = element.image.medium_url;
    card.querySelector(".card-img-top").alt = element.name;
    card.querySelector(".card-title").textContent = element.name;
    card.querySelector(".card-text").textContent = element.real_name;
    card.dataset.name = element.name;
    // Adjuntar la tarjeta al contenedor de resultados
    divResultados.appendChild(card);
    console.log(element);
    /* personajes.results.forEach(element => {
         // Clonar la plantilla
         const card = template.content.cloneNode(true).querySelector(".card");
 
         // Actualizar el contenido de la tarjeta
         card.querySelector(".card-img-top").src = element.image.medium_url;
         card.querySelector(".card-img-top").alt = element.name;
         card.querySelector(".card-title").textContent = element.name;
         card.querySelector(".card-text").textContent = element.real_name;
 
         card.dataset.name = element.name;
         // Adjuntar la tarjeta al contenedor de resultados
         divResultados.appendChild(card);
         console.log(element);
     });
 */
}
//EVENT LISTENER DE LOS FORMULARIOS
formulariocharacters.addEventListener("submit", e => {
    e.preventDefault();
    console.log("a");
    const name = inputNombre.value.trim();
    //PONEMOS EL CASO DE QUE PUEDA BUSCAR TANTO POR NOMBRE O POR ID
    if (isNaN(name)) {
        getcharactersByName(name)
            .then(volumes => {
                pintarcharacter(volumes);
            });
    } else {
        getVolumesByDate(name)
            .then(volumes => {
                pintarPersonajes(volumes);
            });
    }
});

//Listener por si pulsan la card
cards.addEventListener("click", (e) => {
    if (e.target.classList.contains("card")) //en caso de que se pulse el card completamos tarea
    {
        //cogemos la primera palabra del nombre
        let names = e.target.dataset.name.split(" ");
        let name = names[0];
        console.log(name);
        console.log("eeeeh");
        //enviamos el nombre del personaje para que lo busque
        window.location.href = "http://127.0.0.1:5500/index.html?name=" + name;

    }



});