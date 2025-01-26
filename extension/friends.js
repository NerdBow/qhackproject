// Sample friends list
const friendsList = [
    { user: "john_doe", status: "Rotting" },
    { user: "jane_smith", status: "Productive" },
    { user: "max_power", status: "Rotting" },
    { user: "linda_bright", status: "Productive" },
  ];
  
  // Reference to the friends list container
  const friendsListContainer = document.createElement("div");
  friendsListContainer.id = "friends-list-container";
  
  // Generate the list of friends dynamically
  friendsList.forEach(friend => {
    const friendElement = document.createElement("div");
    friendElement.className = "friend-item";
  
    const nameElement = document.createElement("span");
    nameElement.className = "friend-name";
    nameElement.textContent = friend.user;
  
    const statusElement = document.createElement("span");
    statusElement.className = "friend-status";
    statusElement.textContent = ` (${friend.status})`;
  
    friendElement.appendChild(nameElement);
    friendElement.appendChild(statusElement);
    friendsListContainer.appendChild(friendElement);
  });
  
  // Add the friends list to the page
  document.getElementById("friends-list-page").appendChild(friendsListContainer);
  
  // Back button functionality
  document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "popup.html";
  });
  