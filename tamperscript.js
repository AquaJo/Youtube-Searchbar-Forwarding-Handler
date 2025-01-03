// ==UserScript==
// @name         YouTube Search Bar Forwarding Handler
// @version      1.0
// @description  Listens for middle-mouse - open new window - request in youtube's search bar, then opens search request as blank_
// @author       AquaJo
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Event listener for pointer down
  document.addEventListener("pointerdown", function (event) {
    // Check if the middle mouse button is clicked
    if (event.button === 1) {
      // Check if the clicked target matches the desired div class
      const target = event.target.closest(
        "div.ytSuggestionComponentSuggestion"
      );
      if (target) {
        event.preventDefault(); // Prevent default behavior
        // Get query param text and convert to URI format
        const topic = target
          .querySelector(".ytSuggestionComponentLeftContainer")
          .querySelector(".ytSuggestionComponentBold").parentElement.innerText;
        const topicURI = encodeURIComponent(topic);
        // Open the desired link in a new tab (convertion to + etc seemingly not needed)
        window.open(
          "https://www.youtube.com/results?search_query=" + topicURI,
          "_blank"
        );
      }
    }
  });
})();