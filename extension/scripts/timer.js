export let timerValue = 0;
export let siteModifier = 0;
export let productiveTime = 0;
export let rotTime = 0;
export let startTime = 0;
export let date = new Date();
date = new Date();
export let currentDay = `${date.getMinutes()}-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
//export let currentDay = "";
export let newDay = "";

// This just retrives all the old values for the variables from local storage since they get killed when it runs again
chrome.storage.local.get('timerValue', (data) => {
    if (data.timerValue !== undefined) {
      timerValue = data.timerValue;
    }
});

chrome.storage.local.get('siteModifier', (data) => {
    if (data.siteModifier !== undefined) {
      siteModifier = data.siteModifier;
    }
});

chrome.storage.local.get('productiveTime', (data) => {
    if (data.productiveTime !== undefined) {
      productiveTime = data.productiveTime;
    }
});

chrome.storage.local.get('rotTime', (data) => {
    if (data.rotTime !== undefined) {
      rotTime = data.rotTime;
    }
});

chrome.storage.local.get('currentDay', (data) => {
    if (data.currentDay !== undefined) {
      currentDay = data.currentDay;
      console.log(data.currentDay + "CURRENT DAY VALUE IN STORAGE");
      console.log(currentDay + "FROM STORAGE");
    }
});

chrome.storage.local.get('startTime', (data) => {
    if (data.startTime !== undefined) {
      startTime = data.startTime;
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
    console.log(currentDay + "BEFORE RESET");
    reset();
    //chrome.storage.local.set({ currentDay: currentDay });
    console.log(currentDay + "AFTER RESET");
    chrome.storage.local.set({ timerValue: timerValue });
    chrome.storage.local.set({ rotTime: rotTime });
    chrome.storage.local.set({ productiveTime: productiveTime });

    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
}

export function reset(){
    date = new Date();
    console.log(date);
    newDay = `${date.getMinutes()}-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    console.log("New Day" + newDay);
    console.log("Current Day being compared with New Day: " + currentDay);
    if (newDay != currentDay){
        currentDay = newDay;
        
        chrome.storage.local.set( { currentDay : newDay });
        rotTime = 0;
        productiveTime = 0;
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(currentDay);
    }
    console.log("rotTime: " + rotTime);
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