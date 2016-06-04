'use strict';

const loginSuit = require('./suits/login');
const helper = require('./services/helper')(browser);

loginSuit(() => {
    describe('Creating new task', () => {

        it('open "add task" form', () => {
            const openButton = element(by.css('[data-qa="add-new-task"]'));
            openButton.click();

            const singleTaskForm = element(by.tagName('single-task')).element(by.tagName('form'));
            browser.wait(singleTaskForm.isPresent(), 500);
        });

        it('add new task', () => {
            const taskNameInput = element(by.css('[data-qa="task-name"]'));
            const taskDescriptionInput = element(by.css('[data-qa="task-description"]'));
            const taskSaveButton = element(by.css('[data-qa="task-save"]'));
            const now = +(new Date());
            const taskName = 'New test task | ' + now;

            taskNameInput.click();
            helper.sendText(taskNameInput, taskName);

            taskDescriptionInput.click();
            helper.sendText(taskDescriptionInput, 'Description for new task');

            taskSaveButton.click();

            const taskItemTextElements = element.all(by.css('.tasks-list-item__text'));
            const taskItemsTextPromise = new Promise((resolve, reject) => {
                const taskItemTextPromisesList = [];

                taskItemTextElements.count().then((textElementsLength) => {
                    for(let i=0; i<textElementsLength; i++) {
                        taskItemTextPromisesList.push(taskItemTextElements.get(i).getText());
                    }
                    Promise.all(taskItemTextPromisesList).then((itemsText) => {
                        for(let i = 0, len = itemsText.length; i < len; i++) {
                            if (itemsText[i] === taskName) {
                                resolve(taskName);
                                break;
                            }
                        }
                        reject();
                    });
                });
            });

            browser.wait(taskItemsTextPromise, 1000);
        });

    });
});

