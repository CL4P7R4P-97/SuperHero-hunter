// An empty array to store favourites
var favourites = [];

// Selecting the element with class "main-container" and assigning it to a constant variable
const cardGroup = document.querySelector(".main-container");

// Setting the zoom level of the body element to 90%
document.body.style.zoom = "90%";

function noHeroes(){

      
      cardGroup.innerHTML = 
         
         `<a href="https://codepen.io/uiswarup/full/yLzypyY" target="_blank">
  <header class="top-header">
</header>

<!--dust particel-->
<div>
  <div class="starsec"></div>
  <div class="starthird"></div>
  <div class="starfourth"></div>
  <div class="starfifth"></div>
</div>
<!--Dust particle end--->


<div class="lamp__wrap">
  <div class="lamp">
    <div class="cable"></div>
    <div class="cover"></div>
    <div class="in-cover">
      <div class="bulb"></div>
    </div>
    <div class="light"></div>
  </div>
</div>
<!-- END Lamp -->
<section class="error">
  <!-- Content -->
  <div class="error__content">
    <div class="error__message message">
      <h1 class="message__title" class="text-white">No Heroes !!!</h1>
      <p class="message__text">Add to let them know you want them ...</p>
    </div>
    <div class="error__nav e-nav">
      <a href="./index.html"   class="e-nav__link"></a>
    </div>
  </div>
  <!-- END Content -->

</section>

  </a>`;
         
         
}

// Check if Favourites exists in localStorage and is not null or undefined
if(localStorage.Favourites !== null && localStorage.Favourites !== undefined){

     // If Favourites is found, log the message and parse the JSON data
     console.log("Favourites found!" , JSON.parse(localStorage.Favourites));

     // Set favourites variable to the parsed JSON data
     favourites =   JSON.parse(localStorage.Favourites) ;

}else{
    // If Favourites is not found, set favourites variable to an empty array
    favourites= [];

    // Set Favourites in localStorage as an empty array in JSON format
    localStorage.setItem('Favourites',JSON.stringify(favourites));

    // Log the message that Favourites was not found
    console.log("Favourites not found");
}

// This function takes a heroId parameter and fetches data from the Marvel API using that parameter
const fetchHero=(heroId) => fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=1&apikey=d51901e0cddf18f727fd9890c85bf119&hash=3c0807be06a02606d35aa7c35b9635aa`);



function displayingHeroes(){
 
     var currentIdGroup = "";
     cardGroup.innerHTML = "";
     if(favourites.length != 0 ){
        favourites.map((hero, index) =>{

       
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

 
         
        <div class="card" id="card-${hero.id}" style="width: 400px; flex: none; margin-bottom: 15px;"        >
    <img    src="${hero.thumbnail.path +"."+ hero.thumbnail.extension} " class="card-img-top" alt="${hero.name}+"image"">
    
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
     else{

       noHeroes();

     }
}


// This function checks if a heroId is present in the favourites array
// Input: heroId (number)
// Output: boolean value (true if heroId is present, false otherwise)
window.isPresent = function(heroId){
  // Loop through each item in the favourites array
  for(var x in favourites){
    // Print the current index and heroId for debugging purposes
    console.log(x, " ",heroId);
    // Check if the current item's id matches the given heroId
    if(favourites[x].id === heroId){
      // If there is a match, print 'yes' and return true
      console.log('yes');
      return true;
    }
  }
  // If there is no match, print 'no' and return false
  console.log('no');
  return false;
}


// Function to toggle favourite status of a hero
// Takes in heroId and elementId as parameters
window.toggleFav = function(heroId, elementId){

    // Get the HTML element with given ID
    const element = document.getElementById(elementId);

    // Check if the element's innerHTML is "Favourite"
    if(element.innerHTML == "Favourite"){

        // Declare variable for storing hero data
        var heroData;

        // Fetch hero data using heroId
        fetchHero(heroId).then(response => response.json())
        .then(data => {
            
            // Store the first result in the returned data
            heroData = data.data.results[0];

            // If the hero is not already in favourites list, add it to favourites list and local storage
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
    // If the element's innerHTML is not "Favourite"
    else{

        // Declare variable for storing hero data
        var heroData;

        // Remove the selected hero from favourites list and update local storage accordingly
        favourites  = favourites.filter( el => el.id !== heroId );
        
        console.log(favourites);
        localStorage.Favourites = JSON.stringify(favourites);
        
        console.log("Unliked");

        // Remove the card of unliked hero from DOM 
        document.getElementById('card-'+heroId).remove();

      	// If there are no more heroes in favourites list, display message 
      	if(favourites.length == 0){
          	noHeroes();
      	}
    }    
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




// When the window loads, call the displayingHeroes function
window.onload=()=>{
  displayingHeroes();
}



