module.exports = (nextFn) => {
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
            emailInput.sendKeys('admin');
            emailInput.sendKeys('@');
            emailInput.sendKeys('adm');
            emailInput.sendKeys('in');
            emailInput.sendKeys('.');
            emailInput.sendKeys('com');

            passwordInput.click();
            passwordInput.sendKeys('123');

            submitButton.click();

            browser.wait(urlIsEqual('http://localhost:8000/tasks'), 500);
        });
    });

    nextFn();
};
