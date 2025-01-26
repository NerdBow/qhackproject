import { productiveTime, rotTime, siteModifier, timerValue, reset, updateTimer } from "./scripts/timer.js";
function convertToDisplayTime(timestamp){
    if (timestamp < 0){
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

document.addEventListener("DOMContentLoaded", async () => {
    const result = await new Promise((resolve) => {
        chrome.storage.local.get(["mykey"], (data) => resolve(data));
    });
    updateTimer();
});

updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);