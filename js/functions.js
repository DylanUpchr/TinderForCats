/**
 * Author:      Dylan Upchurch
 * Date:        2021-10-10
 * Description: General functions used by TinderForCats
 */
/**
 * Initializes application by setting tab button event listeners, Swipe event listeners 
 * and loading the initial profile into the homeContent div.
 */
function init(){
    //Add click listeners to tab buttons
    let tabButtons = document.getElementsByClassName("tabButton");
    for(let button of tabButtons){
        button.addEventListener("click", function(e){showTab(e.target.value); });
    }
    //Add up, left and right swipe events on profile
    (new Swipe('#homeContent')).onLeft(function() { loadProfile("homeContent"); }).run();
    (new Swipe('#homeContent')).onUp(function() { addFavorite(); loadProfile("homeContent"); }).run();
    (new Swipe('#homeContent')).onRight(function() { addLike(); loadProfile("homeContent"); }).run();
    //Load first profile into home
    loadProfile("homeContent");

    //Register DB sync service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('js/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          });
        });
      }
}

/**
 * Display tab depending on button pressed, 
 * uses currentTab class to set diplay: flex, otherwise tab class display is set to none.
 * @param {string} tabName Name of tab from pressed button's value field.
 */
function showTab(tabName){
    //Hide all tabs
    let tabs = document.getElementsByClassName("tab");
    for(let tab of tabs){
        tab.classList.remove("currentTab");
    }

    //Show selected tab
    let tab = document.getElementById(tabName);
    tab.classList.add("currentTab");
    loadTabContent(tabName);
}
/**
 * Load content for favorites and likes tabs when called by showTab.
 * Calls loadProfiles in profile.js to generate and inject HTML into the specified div.
 * @param {string} tabName Name of tab being loaded.
 */
function loadTabContent(tabName){
    switch (tabName) {
        case "favoritesTab":
            loadProfiles("favoritesContent", "favorited");
            break;
        case "likedTab":
            loadProfiles("likedContent", "liked");
            break;
        default:
            break;
    }
}
/**
 * Random number generator from minimum upto but not including maximum.
 * @param {int} min Exclusive maximum.
 * @param {int} max Inclusive minimum.
 * @returns 
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
   
