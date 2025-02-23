export let timerValue = 0;
export let siteModifier = 0;
export let productiveTime = 0;
export let rotTime = 0;
export let startTime = 0;
let doReset = false;

// This just retrives all the old values for the variables from local storage since they get killed when it runs again
chrome.storage.local.get(['timerValue', 'siteModifier', 'productiveTime', 'rotTime', 'startTime', 'doReset'], function(result) {
    if (result.timerValue !== undefined) {
        timerValue = result.timerValue;
    }
    if (result.siteModifier !== undefined) {
        siteModifier = result.siteModifier;
    }
    if (result.productiveTime !== undefined) {
        productiveTime = result.productiveTime;
    }
    if (result.rotTime !== undefined) {
        rotTime = result.rotTime;
    }
    if (result.startTime !== undefined) {
        startTime = result.startTime;
    }
    if (result.doReset !== undefined) {
        doReset = result.doReset;
    }
});

// These get called from background.js when the user switches a site
export function badSiteTimer(){
    updateTimer();
    siteModifier = -1;
    chrome.storage.local.set({ siteModifier: -1 });
}

export function goodSiteTimer(){
    updateTimer();
    siteModifier = 1;
    chrome.storage.local.set({ siteModifier: 1 });
}

export function neutralSiteTimer(){
    updateTimer();
    siteModifier = 0;
    chrome.storage.local.set({ siteModifier: 0 });
}

// This updates each of the timers
export function updateTimer(){
    console.log("Running updateTimer");
    console.log("doReset: " + doReset);
    if (timerValue < 0) {
        timerValue = 0;
    }

    timerValue += Math.floor((Date.now() - startTime) / 1000) * siteModifier;
    if (timerValue < 0){
        timerValue = 0;
    }
    if (siteModifier === -1){
        rotTime += Math.floor((Date.now() - startTime) / 1000);
        chrome.storage.local.set({ rotTime: rotTime });
    } else if (siteModifier === 1){
        productiveTime += Math.floor((Date.now() - startTime) / 1000);
        chrome.storage.local.set({ productiveTime: productiveTime });
    }
    reset();
    chrome.storage.local.set({ timerValue: timerValue });
    chrome.storage.local.set({ rotTime: rotTime });
    chrome.storage.local.set({ productiveTime: productiveTime });

    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
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

export function reset(){
    if (doReset){
        doReset = false;
        chrome.storage.local.set({ doReset: doReset });
        rotTime = 0;
        productiveTime = 0;
        chrome.storage.local.set({ rotTime: rotTime });
        chrome.storage.local.set({ productiveTime: productiveTime });
    }
}

export async function checkRedirect(){
    chrome.storage.local.get(['startTime'], function(result) {
        const startTime = result.startTime;
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        if (timerValue + elapsedTime * siteModifier <= 0){
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]){
                    const activeTab = tabs[0];
                    chrome.tabs.update(activeTab.id, { url: "https://peerwise.cs.auckland.ac.nz/?nop" });
                }
            });
        }
    });
}

export function setReset(){
    doReset = true;
    chrome.storage.local.set({ doReset: doReset });
}
