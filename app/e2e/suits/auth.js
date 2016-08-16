/* eslint-disable strict*/
'use strict';

const userService = require('../services/user');

module.exports = {
    signup: (browser, userId) => {
        const user = userService.getUserData(userId);

        browser
            .url('http://localhost:8000/')
            .waitForElementVisible('body', 500)
            .click('a[data-qa=link-to-signup]')
            .pause(200)
            .setValue('input[name=username]', user.username)
            .setValue('input[type=email]', user.email)
            .setValue('input[type=password]', user.password)
            .click('button[type=submit]')
            .pause(200);

        browser.expect.element('nav').to.be.present.before(500);
    },

    /**
     * Login method
     * @param browser
     * @param options {Object}
     * @param options.endSession {Boolean} - `false` by default
     * @param options.userId {String}
     */
    login: (browser, options = {}) => {
        const user = userService.getUserData(options.userId);

        browser
            .url('http://localhost:8000/')
            .waitForElementVisible('body', 1000)
            .setValue('input[type=email]', user.email)
            .setValue('input[type=password]', user.password)
            .click('button[type=submit]')
            .pause(500);

        browser.expect.element('nav').to.be.present.before(500);

        if (options.endSession) {
            browser.end();
        }
    },

    logout: (browser) => {
        browser
            .click('span[data-qa=logout-main-menu-button]')
            .pause(200);

        browser.expect.element('a[data-qa=link-to-signup]').to.be.present.before(500);

        browser.end();
    },
};
