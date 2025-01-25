const productiveSites = ["docs.google.com", "stackoverflow.com", "khanacademy.org"];
const unproductiveSites = ["facebook.com", "youtube.com","reddit.com"];
//import { counter, setIt, getIncrement } from "./scripts/timer.js";
import { badSiteTimer, goodSiteTimer, neutralSiteTimer, timerValue, siteModifier, startTime, setStartTime } from "./scripts/timer.js";

//setIt(1);

// Function for checking currrent site productivity
function checkSite(url){
    const domain = new URL(url).hostname.replace("www.", "");
    if (unproductiveSites.includes(domain)) {
        console.log("Bad: This site might hurt your productivity.");
        chrome.action.setBadgeText({ text: "Bad" });
        chrome.action.setBadgeBackgroundColor({ color: "red" });
        badSiteTimer();

    } else if (productiveSites.includes(domain)) {
        console.log("Good: This site helps your productivity!");
        chrome.action.setBadgeText({ text: "Good"});
        chrome.action.setBadgeBackgroundColor({ color: "green" });
        goodSiteTimer();
    } else{
        console.log("Neutral: Site not in productivity list.");
        chrome.action.setBadgeText({ text: "" });
        neutralSiteTimer();
    }
}

// Listening for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) checkSite(tab.url);
});

// Listening for URL updates in active tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        checkSite(changeInfo.url);
    }
});