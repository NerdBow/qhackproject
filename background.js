import CONFIG from "./setting/config.js";

const productiveSites = ["docs.google.com", "stackoverflow.com", "khanacademy.org"];
const unproductiveSites = ["facebook.com", "youtube.com","reddit.com"];
import { badSiteTimer, goodSiteTimer, neutralSiteTimer } from "./scripts/timer.js";

const redirectUrl = "https://www.wikipedia.org";

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
            return data.candidates[0].content.parts[0].text
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
async function checkSite(url, tabId){
    const domain = new URL(url).hostname.replace("www.", "");
    let contentToShow = await generateContent(`Give me a one word response, telling me whether the following website is productive or unproductive: ${domain}`);
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
    else {
        console.log(contentToShow);
        neutralSiteTimer();
    }
    console.log(domain)
    console.log(contentToShow)
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
