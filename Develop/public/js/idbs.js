let db;

const request = indexedDB.open("budget", 1);
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_budget", { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;