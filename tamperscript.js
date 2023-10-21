// ==UserScript==
// @name         YouTube Search Bar Forwarding Handler
// @version      1.0
// @description  Listens for middle-mouse - open new window - request in youtube's search bar, then opens search request as blank_
// @author       AquaJo
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to find the nearest parent element that is a button
    function findNearestButtonParent(element) { // i max 10
        var currentElement = element;
        let i = 0;
        while (currentElement && i < 10) {
            ++i;
            if (currentElement.tagName === 'BUTTON') {
                // The element is a button, return it
                return currentElement;
            }
            currentElement = currentElement.parentNode;
        }
        // If no button parent element is found, return null or perform other actions
        return null;
    }

    document.querySelector("body").addEventListener(
        "mousedown"
        , function (evt) {
            var target = evt.target;
            let btnTarget = findNearestButtonParent(target);
            if (btnTarget != null && evt.button === 1 && btnTarget.id === "search-icon-legacy") {
                evt.preventDefault();
                let searchText = document.querySelector('input#search').value;
                if (searchText !== "") {
                    const url = "https://www.youtube.com/results?search_query=" + searchText;
                    window.open(url, "_blank");
                }
            }
        }
    );


    function checkMiddleBtn(event) {
        event.preventDefault(); //
        if (event.button == 1) {
            try {
                let source = event.currentTarget.children[0];
                let keyElement;
                if (source.children[0].children.length > 0) {
                    keyElement = source.children[0].children[1];
                } else {
                    keyElement = source.children[1];
                }
                let searchText = combineTextWithChildren(keyElement);

                let urlSearchText = searchText.replace(/ /g, '+');
                const url = "https://www.youtube.com/results?search_query=" + urlSearchText;
                window.open(url, "_blank");
            } catch (e) {

            }
        }
    }

    function combineTextWithChildren(element) {
        let text = element.innerText.replace(/[\r\n]/g, '');
        return text;
    }


    function handleCheck(node) {
        if (node.classList.contains('gsfs')) {
            node.removeEventListener('auxclick', checkMiddleBtn);
            listenerElements = listenerElements.filter(item => item !== node);
            node.addEventListener('auxclick', checkMiddleBtn);
            listenerElements.push(node);
        }
    }

    const observerFirst = new MutationObserver(onMutationFIRST);
    observerFirst.observe(document, {
        childList: true,
        subtree: true,
    });

    let listenerElements = [];
    function onMutationFIRST(mutations) {
        for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
                if (!node.tagName) continue; // not an element
                if (node.classList.contains('sbsb_a')) {
                    const observerParent = new MutationObserver(onMutationPARENT);
                    observerParent.observe(node, {
                        childList: true,
                        subtree: true,
                    });
                    observerFirst.disconnect();

                    // fast search for new created gsfs elements
                    const elements = document.querySelectorAll('.gsfs');
                    const elementsArray = Array.from(elements);

                    elementsArray.forEach(element => {
                        if (element.classList.contains('gsfs')) {
                            handleCheck(element);
                        }
                    });
                }
            }
        }
    }
    function onMutationPARENT(mutations) {
        for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
                if (!node.tagName) continue; // not an element
                handleCheck(node);
            }
        }
    }


    /*document.addEventListener('keydown', function(event) {
        if (event.key === 'ö') {
            console.log(listenerElements);
        }
    });*/ // if listener check wanted
})();