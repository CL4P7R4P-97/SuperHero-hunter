var favourites = [];
// Check if there are any favourites stored in the browser's local storage
if(localStorage.Favourites !== null && localStorage.Favourites !== undefined){

    // If favourites are found, parse the JSON string and assign it to the 'favourites' variable
    favourites =   JSON.parse(localStorage.Favourites) ;

}else{
    // If no favourites are found, initialize an empty array and store it in local storage as a JSON string
    favourites= [];
    localStorage.setItem('Favourites',JSON.stringify(favourites));
}


window.onload = function(){
    const hero = JSON.parse(localStorage.CurrentHero);
    console.log(hero);
   const box = document.querySelector('.heroBox');
  document.title = hero.name;
// console.log(hero.stories);
  box.innerHTML = `
  
  <section class="h-100 gradient-custom-2">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-9 col-xl-7">
        <div class="card">
          <div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height:200px;">
            <div class="ms-4 mt-5 d-flex flex-column" style="width: 150px;">
              <img src="${hero.thumbnail.path +"."+ hero.thumbnail.extension}"
                alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2"
                style="width: 150px; z-index: 1">
              <button id="favButton" type="button" class="btn btn-outline-danger" data-mdb-ripple-color="danger"
              id = "removefromfav-${hero.id}"   onclick= "toggleFav(${hero.id}, 'favButton')"
                style="z-index: 1;">
                ${isPresent(hero.id) ? 'Unfavourite' : 'Favourite'}
              </button>
            </div>
            <div class="ms-3" style="margin-top: 130px;">
              <h5>${hero.name}</h5>
              <p></p>
            </div>
          </div>
          <div class="p-4 text-black" style="background-color: #f8f9fa;">
            <div class="d-flex justify-content-end text-center py-1">
              <div>
                <p class="mb-1 h5">${hero.stories.available}</p>
                <p class="small text-muted mb-0">Stories</p>
              </div>
              <div class="px-3">
                <p class="mb-1 h5">${hero.series.available}</p>
                <p class="small text-muted mb-0">Series</p>
              </div>
              <div>
                <p class="mb-1 h5">${hero.comics.available}</p>
                <p class="small text-muted mb-0">Comics</p>
              </div>
            </div>
          </div>
          <div class="card-body p-4 text-black">
            <div class="mb-5">
              <p class="lead fw-normal mb-1">About</p>
              <div class="p-4" style="background-color: #f8f9fa;">
                <p class="font-italic mb-1">${hero.description}</p>
                 ${hero.urls[0] !== undefined ? `<p class="font-italic mb-1"><a href="${hero.urls[0].url}">Details</a></p>`  : ``}

                    ${hero.urls[1] !== undefined ? ` <p class="font-italic mb-1"><a href="${hero.urls[1].url}">Wiki</a></p>`  : ``}
                       ${hero.urls[2] !== undefined ? `<p class="font-italic mb-0"><a href="${hero.urls[2].url}">Comic</a></p>`  : ``}
                
                
              </div>
            </div>
            
           
             
            
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  
  `
  
};




/**
 * Checks if a given heroId is present in the favourites array
 * @param {number} heroId - The ID of the hero to check for presence
 * @returns {boolean} - Returns true if the heroId is present in favourites, otherwise returns false.
 */
window.isPresent = function(heroId){
 for(var x in favourites){
    if(favourites[x].id === heroId){
        return true;
    }
 }
 return false;
}

 // This function fetches data of a Marvel hero with the given heroId
const fetchHero = (heroId) => {
  // The data is fetched from the Marvel API using the provided endpoint and authentication parameters
  return fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=1&apikey=d51901e0cddf18f727fd9890c85bf119&hash=3c0807be06a02606d35aa7c35b9635aa`);
};


// This function toggles the favourite status of a hero based on the current state of the element with given ID
// It takes in two parameters: heroId (the ID of the hero) and elementId (the ID of the element whose innerHTML will be updated)
window.toggleFav = function(heroId, elementId){

    // Get the element with given ID
    const element = document.getElementById(elementId);

    // If the current innerHTML of the element is "Favourite"
    if(element.innerHTML == "Favourite"){

        // Define a variable to hold hero data
        var heroData;

        // Fetch hero data using fetchHero function and update favourites accordingly
        fetchHero(heroId).then(response => response.json())
        .then(data => {

            // Get hero data from response
            heroData = data.data.results[0];

            // If hero is not already in favourites, add it and update localStorage and innerHTML of given element
            if(favourites.indexOf(heroData) == -1){
                favourites.push(heroData);
                localStorage.Favourites = JSON.stringify(favourites);
                element.innerHTML = "Unfavourite";
            }

        }).catch(err=>{
            console.log(err);
        })

    }
    else{

        // Define a variable to hold hero data
        var heroData;

        // Remove selected hero from favourites and update localStorage and innerHTML of given element
        favourites  = favourites.filter( el => el.id !== heroId );
        localStorage.Favourites = JSON.stringify(favourites);
        element.innerHTML = "Favourite"
    }

}

