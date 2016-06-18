'use strict';

const helper = require('../services/helper')(browser);

const login = (nextFn) => {
    describe('common login', () => {
        var urlIsEqual = (url) => {
            return () => browser.getCurrentUrl().then((actualUrl) => url == actualUrl)
        };

        it('should have login form', () => {
            browser.get('/tasks');
            browser.waitForAngular();

            const inputs = element.all(by.css('.form-control'));
            expect(inputs.count()).toEqual(2);
        });

        it('login to the app', () => {
            const emailInput = element(by.css('[type=email]'));
            const passwordInput = element(by.css('[type=password]'));
            const submitButton = element(by.css('[type=submit]'));

            emailInput.click();
            helper.sendText(emailInput, 'admin@admin.com');

            passwordInput.click();
            helper.sendText(passwordInput, '123');

            submitButton.click();

            browser.wait(helper.urlIsEqual('http://localhost:8000/tasks'), 500);
        });
    });

    nextFn();
};

const logout = (nextFn) => {
    describe('common logout', () => {
        it('logout from the app', () => {
            const logoutButton = element(by.css('[type=logout-main-menu-button]'));

            logoutButton.click();
            browser.wait(helper.urlIsEqual('http://localhost:8000/login'), 500);
        });
    });

    if (nextFn) {
        nextFn();
    }
};

module.exports = {
    login,
    logout
};
