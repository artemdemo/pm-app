'use strict';

let browser = null;

/**
 * Check if given URL is equel to the one browser is using right now
 * @example
 * browser.wait(helper.urlIsEqual('http://localhost:8000/tasks'), 500);
 * @param url
 * @returns {function(): *}
 */
const urlIsEqual = (url) => {
    return () => browser.getCurrentUrl().then((actualUrl) => url == actualUrl)
};

/**
 * Send text character by character to the given input
 * Otherwise it may miss some of them
 * @param inputEl
 * @param text
 */
const sendText = (inputEl, text) => {
    const textLength = text.length;
    let i;
    for (i=0; i<textLength; i++) {
        inputEl.sendKeys(text[i]);
    }
};

/**
 * Generate random word
 * @param length {Number}
 * @returns {string}
 */
const getRandomWord = (length) => {
    let consonants = 'bcdfghjklmnpqrstvwxyz';
    let vowels = 'aeiou';
    const rand = function(limit) {
            return Math.floor(Math.random()*limit);
        };
    let word='';
    length = parseInt(length, 10);
    consonants = consonants.split('');
    vowels = vowels.split('');
    for (let i = 0; i < length / 2; i++) {
        let randConsonant = consonants[rand(consonants.length)];
        let randVowel = vowels[rand(vowels.length)];
        word += randConsonant;
        word += i * 2 < length - 1 ? randVowel : '';
    }
    return word;
};

module.exports = function(_browser) {
    browser = _browser;

    return {
        urlIsEqual,
        sendText,
        getRandomWord
    }
};
