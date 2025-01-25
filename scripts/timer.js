export let timerValue = 0;
export let siteModifier = 0;
export let startTime = Date.now();

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

export function setStartTime(newStartTime) {
    startTime = newStartTime;
    chrome.storage.local.set({ startTime: newStartTime });
}

export function badSiteTimer(){
    timerValue += Math.floor((Date.now() - startTime) / 1000) * siteModifier;
    chrome.storage.local.set({ timerValue: timerValue });
    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
    siteModifier = -1;
    chrome.storage.local.set({ siteModifier: -1 });
}

export function goodSiteTimer(){
    timerValue += Math.floor((Date.now() - startTime) / 1000) * siteModifier;
    chrome.storage.local.set({ timerValue: timerValue });
    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
    siteModifier = 1;
    chrome.storage.local.set({ siteModifier: 1 });
}

export function neutralSiteTimer(){
    timerValue += Math.floor((Date.now() - startTime) / 1000) * siteModifier;
    chrome.storage.local.set({ timerValue: timerValue });
    startTime = Date.now();
    chrome.storage.local.set({ startTime: startTime });
    siteModifier = 0;
    chrome.storage.local.set({ siteModifier: 0 });
}