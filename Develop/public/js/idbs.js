let db;

const request = indexedDB.open("budget", 1);
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_budget", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadBudget();
  }
};

request.onerror = function (event) {
  console.log("Error:" + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const budgetObjectStore = transaction.objectStore("new_budget");
  budgetObjectStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const store = transaction.objectStore("new_budget");

  const getEverything = store.getAll();

  getEverything.onsuccess = function () {
    if (getEverything.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getEverything.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["new_budget"], "readwrite");

          const store = transaction.objectStore("new_budget");

          store.clear();
        });
    }
  };
}
function deleteInProgress() {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const store = transaction.objectStore("new_budget");
  store.clear();
}

window.addEventListener("online", uploadBudget);
