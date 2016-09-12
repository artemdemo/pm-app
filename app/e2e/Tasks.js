/* eslint-disable strict*/
'use strict';

const tasksService = require('./services/tasks');
const mainMenu = require('./services/mainMenu');
const auth = require('./suits/auth');

let taskIndex = 1;

module.exports = {
    'Add tasks': (browser) => {
        auth.login(browser);

        // Click on "Tasks" in Main Menu
        browser.click(mainMenu.getMainMenuPath('tasks'));

        for (; taskIndex < 4; taskIndex++) {
            browser
                .setValue('input[data-qa=new-task-input]', [tasksService.getTaskName(taskIndex), browser.Keys.ENTER])
                .pause(100)
                .assert.containsText(tasksService.getTaskNamePath('first'), tasksService.getTaskName(taskIndex));
        }
    },

    'Mark task done': (browser) => {
        browser
            .click(tasksService.getTaskPath(3))
            .click('.single-panel .ok-circle-container')
            .assert.cssClassPresent('.single-panel .ok-circle-container .ok-circle', 'ok-circle_done')
            .click('.single-panel button[data-qa=task-save]');

        browser
            .assert.cssClassPresent(tasksService.getTaskNamePath('last'), 'tasks-list-item__text_done')
            .assert.containsText(tasksService.getTaskNamePath('last'), tasksService.getTaskName(2));
    },

    'Delete task': (browser) => {
        tasksService.deleteTask(browser, 'last');

        browser
            .assert.cssClassNotPresent(tasksService.getTaskNamePath('last'), 'tasks-list-item__text_done')
            .assert.containsText(tasksService.getTaskNamePath('last'), tasksService.getTaskName(1));

        auth.logout(browser);
    },

    /*
     * This test is not working properly
     * I can't make it updated value - it only enter first letter of the value and change `input` view
     *
    'Update task name and description': (browser) => {
        const newTaskName = 'Task - new name';
        const description = 'Test description';

        // Open first added task (it should be last one in the list)
        browser
            .click(tasksService.getTaskPath(2))
            .assert.containsText('div[data-qa=task-name__rendered]', tasksService.getTaskName(3));

        // Setting new task data
        browser
            .moveToElement('.single-panel div[data-qa=task-name__rendered]', 0, 0)
            .click('.single-panel div[data-qa=task-name__edit-content]')
            .clearValue('.single-panel input[data-qa=task-name__input]')

            // set value is not working properly
            .setValue('.single-panel input[data-qa=task-name__input]', newTaskName)

            .moveToElement('.single-panel div[data-qa=task-description__rendered]', 0, 0)
            .click('.single-panel div[data-qa=task-description__edit-content]')

            // set value is not working properly
            .setValue('.single-panel textarea[data-qa=task-description__textarea]', description)
            .pause(700)
            .click('.single-panel button[data-qa=task-save]');

        // After updating task it should appear in the beginning of the list
        browser
            .assert.containsText(tasksService.getTaskNamePath('first'), newTaskName);

        browser
            .click(tasksService.getTaskPath('first'))
            .assert.containsText('.single-panel div[data-qa=task-name__rendered]', newTaskName)
            .assert.containsText('.single-panel div[data-qa=task-description_rendered]', description);
    },
    */
};
