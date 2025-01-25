import { siteModifier, timerValue } from "./scripts/timer.js";
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
            document.getElementById("counter").innerText = `${timerValue + elapsedTime*siteModifier} seconds`;
    });
}

updateElapsedTime(); // this is just so it displays on the first second
setInterval(updateElapsedTime, 1000);