/* eslint-disable strict */

'use strict';

const auth = require('./suits/auth');

module.exports = {
    Signup: (browser) => {
        auth.signup(browser);
        auth.logout(browser);
    },
};
