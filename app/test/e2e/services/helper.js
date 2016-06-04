'use strict';

let browser = null;

const urlIsEqual = (url) => {
    return () => browser.getCurrentUrl().then((actualUrl) => url == actualUrl)
};

const sendText = (inputEl, text) => {
    const textLength = text.length;
    let i;
    for (i=0; i<textLength; i++) {
        inputEl.sendKeys(text[i]);
    }
};

module.exports = function(_browser) {
    browser = _browser;

    return {
        urlIsEqual,
        sendText
    }
};
