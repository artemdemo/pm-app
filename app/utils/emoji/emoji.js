import {emojisDictionary} from './emojisDictionary';

function isEmoji(token) {
    return emojisDictionary[token] !== undefined;
}

function unicodeForEmoji(token) {
    return emojisDictionary[token];
}

function replace(input) {
    const tokens = input.split(':');
    const parsed = [];
    let emojiBefore = true;

    for (let i = 0; i < tokens.length; ++i) {
        const emojiCurrent = isEmoji(tokens[i]);

        if (!emojiBefore && !emojiCurrent) {
            parsed.push(':');
        }

        if (emojiCurrent) {
            parsed.push(unicodeForEmoji(tokens[i]));
        } else {
            parsed.push(tokens[i]);
        }
        emojiBefore = emojiCurrent;
    }

    return parsed.join('');
}

/**
 * Convert emoji keywords in given string into unicodes
 * @param string {String}
 * @return {String}
 */
export default (string) => {
    return replace(string);
};
