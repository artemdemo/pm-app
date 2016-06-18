'use strict';

const helper = require('./services/helper')(browser);
const authSuit = require('./suits/auth');

describe('Signup new user:', () => {
    it('should have signup form', () => {
        browser.get('/signup');
        browser.waitForAngular();

        const inputs = element.all(by.css('.form-control'));
        expect(inputs.count()).toEqual(3);
    });

    it('login to the app', () => {
        const usernameInput = element(by.css('[type=text]'));
        const emailInput = element(by.css('[type=email]'));
        const passwordInput = element(by.css('[type=password]'));
        const submitButton = element(by.css('[type=submit]'));
        const user = authSuit.getUserData();

        usernameInput.click();
        helper.sendText(usernameInput, user.username);

        emailInput.click();
        helper.sendText(emailInput, user.email);

        passwordInput.click();
        helper.sendText(passwordInput, user.password);

        submitButton.click();

        browser.wait(helper.urlIsEqual('http://localhost:8000/tasks'), 500);
    });

    it('check login for new user', () => {
        authSuit.login(() => {
            authSuit.logout();
        });
    });

});
