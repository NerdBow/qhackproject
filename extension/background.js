import CONFIG from "./setting/config.js";
import { badSiteTimer, goodSiteTimer, neutralSiteTimer, checkRedirect, reset, updateTimer, setReset } from "./scripts/timer.js";

// chrome.storage.local.clear(function() {
//     if (chrome.runtime.lastError) {
//         console.error("Error clearing local storage: ", chrome.runtime.lastError);
//     } else {
//         console.log("Local storage cleared successfully.");
//     }
// });


const apiKey = CONFIG.API_KEY;

async function generateContent(query) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: query
                    }]
                }]
            }),
        });

        const data = await response.json();
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Error generating content:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching content from Gemini API:", error);
        return null;
    }
}

// Function for checking currrent site productivity
async function checkSite(url, tabId) {
    let productiveSites = [];
    let unproductiveSites = [];
    let contentToShow = ""

    chrome.storage.local.get(["productiveSites", "unproductiveSites"], async function(result) {
        productiveSites = result.productiveSites ? JSON.parse(result.productiveSites) : [];
        unproductiveSites = result.unproductiveSites ? JSON.parse(result.unproductiveSites) : [];

        if (productiveSites.includes(url)) {
            contentToShow = "Productive";
        }
        else if (unproductiveSites.includes(url)) {
            contentToShow = "Unproductive";
        }
        else if (url == "chrome://newtab/") {
            contentToShow = "Neutral";
        }
        else {
            console.log(`Used AI for ${url}`)
            const domain = new URL(url).hostname.replace("www.", "");
            contentToShow = await generateContent(`Give me a one word response, telling me whether the following website is productive or unproductive: ${domain}`);
            if (contentToShow.trim() == "Unproductive") {
                unproductiveSites.push(url);
            }
            else if (contentToShow.trim() == "Productive") {
                productiveSites.push(url);
            }
            console.log(productiveSites);
            console.log(unproductiveSites);
            chrome.storage.local.set({
                productiveSites: JSON.stringify(productiveSites),
                unproductiveSites: JSON.stringify(unproductiveSites)
            });
        }
        if (contentToShow.trim() == "Unproductive") {
            console.log("Bad: This site might hurt your productivity.");
            chrome.action.setBadgeText({ text: "Bad" });
            chrome.action.setBadgeBackgroundColor({ color: "red" });
            badSiteTimer();
        }
        else if (contentToShow.trim() == "Productive") {
            console.log("Good: This site helps your productivity!");
            chrome.action.setBadgeText({ text: "Good"});
            chrome.action.setBadgeBackgroundColor({ color: "green" });
            goodSiteTimer();
        }
        else if (contentToShow.trim() == "Neutral") {
            console.log("Neutral: This site does not affect your productivity");
            chrome.action.setBadgeText({ text: "Neutral" });
            chrome.action.setBadgeBackgroundColor({ color: "yellow" })
            neutralSiteTimer();
        }
        else {
            console.log(contentToShow);
        }
    });
}

// Listening for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) checkSite(tab.url, activeInfo.tabId);
});

// Listening for URL updates in active tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        checkSite(changeInfo.url, tabId);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkCurrentSite") {
        chrome.tabs.query({ active: true}, (tabs) => {
            const currentTab = tabs[0];
            const currentUrl = currentTab.url;
            
            // Send a response back to the popup with the current URL
            sendResponse({ url: currentUrl });
        });

        // Return true to indicate you want to send a response asynchronously
        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setBadge") {
        chrome.action.setBadgeText({ text: message.text });
        chrome.action.setBadgeBackgroundColor({ color: message.color });
    }
});

// Create alarm to go off every 30 seconds
chrome.alarms.create('checkTimer', {
    periodInMinutes: 0.5
});

chrome.alarms.create('dailyAlarm', {
    periodInMinutes: 1440
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkTimer') {
        checkRedirect();
        updateTimer();
        chrome.storage.local.get("email", (data) => {
            if  (!data.email) {
                return
            }
            const response = fetch("http://" + CONFIG.BACKEND_API + "/users", {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"username": "lenny", "rotTime": rotTime})}); //TODO: PLEAE DO IT
        });
    }
    if (alarm.name === 'dailyAlarm') {
        setReset();
    }
});