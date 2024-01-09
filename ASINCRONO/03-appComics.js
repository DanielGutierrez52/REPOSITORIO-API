const formulario = document.getElementById("busqueda");

const inputNombre = document.getElementById("nombre");
const divResultados = document.querySelector(".resultados");
const urlVolumes = "https://comicvine.gamespot.com/api/volumes/?api_key=91f4d07eb8e740d68d1e9a1fe488fc84923de6e5&format=json";

const cajaOrden = document.getElementById("orden");

// Obtener la plantilla desde el documento
const template = document.querySelector("template");
let cards = document.querySelector(".resultados");
let characters = document.getElementById("characters");
//funcion en cuanto cargue la pagina
window.onload = function () {
    //buscamos el parametro enviado
    const urlParams = new URLSearchParams(window.location.search)
    console.log();
    //si el parametro tiene algo ejecutamos la acción
    if (urlParams.get("name") != null) {
        //cogemos los volumenes y los pintamos
        getVolumesByName(urlParams.get("name"))
            .then(volumes => {
                pintarPersonajes(volumes);
            });
    }

}

//por si queremos ordenar por nombre
cajaOrden.addEventListener('change', function () {
    orden = this.value;

});

//conseguir volumenes por ID NO POR FECHA, metodo duplicado abajo

//Coger volumenes por nombre
async function getVolumesByName(name) {
    const urlFetch = `${urlVolumes}&filter=name:${name}&sort=date_added:${orden}`;
    console.log(orden);
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;

}
//coger INFO del comic POR ID
async function getInfoByID(ID) {
    const urlFetch = `${urlVolumes}&filter=id:${ID}`;
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;

}

function pintarPersonajes(personajes) {
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
        card.querySelector(".card-text").textContent = element.start_year;
        console.log(element.id);
        console.log(element.characters)
        //Guardamos el id por si clicka en una card tenerlo ahi guardado
        card.dataset.id = element.id;
        // Adjuntar la tarjeta al contenedor de resultados
        divResultados.appendChild(card);

    });

}

//EVENT LISTENER DE LOS FORMULARIOS
formulario.addEventListener("submit", e => {
    e.preventDefault();
    const name = inputNombre.value.trim();
    //PONEMOS EL CASO DE QUE PUEDA BUSCAR TANTO POR NOMBRE O POR ID
    if (isNaN(name)) {
        getVolumesByName(name)
            .then(volumes => {
                pintarPersonajes(volumes);
            });
    } else {
        getInfoByID(name)
            .then(volumes => {
                pintarPersonajes(volumes);
            });
    }
});
cards.addEventListener("click", (e) => {
    if (e.target.classList.contains("card")) //en caso de que se pulse el card completamos tarea
    {
        console.log("eeeeh");
        console.log(e.target.dataset.id);
        getInfoByID(e.target.dataset.id)
            .then(info => {

                //BUSCAMOS INFO DEL COMIC A PARTIR DEL ID
                divResultados.innerHTML = "";
                const caja = template.content.cloneNode(true).querySelector(".caja-de-texto");
                caja.innerHTML = info.results[0].description;
                divResultados.appendChild(caja);
                console.log(info);

            });
    }



});

