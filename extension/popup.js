import { getClipboardImage, generateGraph, createCanvas} from "./scripts/graphs.js";
import { productiveTime, rotTime, siteModifier, timerValue, updateTimer, reset } from "./scripts/timer.js";

document.getElementById("shareButton").addEventListener("click", () => {
    updateTimer();
    console.log("Productive Time:", productiveTime, "Rot Time:", rotTime);
    getClipboardImage(rotTime, productiveTime);
});

document.addEventListener("DOMContentLoaded", async () => {
    // USELESS CODE BUT MAKE THE VARIABLES LOAD IN FOR SOME REASON
    const result = await new Promise((resolve) => {
        chrome.storage.local.get(["myKey"], (data) => resolve(data));
      });
    displayGraph();
});

async function displayGraph() {
    // Ensure timer values are up to date
    updateTimer();

    const canvas = document.getElementById("dailyStats");
    const canvasSize = 250; // Set the graph size
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Generate the graph on the canvas
    generateGraph(canvas, rotTime, productiveTime);
}


export function convertToDisplayTime(timestamp){
    if (timestamp < 0) {
        return "0:00:00";
    }
    let extraZeroMinutes = "";
    let extraZeroSeconds = "";
    if (Math.floor((timestamp%3600) / 60) < 10){
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

            document.getElementById("timer").innerText = `Time Bank ${convertToDisplayTime(timeRaw)}`;
            document.getElementById("productiveTimer").innerText = `Productive time: ${convertToDisplayTime(timeProductiveRaw)}`;
            document.getElementById("rotTimer").innerText = `Rot time: ${convertToDisplayTime(timeRotRaw)}`;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const result = await new Promise((resolve) => {
        chrome.storage.local.get(["mykey"], (data) => resolve(data));
    });
    updateTimer();
});
updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);

const prodButton = document.getElementById("prodButton");
const unprodButton = document.getElementById("unprodButton");
const getApiKeyButton = document.getElementById("getApiKeyButton");

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

    prodButton.addEventListener("click", function() {
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
    unprodButton.addEventListener("click", function() {
        //chrome.runtime.sendMessage({ action: "updateBody" });
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

getApiKeyButton.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://aistudio.google.com/app/prompts/new_chat?_gl=1*ij52k8*_ga*MTg0MTg5NjI0NC4xNzM3NzkyMDk1*_ga_P1DBVKWT6V*MTczNzgzOTgyMy4yLjAuMTczNzgzOTgyNS41OC4wLjIxNDM2MTMxNQ.." });
});

document.getElementById("friends-list-button").addEventListener("click", () => {
    window.location.href = "friends.html";
});
  