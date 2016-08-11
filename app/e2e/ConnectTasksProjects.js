/* eslint-disable strict*/
'use strict';

const mainMenu = require('./services/mainMenu');
const auth = require('./suits/auth');

const tasks = {
    first: 'Task - 1 - Connect to projects',
    second: 'Task - 2 - Connect to projects',
};

const projects = {
    first: 'Project - 1',
    second: 'Project - 2',
};

const USER_ID = 'USER_CONNECT_TASKS_PROJECTS';

module.exports = {
    'Signup new user': (browser) => {
        auth.signup(browser, USER_ID);
        auth.logout(browser);
    },

    'Add tasks and projects': (browser) => {
        auth.login(browser, false);

        browser.click(mainMenu.getMainMenuPath('tasks'));
        browser
            .setValue('input[data-qa=new-task-input]', tasks.first)
            .pause(100)
            .setValue('input[data-qa=new-task-input]', tasks.second);

        browser.click(mainMenu.getMainMenuPath('projects'));
        browser
            .click('button[data-qa=new-project]')
            .setValue('.single-panel input[data-qa=project-name]', projects.first)
            .click('.single-panel button[data-qa=project-save]')
            .pause(200)
            .click('button[data-qa=new-project]')
            .setValue('.single-panel input[data-qa=project-name]', projects.second)
            .click('.single-panel button[data-qa=project-save]')
            .pause(200);
    },
};
