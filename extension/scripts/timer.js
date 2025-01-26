export let timerValue = 0;
export let siteModifier = 0;
export let productiveTime = 0;
export let rotTime = 0;
export let startTime = 0;
let doReset = false;
//export let date = Date.now();
//export let currentDay = Math.floor(date/60000);
//export let currentDay = "";
//export let newDay = "";

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
        //console.log("Rot Time: " + rotTime);
    } else if (siteModifier === 1){
        productiveTime += Math.floor((Date.now() - startTime) / 1000);
        chrome.storage.local.set({ productiveTime: productiveTime });
    }
    //console.log(currentDay + "BEFORE RESET");
    reset();
    //chrome.storage.local.set({ currentDay: currentDay });
    //console.log(currentDay + "AFTER RESET");
    chrome.storage.local.set({ timerValue: timerValue });
    chrome.storage.local.set({ rotTime: rotTime });
    chrome.storage.local.set({ productiveTime: productiveTime });

    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
}

export function reset(){
    //date = Date.now();
    //newDay = Math.floor(date/60000);
    console.log("Rot Time: " + rotTime);
    if (doReset){
        doReset = false;
        chrome.storage.local.set({ doReset: doReset });
        //currentDay = newDay;
        //chrome.storage.local.set( { currentDay : newDay } );
        console.log("AAAAAAAAAAAAA");
        rotTime = 0;
        //console.log("Rot" + rotTime);
        productiveTime = 0;
        chrome.storage.local.set({ rotTime: rotTime });
        chrome.storage.local.set({ productiveTime: productiveTime });
    }
    console.log("BBBBBBBBBBBB");
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
    console.log("It has been set.");
    doReset = true;
    chrome.storage.local.set({ doReset: doReset });
}