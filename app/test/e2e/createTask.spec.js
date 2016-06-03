const loginSuit = require('./suits/login');

loginSuit(() => {
    describe('Creating new task', () => {

        it('open "add task" form', () => {
            const openButton = element(by.css('[data-qa="add-new-task"]'));
            openButton.click();

            const singleTaskForm = element(by.tagName('single-task')).element(by.tagName('form'));
            browser.wait(singleTaskForm.isPresent(), 500);
        });

    });
});

