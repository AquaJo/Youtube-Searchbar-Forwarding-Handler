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
                const newWindow = window.open(url, "_blank");
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