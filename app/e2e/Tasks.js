/* eslint-disable strict*/
'use strict';

const helper = require('./services/helper');
const mainMenu = require('./services/mainMenu');
const auth = require('./suits/auth');

const getTaskName = (() => {
    const tasks = {};
    return (taskId) => {
        if (!tasks[taskId]) {
            tasks[taskId] =
                `New Task - ${helper.getRandomWord(10)} ${helper.getRandomWord(5)} ${helper.getRandomWord(7)}`;
        }
        return tasks[taskId];
    };
})();

const getTaskPath = (id) => {
    switch (true) {
        case id === 'first':
            return '.tasks-list .tasks-list-item:nth-child(2)';
        case id === 'last':
            return '.tasks-list .tasks-list-item:last-of-type';
    }
    return `.tasks-list .tasks-list-item:nth-child(${id})`;
};

const getTaskNamePath = (id) => {
    return `${getTaskPath(id)} .tasks-list-item__text`;
};

let taskIndex = 1;

module.exports = {
    'Add tasks': (browser) => {
        auth.login(browser, false);

        // Click on "Tasks" in Main Menu
        browser.click(mainMenu.getMainMenuPath('tasks'));

        for (; taskIndex < 4; taskIndex++) {
            browser
                .setValue('input[data-qa=new-task-input]', [getTaskName(taskIndex), browser.Keys.ENTER])
                .pause(100)
                .assert.containsText(getTaskNamePath('first'), getTaskName(taskIndex));
        }
    },

    'Update task name and description': (browser) => {
        const newTaskName = 'Task - new name';
        const description = 'Test description';

        // Open first added task (it should be last one in the list)
        browser
            .click(getTaskPath(taskIndex))
            .assert.value('input[data-qa=task-name]', getTaskName(1));

        // Setting new task data
        browser
            .clearValue('.single-panel input[data-qa=task-name]')
            .setValue('.single-panel input[data-qa=task-name]', newTaskName)
            .setValue('.single-panel textarea[data-qa=task-description]', description)
            .pause(700)
            .click('.single-panel button[data-qa=task-save]');

        // After updating task it should appear in the beginning of the list
        browser
            .assert.containsText(getTaskNamePath('first'), newTaskName);

        browser
            .click(getTaskPath('first'))
            .assert.value('.single-panel input[data-qa=task-name]', newTaskName)
            .assert.value('.single-panel textarea[data-qa=task-description]', description);
    },

    'Mark task done': (browser) => {
        browser
            .click(getTaskPath(3))
            .click('.single-panel .ok-circle-container')
            .assert.cssClassPresent('.single-panel .ok-circle-container .ok-circle', 'ok-circle_done')
            .click('.single-panel button[data-qa=task-save]');

        browser
            .assert.cssClassPresent(getTaskNamePath('last'), 'tasks-list-item__text_done')
            .assert.containsText(getTaskNamePath('last'), getTaskName(3));
    },

    'Delete task': (browser) => {
        browser
            .click(getTaskPath('last'))
            .click('.single-panel span[data-qa=delete-button]')
            .click('.single-panel .delete-button .delete-button-buttons__ok');

        browser
            .assert.cssClassNotPresent(getTaskNamePath('last'), 'tasks-list-item__text_done')
            .assert.containsText(getTaskNamePath('last'), getTaskName(2));

        auth.logout(browser);
    },
};
