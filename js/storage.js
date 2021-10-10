/**
 * Author:      Dylan Upchurch
 * Date:        2021-10-10
 * Description: All storage related functions (IndexedDB/Remote API storage) used by TinderForCats.
 */
// declare indexedDB global variable for all scripts
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
let open = indexedDB.open("TinderForCatsDB", 1);

// Create the schema
open.onupgradeneeded = function() {
    let db = open.result;
    db.createObjectStore("ProfileStore", {keyPath: ["profile.name", "profile.age"]});
};
/**
 * Add an object to the IndexedDB database
 * @param {Object} obj Profile to add
 * @param {boolean} liked Liked boolean
 * @param {boolean} favorited Favorited boolean
 */
function addObjectToIndexedDB(obj, liked, favorited){
    //Open IndexedDB
    let open = indexedDB.open("TinderForCatsDB", 1);
    open.onsuccess = function(){
        let db = open.result;
        let tx = db.transaction("ProfileStore", "readwrite");
        let store = tx.objectStore("ProfileStore");

        //Add object with profile and liked/favorited booleans
        store.put({profile: obj, liked: liked, favorited: favorited});

        //Close DB when done
        tx.oncomplete = function() {
            db.close();
        }
    }
}
/**
 * 
 * @param {string} url Remote API URL
 * @param {Object} obj Profile object to add to remote storage
 * @param {boolean} liked Liked boolean
 * @param {boolean} favorited Favorited boolean
 */
function addObjectToAPI(url = "http://localhost:3000/catProfiles", obj, liked, favorited){
    //Create application/x-www-form-urlencoded Content-Type data object
    let data = new URLSearchParams({
        'profile': JSON.stringify(obj),
        'liked': liked,
        'favorited': favorited
    });

    //Add data object to API by POST method
    fetch(url, {
        method: "POST", 
        body: data
      });
}
/**
 * 
 * @param {string} url Remote API URL
 * @returns Data stored in Remote API
 */
async function getObjectsFromAPI(url = "http://localhost:3000/catProfiles"){
    let data = await fetch(url)
    .then(res => res.json())

    return data;
}
