/**
 * Author:      Dylan Upchurch
 * Date:        2021-10-10
 * Description: All profile related functions used by TinderForCats
 */
/**
 * Adds the profile object stored as currentProfile in localStorage into the IndexedDB and adds it to the remote API aswell.
 */
function addFavorite(){
    let profile = JSON.parse(localStorage.getItem("currentProfile"));
    addObjectToIndexedDB(profile, false, true);
    addObjectToAPI("http://localhost:3000/catProfiles", profile, false, true);
}
/**
 * Adds the profile object stored as currentProfile in localStorage into the IndexedDB and adds it to the remote API aswell.
 */
function addLike(){
    let profile = JSON.parse(localStorage.getItem("currentProfile"));
    addObjectToIndexedDB(profile, true, false);
    addObjectToAPI("http://localhost:3000/catProfiles", profile, true, false);
}
/**
 * Generates a random profile from thecatapi.com API and Mr. Zanardi's catname API.
 * @returns Profile object containing name, age, random distance, flavor text and an image.
 */
async function generateProfile(){
    //API URLs
    let dataUrl = "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1";
    let nameUrl = "https://tomatebanane.ch/api/catname/random";

    //DataPromise gets thecatapi data, later combined with NamePromise's data.
    let dataPromise = await fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            let profile = {
                age: getRandomInt(2, 19),
                distance: getRandomInt(1, 50),
                text: data[0].breeds[0].description,
                img: data[0].url
            };
            return profile
        });
    //NamePromise get a random cat name, later combined with DataPromise's data.
    let namePromise = await fetch(nameUrl)
    .then(response => response.json())
    .then(data => {
        return data[0].name;
    });
    //MainPromise combines DataPromise's and NamePromise's data to form a complete profile object and returns it.
    let mainPromise = Promise.all([dataPromise, namePromise]).then((data) => {
        data[0].name = data[1];
        return data[0];
    });
    return mainPromise;
}
/**
 * Loads a randomly generated profile into the specified div.
 * Used for the main page, the div name is homeContent.
 * @param {string} contentDivName Name of the div to load the content into.
 */
function loadProfile(contentDivName){
    //Get profile object and content div element
    generateProfile().then(profile => {
        localStorage.setItem("currentProfile", JSON.stringify(profile));
        let contentDiv = document.getElementById(contentDivName);
        contentDiv.innerHTML = "";

        //Generate HTML content for a single profile
        let content = generateSingleProfilePage(profile);

        //Put content div into existing container to show the profile
        contentDiv.appendChild(content);
    });
}
/**
 * Loads either the liked or the favorited profiles into the specified div.
 * @param {string} contentDivName Name of the div to load the content into.
 * @param {string} profileStatus 
 */
function loadProfiles(contentDivName, profileStatus){
    //Open IndexedDB
    let open = indexedDB.open("TinderForCatsDB", 1);
    open.onsuccess = function(){
        let db = open.result;
        let tx = db.transaction("ProfileStore", "readwrite");
        let store = tx.objectStore("ProfileStore");
        let profiles;

        //Get all profiles
        let profilesQuery = store.getAll();

        profilesQuery.onsuccess = function(){

            //Filter profiles based on profile status
            if (profileStatus == "liked") {
                profiles = profilesQuery.result.filter((profile) => (profile.liked ? profile : null));
            } else if (profileStatus == "favorited"){
                profiles = profilesQuery.result.filter((profile) => (profile.favorited ? profile : null));
            }

            //Generate HTML and inject it into specified div
            //Clear div
            let contentDiv = document.getElementById(contentDivName);
            contentDiv.innerHTML = "";
            //Generate HTML
            let content = generateMultipleProfilePage(profiles);
            //Inject into page
            contentDiv.appendChild(content);
        }

        //Close DB when done
        tx.oncomplete = function() {
            db.close();
        };
    }
}
/**
 * 
 * @param {Object} profile Singular profile object.
 * @returns Page displaying a single profile.
 */
function generateSingleProfilePage(profile){

        //Create html elements
        let content = document.createElement("div");
        let profileFlavorText = document.createElement("p");

        //Generate profile HTML and add the profile's flavor text to it
        generateCommonProfileContent(content, profile);
        profileFlavorText.innerText = profile.text;

        //Build content div element with other elements
        content.classList.add("profile");
        content.appendChild(document.createElement("hr"));
        content.appendChild(profileFlavorText);

        return content;
}
/**
 * 
 * @param {Array[]} profiles Array of profile objects.
 * @returns Page displaying multiple profiles.
 */
function generateMultipleProfilePage(profiles){
    let content = document.createElement("div");
    for (const index in profiles.reverse()) {
        if (Object.hasOwnProperty.call(profiles, index)) {
            const profile = profiles[index];
            let profileDiv = generateProfileCard(profile.profile);
            content.appendChild(profileDiv);
        }
    }
    return content;
}
/**
 * 
 * @param {Object} profile Singular profile object.
 * @returns Card displaying a single profile, meant for pages displaying multiple profiles.
 */
function generateProfileCard(profile){
    //Create HTML elements
    let profileCard = document.createElement("div");
    profileCard.classList.add("card");
    
    //Generate profile HTML
    generateCommonProfileContent(profileCard, profile);

    return profileCard;
}
/**
 * Generates profile HTML used by both singular and multiple profile pages and appends it to content container.
 * @param {string} contentDiv Content container to put the information in.
 * @param {Object} profile Singular profile object.
 */
function generateCommonProfileContent(contentDiv, profile){
    //Generate HTML elements, (div -> container, img -> image, p -> text/information, i -> fontawesome icons)
    let infoDiv = document.createElement("div");
    let img = document.createElement("img");
    let distanceInfo = document.createElement("p");
    let distanceInfoMarkerIcon = document.createElement("i");
    let catInfo = document.createElement("p");
    let catInfoIcon = document.createElement("i");

    //Put information into HTML elements
    img.setAttribute("src", profile.img);
    distanceInfoMarkerIcon.classList.add("fas");
    distanceInfoMarkerIcon.classList.add("fa-map-marker-alt");
    distanceInfo.appendChild(distanceInfoMarkerIcon);
    distanceInfo.append(" " + profile.distance + " km away");
    catInfoIcon.classList.add("fas");
    catInfoIcon.classList.add("fa-cat");
    catInfo.appendChild(catInfoIcon);
    catInfo.append(" " + profile.name + ", " + profile.age + " years old");
    infoDiv.appendChild(catInfo);
    infoDiv.appendChild(distanceInfo);

    //Append content into container
    contentDiv.appendChild(img);
    contentDiv.appendChild(infoDiv);
}