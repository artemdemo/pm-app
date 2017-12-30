const atob = require('atob');
const moment = require('moment');
const sessions = require('./models/sessions');

/**
 * Token validation
 * @param decoded
 * @param request
 * @param callback
 * @returns void
 */
exports.validate = (decoded, request, callback) => {
    const now = moment(new Date());

    sessions.getSession({
        id: decoded.id,
    }).then(() => {
        if (now.format('YYYY-MM-DD HH:mm:ss') < decoded.expiration) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }, () => {
        callback(null, false);
    });
};

/**
 * Will return parsed token data
 * @param token
 * @returns {object|boolean}
 * @example
 * {
 *   id: string;
 *   expiration: string;
 * }
 */
exports.parseTokenData = (token) => {
    const tokenSections = token ? token.split('.') : null;
    let tokenData;
    if (tokenSections) {
        try {
            tokenData = JSON.parse(atob(tokenSections[1]));
        } catch (e) {
            return false;
        }
        return tokenData;
    }
    return false;
};
