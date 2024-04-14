const main$$ = document.querySelector("main");

const getPokemons = async () => {
  //usando then el scope es limitado
  //para await la funcion tiene que ser asincrona, siempre que hacemos una petición (fetch), depende de algo que está en otro servidor
  let responses = [];
  for (let i = 1; i <= 151; i++) {
    let uri = "https://pokeapi.co/api/v2/pokemon/" + i;
    const response = await fetch(uri);
    const info = await response.json();
    responses.push(info);
  }
  return responses;
};

const mapPokemons = (unMappedPokemons) => {
  const mapped = unMappedPokemons.map((pokemon) => ({
    name: pokemon.name,
    image: pokemon.sprites.other["official-artwork"].front_shiny,
    gif: pokemon["sprites"]["other"]["showdown"].front_default,
    type: pokemon.types.map((type) => type.type.name),
    id: pokemon.id,
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities.map((ability) => ability.ability.name),
    stats: pokemon.stats,
  }));
  console.log(mapped);
  return mapped;
};

const showPokemons = (pokemons) => {
  main$$.innerHTML = "";
  //para que el ID sea de 3 caracteres
  for (const pokemon of pokemons) {
    let pokeId = pokemon.id.toString();
    if (pokeId.length === 1) {
      pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
      pokeId = "0" + pokeId;
    }

    //parte trasera de las tarjetas
    let pokemonDivCard$ = document.createElement("div");
    let pokemonDiv$ = document.createElement("div");
    let pokemonInnerBack$ = document.createElement("div");
    let pokemonNameBack$ = document.createElement("p");
    let pokemonGif$ = document.createElement("img");
    let statsWrapper$ = document.createElement("div");

    pokemonDivCard$.className = "card";
    main$$.appendChild(pokemonDivCard$);
    pokemonDiv$.className = "card-face";
    pokemonDivCard$.appendChild(pokemonDiv$);

    pokemonInnerBack$.className = "card-back";
    pokemonDiv$.appendChild(pokemonInnerBack$);

    pokemonNameBack$.textContent = pokemon.name;
    pokemonNameBack$.className = "card-title-back";
    pokemonInnerBack$.appendChild(pokemonNameBack$);

    pokemonGif$.setAttribute("src", pokemon.gif);
    pokemonGif$.setAttribute("alt", pokemon.name);
    pokemonGif$.className = "card-gif";
    pokemonInnerBack$.appendChild(pokemonGif$);

    statsWrapper$.className = "wrapper";
    statsWrapper$.innerHTML = "";
    pokemonInnerBack$.appendChild(statsWrapper$);

    const statNameMapper = {
      hp: "HP",
      attack: "ATK",
      defense: "DEF",
      "special-attack": "SPECIAL ATK",
      "special-defense": "SPECIAL DEF",
      speed: "SPEED",
    };

    pokemon.stats.forEach(({ stat, base_stat }) => {
      const statDiv$ = document.createElement("div");
      const stats$ = document.createElement("p");
      const base_stat$ = document.createElement("p");
      const progress$ = document.createElement("progress");

      statDiv$.className = "stats-wrap";
      statsWrapper$.appendChild(statDiv$);

      stats$.className = "stats " + pokemon.type[0] + "-dark";
      stats$.textContent = statNameMapper[stat.name];
      statDiv$.appendChild(stats$);

      base_stat$.className = "base-stat " + pokemon.type[0] + "-dark";
      (base_stat$.textContent = String(base_stat).padStart(3, "0")),
        statDiv$.appendChild(base_stat$);

      progress$.className = "progress " + pokemon.type[0];
      progress$.value = base_stat;
      progress$.max = 100;
      statDiv$.appendChild(progress$);
    });
    //parte delantera de las tarjetas
    let pokemonInner$ = document.createElement("div");
    let pokemonName$ = document.createElement("h2");
    let pokemonData$ = document.createElement("div");
    let pokemonHeight$ = document.createElement("h3");
    let pokemonWeight$ = document.createElement("h3");
    let pokemonId$ = document.createElement("p");
    let fotoBorder$ = document.createElement("div");
    let pokemonFoto$ = document.createElement("img");
    let pokemonTypeDiv$ = document.createElement("div");

    pokemonInner$.className = "card-front";
    pokemonDiv$.appendChild(pokemonInner$);

    pokemonName$.textContent = pokemon.name;
    pokemonName$.className = "card-title";
    pokemonInner$.appendChild(pokemonName$);

    pokemonData$.className = "data-block";

    pokemonHeight$.textContent = "Height:" + pokemon.height + "0cm";
    pokemonHeight$.className = "data";
    pokemonData$.appendChild(pokemonHeight$);

    pokemonWeight$.textContent = "Weight:" + pokemon.weight + "kg";
    pokemonWeight$.className = "data";
    pokemonData$.appendChild(pokemonWeight$);

    pokemonInner$.appendChild(pokemonData$);

    pokemonId$.textContent = pokeId;
    pokemonId$.className = pokemon.type[0] + "-dark pokemon-id";
    pokemonInner$.appendChild(pokemonId$);

    fotoBorder$.className = "image-border";

    pokemonInner$.appendChild(fotoBorder$);

    pokemonFoto$.setAttribute("src", pokemon.image);
    pokemonFoto$.setAttribute("alt", pokemon.name);
    pokemonFoto$.className = "card-image";
    pokemonInner$.appendChild(pokemonFoto$);

    pokemonTypeDiv$.className = "type-block";
    console.log(pokemon.type);
    for (type of pokemon.type) {
      let pokemonType$ = document.createElement("p");
      pokemonType$.textContent = type;
      pokemonType$.className = type + " type";
      pokemonTypeDiv$.appendChild(pokemonType$);
    }

    pokemonInner$.appendChild(pokemonTypeDiv$);

    let pokemonAbilityTitle$ = document.createElement("p");
    let pokemonAbilityDiv$ = document.createElement("div");

    pokemonInner$.className =
      pokemonInner$.className + " bg-" + pokemon.type[0];
    pokemonAbilityTitle$.textContent = "Abilities:";
    pokemonAbilityTitle$.className = "ability-title";
    pokemonInner$.appendChild(pokemonAbilityTitle$);

    pokemonAbilityDiv$.className = "ability-block";
    for (ability of pokemon.abilities) {
      let pokemonAbility$ = document.createElement("p");
      pokemonAbility$.textContent = ability;
      pokemonAbility$.className =
        ability + " ability " + pokemon.type[0] + "-dark ";
      pokemonAbilityDiv$.appendChild(pokemonAbility$);
    }
    pokemonInner$.appendChild(pokemonAbilityDiv$);
  }

  //lo pongo aqui porque si no al buscar se quita el efecto
  tiltEffect();
  const cards = document.querySelectorAll(".card-face");
  function flipCard() {
    this.classList.toggle("flip");
  }
  cards.forEach((card) => card.addEventListener("click", flipCard));
};

const drawInput = (pokemons) => {
  const input$ = document.querySelector("input");
  input$.addEventListener("input", () =>
    searchPokemons(input$.value, pokemons)
  );
};

const searchPokemons = (filter, pokemons) => {
  let filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filter.toLowerCase())
  );
  console.log(filteredPokemons);
  showPokemons(filteredPokemons);
};

const filterPokemons = (filter, pokemons) => {
  let filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.type
      .toString()
      .toLowerCase()
      .includes(filter.toString().toLowerCase())
  );
  console.log(filteredPokemons);
  showPokemons(filteredPokemons);
};

const drawFilter = (pokemons) => {
  const buttons$ = document.querySelectorAll(".btn-header");
  buttons$.forEach((boton) =>
    boton.addEventListener("click", (event) => {
      if (event.currentTarget.id == "all") {
        showPokemons(pokemons);
      } else {
        filterPokemons(event.currentTarget.id, pokemons);
      }
    })
  );
};

//movimiento y brillo al hacer hover
const tiltEffect = () => {
  VanillaTilt.init(document.querySelectorAll(".card-front"), {
    max: 25,
    speed: 400,
    glare: true,
  });
};

/*
ASI NO ME FUNCIONABA :ƒ
function removePopup() {
  let popup = document.getElementById("popup");
  popup.classList.remove("open-popup");
}

const closePopup = () => {

  const buttons$ = document.querySelector(".popup-btn");
  buttons$.addEventListener("click", () => {
    removePopup();
  });
};*/

let popup = document.getElementById("popup");

function closePopup() {
  popup.classList.remove("open-popup");
}

/*Hoja de rutas: solo llamo esta función, el resto de las llamadas van dentro de esta*/
const init = async () => {
  const nonMappedPokemons = await getPokemons();
  const mappedPokemons = mapPokemons(nonMappedPokemons);
  showPokemons(mappedPokemons);
  drawInput(mappedPokemons);
  drawFilter(mappedPokemons);
  tiltEffect();
};

init();
