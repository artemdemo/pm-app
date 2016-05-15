'use strict';

const chalk = require('chalk');
const moment = require('moment');
const sessions = require('./models/sessions');

/**
 * Token validation
 * @param decoded
 * @param request
 * @param callback
 * @returns void
 */
exports.validate = function (decoded, request, callback) {
    const now = moment(new Date());

    sessions.getSession({
        id: decoded.id
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
