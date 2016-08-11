/* eslint-disable strict*/
'use strict';

const userService = require('../services/user');

module.exports = {
    login: (browser, endSession = true) => {
        const user = userService.getUserData();

        browser
            .url('http://localhost:8000/')
            .waitForElementVisible('body', 1000)
            .setValue('input[type=email]', user.email)
            .setValue('input[type=password]', user.password)
            .click('button[type=submit]')
            .pause(500);

        browser.expect.element('nav').to.be.present.before(500);

        if (endSession) {
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