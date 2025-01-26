window.onload = function () {
  const signInButton = document.getElementById("google_sign_in");

  // Check chrome.storage.local for an existing token
  chrome.storage.local.get(["authToken"], function (result) {
    const existingToken = result.authToken;

    if (existingToken) {
      // If a token is found, fetch user info and show the "Signed in as..." message
      displayUserInfo(existingToken);
    } else {
      // If no token is found, add event listener for sign-in
      signInButton.addEventListener("click", function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          if (chrome.runtime.lastError || !token) {
            console.error("Failed to get auth token:", chrome.runtime.lastError);
            return;
          }

          console.log("Token:", token);

          // Save the token to chrome.storage.local
          chrome.storage.local.set({ authToken: token }, function () {
            console.log("Token saved to chrome.storage.local");
          });

          // Fetch user info and show the "Signed in as..." message
          displayUserInfo(token);
        });
      });
    }
  });

  // Function to fetch user info and display the "Signed in as..." message
  function displayUserInfo(token) {
    const infoURL = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
    fetch(infoURL)
      .then((response) => response.json())
      .then((userInfo) => {
        console.log("User Info:", userInfo);

        // Save the email to chrome.storage.local
        const index = userInfo.email.indexOf("@");
        const email = userInfo.email.slice(0, index);
        chrome.storage.local.set({ email: email }, function () {
          console.log("Email saved to chrome.storage.local");
        });

        // Replace the button with a "Signed in as..." message
        const parent = signInButton.parentNode;
        const signedInMessage = document.createElement("p");
        signedInMessage.id = "signedInMessage";
        signedInMessage.textContent = `Signed in as: ${userInfo.email}`;
        signedInMessage.style.color = "#a6da95"; // Optional: style the text
        parent.replaceChild(signedInMessage, signInButton);
      })
      .catch((error) => {
        console.error("Failed to fetch user info", error);
      });
  }
};