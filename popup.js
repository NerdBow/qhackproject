import { productiveTime, rotTime, siteModifier, timerValue } from "./scripts/timer.js";
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
        // Check if startTime exists and is valid
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);  // Elapsed time in seconds
            //const modifier = chrome.storage.local.get(['siteModifier']);
            // Display the elapsed time in the popup
            let timeRaw = timerValue + elapsedTime*siteModifier;
            let timeProductiveRaw = productiveTime;
            let timeRotRaw = rotTime;
            if (siteModifier == 1){
                timeProductiveRaw += elapsedTime;
            }
            if (siteModifier == -1){
                timeRotRaw += elapsedTime;
            }

            //document.getElementById("timer").innerText = `Time bank: ${timerValue + elapsedTime*siteModifier} seconds`;
            document.getElementById("timer").innerText = `Time bank: ${convertToDisplayTime(timeRaw)}`;
            /*
            if (siteModifier == 1){
                document.getElementById("productiveTimer").innerText = `Productive time: ${productiveTime + elapsedTime} seconds`;
            } else{
                document.getElementById("productiveTimer").innerText = `Productive time: ${productiveTime} seconds`;
            }
            if (siteModifier == -1){
                document.getElementById("rotTimer").innerText = `Rot time: ${rotTime + elapsedTime} seconds`;
            } else{
                document.getElementById("rotTimer").innerText = `Rot time: ${rotTime} seconds`;
            }
                */
            document.getElementById("productiveTimer").innerText = `Productive time: ${convertToDisplayTime(timeProductiveRaw)}`;
            document.getElementById("rotTimer").innerText = `Rot time: ${convertToDisplayTime(timeRotRaw)}`;
    });
}

updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);