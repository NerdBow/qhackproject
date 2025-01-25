import { getClipboardImage, generateGraph, createCanvas} from "./scripts/graphs.js";
import { badSiteTimer, goodSiteTimer, productiveTime, rotTime, siteModifier, timerValue, updateTimer } from "./scripts/timer.js";



document.getElementById("shareButton").addEventListener("click", () => {
    updateTimer();
    getClipboardImage(rotTime, productiveTime);
    console.log(productiveTime, rotTime);
});

document.addEventListener("DOMContentLoaded", async () => {
    // USELESS CODE BUT MAKE THE VARIABLES LOAD IN FOR SOME REASON
    const result = await new Promise((resolve) => {
        chrome.storage.local.get(["myKey"], (data) => resolve(data));
      });
    displayGraph();
});

async function displayGraph() {
    updateTimer();
    document.getElementById("dailyStats").width = 300;
    document.getElementById("dailyStats").height = 300;
    console.log(rotTime, productiveTime);
    generateGraph(document.getElementById("dailyStats"), rotTime, productiveTime);
}


function convertToDisplayTime(timestamp){
    if (timestamp < 0) {
        return "0:00:00";
    }
    let extraZeroMinutes = "";
    let extraZeroSeconds = "";
    if (Math.floor((timestamp%3600)/60) < 10){
        extraZeroMinutes = "0";
    }
    if (timestamp%60 < 10){
        extraZeroSeconds = "0";
    }
    return (Math.floor(timestamp/3600) + ":" + extraZeroMinutes + Math.floor((timestamp%3600)/60) + ":" + extraZeroSeconds + timestamp%60);
}

function updateElapsedTime() {
    // Get the startTime from chrome.storage.local asynchronously
    chrome.storage.local.get(['startTime'], function(result) {
        const startTime = result.startTime;
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);  // Elapsed time in seconds
            let timeRaw = timerValue + elapsedTime*siteModifier;
            let timeProductiveRaw = productiveTime;
            let timeRotRaw = rotTime;
            if (siteModifier == 1){
                timeProductiveRaw += elapsedTime;
            }
            if (siteModifier == -1){
                timeRotRaw += elapsedTime;
            }

            document.getElementById("timer").innerText = `Time bank: ${convertToDisplayTime(timeRaw)}`;
            document.getElementById("productiveTimer").innerText = `Productive time: ${convertToDisplayTime(timeProductiveRaw)}`;
            document.getElementById("rotTimer").innerText = `Rot time: ${convertToDisplayTime(timeRotRaw)}`;
    });
}

updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);
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
        if (url) {
            if (unproductiveSites.includes(url)) {
                const index = unproductiveSites.indexOf(url);
                unproductiveSites.splice(index, 1);
                productiveSites.push(url);
                updateLocalStorage();
                chrome.runtime.sendMessage({ action: "setBadge", text: "Good", color: "green" });
                goodSiteTimer();
            }
        }
    });
    minusButton.addEventListener("click", function() {
        if (url) {
            if (productiveSites.includes(url)) {
                console.log(url)
                const index = productiveSites.indexOf(url);
                productiveSites.splice(index, 1);
                unproductiveSites.push(url);
                updateLocalStorage();
                chrome.runtime.sendMessage({ action: "setBadge", text: "Bad", color: "red" });
                badSiteTimer();
            }
        }
    });
});