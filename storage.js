var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
let open = indexedDB.open("TinderForCatsDB", 1);

// Create the schema
open.onupgradeneeded = function() {
    let db = open.result;
    db.createObjectStore("ProfileStore", {keyPath: ["profile.name", "profile.age"]});
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
