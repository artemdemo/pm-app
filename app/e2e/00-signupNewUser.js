/* eslint-disable strict*/
'use strict';

const userService = require('./services/user');
const auth = require('./suits/auth');

module.exports = {
    Signup: (browser) => {
        const user = userService.getUserData();

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

        auth.logout(browser);
    },
};
