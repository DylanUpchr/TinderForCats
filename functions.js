function init(){
    //Add click listeners to buttons
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
}

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
function loadTabContent(tabName){
    switch (tabName) {
        case "homeTab":
            break;
        case "favoritesTab":
            loadProfiles("favoritesContent", "favorites");
            break;
        case "likedTab":
            loadProfiles("likedContent", "likes");
            break;
        default:
            break;
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
   
