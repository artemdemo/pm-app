'use strict';

const helper = require('../services/helper')(browser);
let user = null;


const getUserData = () => {
    if (!user) {
        const username = helper.getRandomWord(10);
        user = {
            username,
            email: username + '@' + helper.getRandomWord(5) + '.' + helper.getRandomWord(3),
            password: helper.getRandomWord(10)
        }
    }
    return user;
};

const login = (nextFn) => {
    describe('Common login:', () => {
        it('should have login form.', () => {
            browser.get('/tasks');
            browser.waitForAngular();

            const inputs = element.all(by.css('.form-control'));
            expect(inputs.count()).toEqual(2);
        });

        it('login to the app.', () => {
            const emailInput = element(by.css('[type=email]'));
            const passwordInput = element(by.css('[type=password]'));
            const submitButton = element(by.css('[type=submit]'));
            const user = getUserData();

            emailInput.click();
            helper.sendText(emailInput, user.email);

            passwordInput.click();
            helper.sendText(passwordInput, user.password);

            submitButton.click();

            browser.wait(helper.urlIsEqual('http://localhost:8000/tasks'), 500);
        });
    });

    if (nextFn) {
        nextFn();
    }
};

const logout = (nextFn) => {
    describe('Common logout:', () => {
        it('logout from the app.', () => {
            const logoutButton = element(by.css('[type=logout-main-menu-button]'));
            console.log(logoutButton);

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
    logout,
    getUserData
};
