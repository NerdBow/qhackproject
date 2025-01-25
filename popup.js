import { getClipboardImage } from "./scripts/shareButton.js";
document.getElementById("shareButton").addEventListener("click", () => {
    // chrome.storage.local.get("rotTime");
    // chrome.storage.local.get("productiveTime");
    getClipboardImage(10.2, 2);
});