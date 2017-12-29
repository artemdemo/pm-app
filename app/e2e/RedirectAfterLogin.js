/* eslint-disable strict */

'use strict';

const userService = require('./services/user');
const auth = require('./suits/auth');

module.exports = {
    'Redirect after login': (browser) => {
        const user = userService.getUserData();

        browser
            .url('http://localhost:8000/tasks')
            .waitForElementVisible('body', 500)
            .setValue('input[type=email]', user.email)
            .setValue('input[type=password]', user.password)
            .click('button[type=submit]')
            .pause(200);

        browser.expect.element('nav').to.be.present.before(500);
        browser.assert.urlEquals('http://localhost:8000/tasks');

        auth.logout(browser);
    },
};
