import { productiveTime, rotTime, siteModifier, timerValue } from "./scripts/timer.js";
//import { getIncrement } from "./background.js"
//import { increment } from "./background.js";

//function updatePopupCounter() {
//    const timerValue = getTime();
//    document.getElementById("counter").innerHTML = timerValue;
//}
//etInterval(updatePopupCounter, 1000);
//export function setIt(){
  //  setInterval(counter, 1000, 1);
//}
function updateElapsedTime() {
    // Get the startTime from chrome.storage.local asynchronously
    chrome.storage.local.get(['startTime'], function(result) {
        const startTime = result.startTime;
        // Check if startTime exists and is valid
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);  // Elapsed time in seconds
            //const modifier = chrome.storage.local.get(['siteModifier']);
            // Display the elapsed time in the popup
            document.getElementById("timer").innerText = `Time bank: ${timerValue + elapsedTime*siteModifier} seconds`;
            if (siteModifier == 1){
                document.getElementById("productiveTimer").innerText = `Producitve time: ${productiveTime + elapsedTime} seconds`;
            } else{
                document.getElementById("productiveTimer").innerText = `Producitve time: ${productiveTime} seconds`;
            }
            if (siteModifier == -1){
                document.getElementById("rotTimer").innerText = `Rot time: ${rotTime + elapsedTime} seconds`;
            } else{
                document.getElementById("rotTimer").innerText = `Rot time: ${rotTime} seconds`;
            }
    });
}

updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);