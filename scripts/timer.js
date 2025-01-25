export let timerValue = 0;
export let siteModifier = 0;
export let productiveTime = 0;
export let rotTime = 0;
export let startTime = Date.now();

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

chrome.storage.local.get('startTime', (data) => {
    if (data.startTime !== undefined) {
      startTime = data.startTime;
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

    timerValue += Math.floor((Date.now() - startTime) / 1000) * siteModifier;
    if (siteModifier === -1){
        rotTime += Math.floor((Date.now() - startTime) / 1000);
        chrome.storage.local.set({ rotTime: rotTime });
    } else if (siteModifier === 1){
        productiveTime += Math.floor((Date.now() - startTime) / 1000);
        chrome.storage.local.set({ productiveTime: productiveTime });
    }

    chrome.storage.local.set({ timerValue: timerValue });
    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
}
