const plusButton = document.getElementById("plusButton");
const minusButton = document.getElementById("minusButton");
let productiveSites = [];
let unproductiveSites = [];
chrome.storage.local.get(["productiveSites", "unproductiveSites"], function(result) {
    productiveSites = result.productiveSites ? JSON.parse(result.productiveSites) : [];
    unproductiveSites = result.unproductiveSites ? JSON.parse(result.unproductiveSites) : [];
});
let url = ""

function updateLocalStorage() {
    console.log(productiveSites);
    console.log(unproductiveSites);
    chrome.storage.local.set({
        productiveSites: JSON.stringify(productiveSites),
        unproductiveSites: JSON.stringify(unproductiveSites)
    });
}

chrome.runtime.sendMessage({ action: "checkCurrentSite" }, function(response) {
    if (response && response.url) {
        url = response.url
    }

    plusButton.addEventListener("click", function() {
        if (url && !productiveSites.includes(url) && !unproductiveSites.includes(url)) {
            productiveSites.push(url);
            updateLocalStorage();
        }
    });
    minusButton.addEventListener("click", function() {
        if (url && !productiveSites.includes(url) && !unproductiveSites.includes(url)) {
            unproductiveSites.push(url);
            updateLocalStorage();
        }
    });
});