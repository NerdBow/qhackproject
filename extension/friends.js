import CONFIG from "./setting/config.js";
// Sample friends list


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://" + CONFIG.BACKEND_API + "/users", {method: "GET", headers: {"Content-Type": "application/json"}});

    const data = await response.json();

    // Reference to the friends list container
    const friendsListContainer = document.createElement("div");
    friendsListContainer.id = "friends-list-container";

    const friendsList = data;
    // Generate the list of friends dynamically
    friendsList.forEach(friend => {
      const friendElement = document.createElement("div");
      friendElement.className = "friend-item";
    
      const nameElement = document.createElement("span");
      nameElement.className = "friend-name";
      nameElement.textContent = friend[1];
    
      const statusElement = document.createElement("span");
      statusElement.className = "friend-status";
      statusElement.textContent = ` (${friend[2]})`;
    
      friendElement.appendChild(nameElement);
      friendElement.appendChild(statusElement);
      friendsListContainer.appendChild(friendElement);
    });
    
    // Add the friends list to the page
    document.getElementById("friends-list-page").appendChild(friendsListContainer);
  } catch (error) {
    console.error("Error fetching friends list:", error);
    return;
  }
});

  
  // Back button functionality
  document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "popup.html";
  });
  