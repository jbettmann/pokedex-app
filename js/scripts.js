//  IIFE for pokemonList to avoid accidentally accessing the Global state
let pokemonRepo = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.querySelector('#modal-container');

  // accesses pokemonList array
  function getAll() {
    return pokemonList;
  }

  // adds new pokemon item to pokemonList array
  function add(item) {
    // checks item is an object in order to be summited
    if (typeof item === 'object' && 'name' in item) {
      // alerts that new pokemon was found!
      pokemonList.push(item);
        // If not valid object, alerts to double check pokemon is an object.
    } else {
      alert(`${item.name} is not a vailed pokemon. Please check to make sure your mushroom is an object!`);
    }
  };

  // adds list items to ul
  function addListItem(pokemonName) {
    // delaries variable
    let pokemonListItems = document.querySelector('ul');
    // creates list items
    let listItem = document.createElement('li');

    // creates buttons for list
    let button = document.createElement('button');
    // creates bottom layer for button styling
    let spanShadow = document.createElement('span');
    // creates middle layer for button styling
    let spanEdge = document.createElement('span');
    // creates front layer of button for styling
    let spanFront = document.createElement('span');
    // sets text of button to pokemon name
    spanFront.innerText = pokemonName.name;

    // adds classes to selected span elements
    spanShadow.classList.add('shadow');
    spanEdge.classList.add('edge');
    spanFront.classList.add('front');
    button.classList.add('pokemon-list-button');

    // appends (attaches) passed elements to attached element
    button.appendChild(spanShadow);
    button.appendChild(spanEdge);
    button.appendChild(spanFront);
    listItem.appendChild(button);
    pokemonListItems.appendChild(listItem);

    // Event Listener function to listen for 'click' on <button>, than console log pokemon name of button clicked
    buttonEventClick(button, pokemonName);
  };

 // Event listener for 'click' and console logs name of object clicked.
  // parameter names do not matter, just as long as the match each other in function
 function buttonEventClick(button, pokemon) {
    return button.addEventListener('click', function() {
      return showDetails(pokemon);
    })
  };

  // function logs name of pokemon to console
  function showDetails(pokemon) {

    let modal = document.createElement('div');
    modal.classList.add('modal');

    // Add the new modal content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    let titleElement = document.createElement('h1');
    titleElement.innerText = pokemon.name;

    let contentElement = document.createElement('p');
    contentElement.innerText = pokemon.height;
    // Create an <img> element
    let myImage = document.createElement('img');

    // setting `src` property to set the actual element's `src` attribute
    // this also works on <img> elements selected by querySelector() method, it is not specific for <img> elements created with createElement() methods
    myImage.src = pokemon.sprites.front_default;


    modal.appendChild(myImage);
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');

    loadDetails(pokemon).then(function () {
    console.log(pokemon);
    });

    function hideModal() {
        modalContainer.classList.remove('is-visible');
      }
  }

  // filters .pokemonList array by 'name' key
  function searchName(name) {
    // assign the filter function to variable 'findName'
    var findName = pokemonList.filter((pokemon) => {
      // returns 'true' if argument is equal to pokemonList.name is equal
      return pokemon.name === name;
    });
    // returns 'findName' varable to 'searchName' function with new array if pokemon.name === name
    return findName;
  };

  // Function Loads pokemon details from external API
  function loadList() {
    // make a request/fetches to API for data
    return fetch(apiUrl).then(function (response) {
      // returns a JSON
      return response.json();
    }).then(function (json) {
      // .results come frome the pokemon api url. Open url and find the "results" at top of page
      json.results.forEach(function (item) {
        // creates pokemon object with key-value pair from external API
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        // adds pokemon to pokemonList via add() fucntion
        add(pokemon);
      });
      // catches any errors
    }).catch(function (e) {
      console.error(e);
    });
  }

  // loads data from pokemon api and defines objects with key-value
  function loadDetails(item) {
    // .detailUrl refers to variable defined above in .loadList function
    let url = item.detailsUrl;
    return fetch(url).then(function (respones) {
      return respones.json();
      // gets key names and values for inside detailUrl link
    }).then(function (details) {
      // item refers to the parameter set above. imageUrl is made up, can be what you want it to be.
      // .sprites referes to image source in pokemon api URL
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }



  // objects being defined
  return {
    getAll: getAll,
    add: add,
    searchName: searchName,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showDetails: showDetails,
    buttonEventClick: buttonEventClick
  };
})();

// fetches data from external API to show pokemon data
pokemonRepo.loadList().then(function() {
  // Executes an IIFE (mushroomRepo) and implements methodes (getAll()) to iterate over mushroomList and print array
  pokemonRepo.getAll().forEach(function(list) {
    return pokemonRepo.addListItem(list);
  });
});
