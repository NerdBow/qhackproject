import { getClipboardImage, generateGraph, createCanvas} from "./scripts/shareButton.js";


document.getElementById("dailyStats").width = 300;
document.getElementById("dailyStats").height = 300;
generateGraph(document.getElementById("dailyStats"), 10, 20);
document.getElementById("shareButton").addEventListener("click", () => {
    // chrome.storage.local.get("rotTime");
    // chrome.storage.local.get("productiveTime");
    getClipboardImage(10.2, 2);
});