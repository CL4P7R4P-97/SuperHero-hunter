// https://developer.marvel.com/docs 



// Updated code snippet with performance optimizations and bug fixes:

// Declare variables with const instead of var
var heroes = [];
const md5 = window.CryptoJS.MD5;
const cardGroup = document.querySelector(".main-container");
const heading = document.querySelector(".heading");
let favourites = [];
let currentHero = {};
let heroName = "";

// Check if Favourites key exists in localStorage before parsing it
if (localStorage.getItem("Favourites")) {
  favourites = JSON.parse(localStorage.getItem("Favourites"));
  console.log("Favourites found!", favourites);
} else {
  localStorage.setItem("Favourites", JSON.stringify(favourites));
  console.log("Favourites not found");
}

// Declare hero and knowMore variables with const instead of var
const hero = document.querySelector("#heroName");
const knowMore = document.querySelector("#moreInfo");

// Encryption and URL construction
const ts = "1";
const publicKey = "9d96af8599d4677a0fd6eeef07e819e6";
const privateKey = "caba571faa3716104ba4e69f8ac1d0b72cc1b216";

// Concatenate variables in a template literal instead of using the + operator
const hash = md5(`${ts}${privateKey}${publicKey}`).toString();
console.log(hash);




/**
 * Function to load event listener for hero search
 */
function loadEventListener(){
    // Add keyup event listener to hero input field
    hero.addEventListener('keyup',(e)=>{
        // Clear the card group container
        cardGroup.innerHTML = "";
        // Log the target value of the event
        console.log(e.target.value);
        // Set hero name to target value of event
        heroName  = e.target.value;
        // If hero name is not empty, update heading with search result message
        if(heroName){
            heading.innerHTML = "Showing Result for : "+heroName;
        }
        // Otherwise, clear the heading
        else{
            heading.innerHTML = "";
        }
       // Call searchHero function with trimmed hero name as argument
       searchHero(heroName.trim());
    });
}
 

// This function takes a string parameter and fetches data from the Marvel API using that parameter
const fetchHeroes=(hn) => fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${hn}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);

// This function takes a heroId parameter and fetches data from the Marvel API using that parameter
const fetchHero=(heroId) => fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=1&apikey=d51901e0cddf18f727fd9890c85bf119&hash=3c0807be06a02606d35aa7c35b9635aa`);

function displayingHeroes(){

     var currentIdGroup = "";
     cardGroup.innerHTML = "";
     heroes.map((hero, index) =>{

       
        console.log("index", index);

if(index % 3 === 0){

    currentIdGroup = "card-group-"+index;

    cardGroup.innerHTML += `
    
    <div id="card-group-${index}" class="card-group"  style="width: 90%;  margin: 0 auto; padding-left: 40px; margin-top: 40px;">



    </div>

    `;
}

var currentcardGroup =  document.getElementById(currentIdGroup);

currentcardGroup.innerHTML += `

 
         
        <div class="card" style="width: 400px; flex: none; margin-bottom: 15px;"        >
    <img    src="${hero.thumbnail.path +"."+ hero.thumbnail.extension} " class="card-img-top" alt="${heroName}+"image"">
    
    <div class="card-body text-center">
      <h5 class="card-title">${hero.name}</h5>
      <p class="card-text">${hero.description == "" ? "No description": hero.description} </p>
    </div>

    <div class="card-footer center">
      <div class="btn-group  " role="group" aria-label="Basic mixed styles example">

      
        <button id = "removefromfav-${hero.id}" type="button" onclick= "toggleFav(${hero.id}, 'removefromfav-${hero.id}')" class="btn btn-danger">${isPresent(hero.id) ? 'Unfavourite' : 'Favourite'}</button>  
 
  <button id="moreInfo" type="button" onclick= "moreInfo(${hero.id})" class="btn btn-warning">Know more</button>
  
</div>
    </div>
  </div>


        `; 

      
          })
}

/**
 * This function searches for a hero by name
 * @param {string} heroName - The name of the hero to search for
 */
function searchHero(heroName){
  // Fetches a list of heroes matching the given name and converts the response to JSON format
  fetchHeroes(heroName).then(response => response.json())
    .then(data => {
      // Copies the list of heroes into a new array using the spread operator
      heroes = [...data.data.results];
      // Calls a function to display the list of heroes
      displayingHeroes();
    });
}


/**
 * Takes a heroId as input and fetches the corresponding hero data from an API.
 * Stores the fetched data in localStorage and redirects to HeroInfo.html.
 *
 * @param {number} heroId - The ID of the hero to fetch.
 */
window.moreInfo = function (heroId){
  // Declare an empty object to store the current hero's data.
  let currentHero  = {};

  // Fetch the hero data from the API using the provided ID.
  fetchHero(heroId).then(response => response.json())
    .then(data => {
      // Store the first result from the fetched data in currentHero.
      currentHero = data.data.results[0];

      // Store currentHero in localStorage as a JSON string.
      localStorage.CurrentHero = JSON.stringify(currentHero);

      // Redirect to HeroInfo.html
      window.location.href = "./HeroInfo.html";
    }).catch(err=>{
      console.log(err);
    })
}


 
/**
 * Checks if a given heroId is present in the favourites array
 * @param {string} heroId - The ID of the hero to check for
 * @returns {boolean} - Returns true if the hero is present, false otherwise
 */
window.isPresent = function(heroId){
    // Loop through each element in the favourites array
    for(var x in favourites){
        // Log each element and the heroId being checked
        console.log(x, " ",heroId);
        // If the current element's id matches the heroId being checked, return true
        if(favourites[x].id === heroId){
            console.log('yes');
            return true;
        }
    }
    // If no match was found, log 'no' and return false
    console.log('no');
    return false;
}




// Function to toggle favourite status of a hero
window.toggleFav = function(heroId, elementId){

    // Get the HTML element by ID
    const element = document.getElementById(elementId);

    // If the innerHTML of the element is "Favourite"
    if(element.innerHTML == "Favourite"){

        // Initialize heroData variable
        var heroData;

        // Fetch hero data from API and add to favourites list
        fetchHero(heroId).then(response => response.json())
            .then(data => {

                // Get the hero data from response
                heroData = data.data.results[0];

                // If hero is not already in favourites list, add to it and update localStorage
                if(favourites.indexOf(heroData) == -1){
                    favourites.push(heroData);
                    console.log(favourites);
                    localStorage.Favourites = JSON.stringify(favourites);
                    element.innerHTML = "Unfavourite";
                    console.log("Liked ;)");
                }

            }).catch(err=>{
                console.log(err);
            })

    }
    else{

        // Initialize heroData variable

        var heroData;

        // Remove hero data from favourites list and update localStorage

        favourites  = favourites.filter( el => el.id !== heroId );

        console.log(favourites);
        localStorage.Favourites = JSON.stringify(favourites);
        console.log("Unliked");
        element.innerHTML = "Favourite"
    }
}


 

 


 loadEventListener();


