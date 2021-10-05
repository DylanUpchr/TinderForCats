function addFavorite(){
    let profile = JSON.parse(localStorage.getItem("currentProfile"));
    addObjectToIndexedDB(profile, false, true);
}
function addLike(){
    let profile = JSON.parse(localStorage.getItem("currentProfile"));
    addObjectToIndexedDB(profile, true, false);
}
async function generateProfile(){
    //Async profile
    let dataUrl = "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1";
    let nameUrl = "https://tomatebanane.ch/api/catname/random";
    let dataPromise = await fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            let profile = {
                name: "Test",
                age: getRandomInt(2, 19),
                distance: getRandomInt(1, 50),
                text: data[0].breeds[0].description,
                img: data[0].url
            };
            return profile
        });
    let namePromise = await fetch(nameUrl)
    .then(response => response.json())
    .then(data => {
        return data[0].name;
    });
    let mainPromise = Promise.all([dataPromise, namePromise]).then((data) => {
        data[0].name = data[1];
        return data[0];
    });
    return mainPromise;
}
function loadProfile(contentDivName){
    //Get profile object and content div element
    generateProfile().then(profile => {
        localStorage.setItem("currentProfile", JSON.stringify(profile));
        let contentDiv = document.getElementById(contentDivName);
        contentDiv.innerHTML = "";

        let content = generateSingleProfilePage(profile);

        //Put content div into existing container to show the profile
        contentDiv.appendChild(content);
    });
}
function loadProfiles(contentDivName, arrayKey){

    //let profiles = JSON.parse(localStorage.getItem(arrayKey));
    
    let open = indexedDB.open("TinderForCatsDB", 1);
    open.onsuccess = function(){
        let db = open.result;
        let tx = db.transaction("ProfileStore", "readwrite");
        let store = tx.objectStore("ProfileStore");
        let profiles;

        let profilesQuery = store.getAll();

        profilesQuery.onsuccess = function(){
            if (arrayKey == "likes") {
                profiles = profilesQuery.result.filter((profile) => (profile.liked ? profile : null));
            } else if (arrayKey == "favorites"){
                profiles = profilesQuery.result.filter((profile) => (profile.favorited ? profile : null));
            }

            let contentDiv = document.getElementById(contentDivName);
            contentDiv.innerHTML = "";
            let content = generateMultipleProfilePage(profiles);
            //Put content div into existing container to show the profile
            contentDiv.appendChild(content);
        }

        tx.oncomplete = function() {
            db.close();
        };
    }
}
function generateSingleProfilePage(profile){

        //Create html elements
        let content = document.createElement("div");
        let profileFlavorText = document.createElement("p");


        generateCommonProfileContent(content, profile);
        profileFlavorText.innerText = profile.text;

        //Build content div element with other elements
        content.classList.add("profile");
        content.appendChild(document.createElement("hr"));
        content.appendChild(profileFlavorText);

        return content;
}
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
function generateProfileCard(profile){
    let profileCard = document.createElement("div");
    profileCard.classList.add("card");
    
    generateCommonProfileContent(profileCard, profile);

    return profileCard;
}
function generateCommonProfileContent(contentDiv, profile){
    let infoDiv = document.createElement("div");
    let img = document.createElement("img");
    let distanceInfo = document.createElement("p");
    let distanceInfoMarkerIcon = document.createElement("i");
    let catInfo = document.createElement("p");
    let catInfoIcon = document.createElement("i");

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

    contentDiv.appendChild(img);
    contentDiv.appendChild(infoDiv);
}