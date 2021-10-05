var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
var open = indexedDB.open("TinderForCatsDB", 1);

// Create the schema
open.onupgradeneeded = function() {
    var db = open.result;
    var profileStore = db.createObjectStore("ProfileStore", {keyPath: ["profile.name", "profile.age"]});
    var index = profileStore.createIndex("LikedFavoritedIndex", ["liked", "favorited"], {unique: false});
    var index = profileStore.createIndex("LikedIndex", "liked", {unique: false});
};
function addObjectToLocalStorageArray(arrayKey, obj){
    let array = JSON.parse(localStorage.getItem(arrayKey));
    array.push(obj)
    localStorage.setItem(arrayKey, JSON.stringify(array));
}
function addObjectToIndexedDB(obj, liked, favorited){
    let open = indexedDB.open("TinderForCatsDB", 1);
    open.onsuccess = function(){
        let db = open.result;
        let tx = db.transaction("ProfileStore", "readwrite");
        let store = tx.objectStore("ProfileStore");
        store.put({profile: obj, liked: liked, favorited: favorited});
        tx.oncomplete = function() {
            db.close();
        }
    }
}
