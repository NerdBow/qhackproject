import { getClipboardImage, generateGraph, createCanvas} from "./scripts/shareButton.js";
import { productiveTime, rotTime, siteModifier, timerValue } from "./scripts/timer.js";

document.getElementById("dailyStats").width = 300;
document.getElementById("dailyStats").height = 300;
generateGraph(document.getElementById("dailyStats"), 10, 20);

document.getElementById("shareButton").addEventListener("click", () => {
    // chrome.storage.local.get("rotTime");
    // chrome.storage.local.get("productiveTime");
    getClipboardImage(10.2, 2);
});

function convertToDisplayTime(timestamp){
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
