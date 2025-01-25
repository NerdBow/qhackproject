import { getClipboardImage, generateGraph, createCanvas} from "./scripts/graphs.js";
import { productiveTime, rotTime, siteModifier, timerValue, updateTimer } from "./scripts/timer.js";

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
    const canvasSize = 200; // Set the graph size
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Generate the graph on the canvas
    generateGraph(canvas, rotTime, productiveTime);
}

export function convertToDisplayTime(timestamp){
    if (timestamp < 0){
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

updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);