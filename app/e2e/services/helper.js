/* eslint-disable strict*/
'use strict';

/**
 * Generate random word
 * @param wLength {Number}
 * @returns {string}
 */
const getRandomWord = (wLength) => {
    let consonants = 'bcdfghjklmnpqrstvwxyz';
    let vowels = 'aeiou';
    const rand = function(limit) {
        return Math.floor(Math.random() * limit);
    };
    let word = '';
    const length = parseInt(wLength, 10);
    consonants = consonants.split('');
    vowels = vowels.split('');
    for (let i = 0; i < length / 2; i++) {
        const randConsonant = consonants[rand(consonants.length)];
        const randVowel = vowels[rand(vowels.length)];
        word += randConsonant;
        word += i * 2 < length - 1 ? randVowel : '';
    }
    return word;
};

module.exports = {
    getRandomWord,
};
