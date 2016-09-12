/* eslint-disable strict*/
'use strict';

const mainMenu = require('./services/mainMenu');
const tasksService = require('./services/tasks');
const projectsService = require('./services/projects');
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
        auth.login(browser, {
            userId: USER_ID,
        });

        browser.click(mainMenu.getMainMenuPath('tasks'));
        browser
            .setValue('input[data-qa=new-task-input]', [tasks.first, browser.Keys.ENTER])
            .pause(1200)
            .setValue('input[data-qa=new-task-input]', [tasks.second, browser.Keys.ENTER]);

        browser.click(mainMenu.getMainMenuPath('projects'));
        browser
            .click('button[data-qa=new-project]')
            .setValue('.single-panel input[data-qa=project-name__input]', projects.first)
            .click('.single-panel button[data-qa=project-save]')
            .pause(1200)
            .click('button[data-qa=new-project]')
            .setValue('.single-panel input[data-qa=project-name__input]', projects.second)
            .click('.single-panel button[data-qa=project-save]')
            .pause(200);
    },

    'Mark task as done': (browser) => {
        browser.click(mainMenu.getMainMenuPath('tasks'));
        browser
            .click(tasksService.getTaskPath(3))
            .click('.single-panel .ok-circle-container')
            .assert.cssClassPresent('.single-panel .ok-circle-container .ok-circle', 'ok-circle_done')
            .click('.single-panel button[data-qa=task-save]');
    },

    'Connect - tasks page': (browser) => {
        browser.click(mainMenu.getMainMenuPath('tasks'));
        browser
            .click(tasksService.getTaskPath(2))
            .assert.value('.single-panel input[data-qa=task-name__input]', tasks.second)
            .click('.single-panel .dropdown-list__input')
            .assert.cssClassPresent('.single-panel .dropdown-list-items', 'dropdown-list-items_show')
            .click('.single-panel .dropdown-list-items .dropdown-list-item:first-of-type')
            .assert.containsText('.single-panel .labels-list .labels-list-item:first-of-type', projects.second);

        browser
            .click('.single-panel .dropdown-list__input')
            .click('.single-panel .dropdown-list-items .dropdown-list-item:first-of-type');

        browser
            .click('.single-panel button[data-qa=task-save]')
            .assert.containsText(`${tasksService.getTaskPath(2)} .labels-list-item:first-of-type`, projects.second);
    },

    'Remove connection - tasks page': (browser) => {
        browser.click(mainMenu.getMainMenuPath('tasks'));
        browser
            .click(tasksService.getTaskPath(2))
            .assert.containsText('.single-panel div[data-qa=task-name__rendered]', tasks.second)
            .click('.single-panel .labels-list .labels-list-item:nth-child(2) .labels-list-item__close')
            .click('.single-panel button[data-qa=task-save]');
    },

    'Connect - projects page': (browser) => {
        const dropDownItemPath = '.single-panel .dropdown-list-items .dropdown-list-item';
        browser.click(mainMenu.getMainMenuPath('projects'));
        browser
            .click(projectsService.getProjectPath('first', 'active'))
            .assert.containsText('.single-panel div[data-qa=project-name__rendered]', projects.second)
            .click('.single-panel .dropdown-list__input')
            .assert.cssClassPresent(`${dropDownItemPath}:last-of-type`, 'dropdown-list-item_done')
            .click(`${dropDownItemPath}:first-of-type`)
            .assert.containsText(
                '.single-panel .narrow-list .narrow-list-item:first-of-type .narrow-list-item__name',
                tasks.second
            )
            .assert.containsText(
                '.single-panel .narrow-list .narrow-list-item:last-of-type .narrow-list-item__name',
                tasks.first
            )
            .assert.cssClassPresent(
                '.single-panel .narrow-list .narrow-list-item:last-of-type',
                'narrow-list-item_done'
            )
            .click('.single-panel button[data-qa=project-save]');
    },

    'Remove connection - projects page': (browser) => {
        browser.click(mainMenu.getMainMenuPath('projects'));

        browser
            .click(projectsService.getProjectPath('first', 'active'))
            .click('.single-panel .narrow-list .narrow-list-item:first-of-type .narrow-list-item__cell_close')
            .click('.single-panel .narrow-list .narrow-list-item:first-of-type .narrow-list-item__cell_close')
            .assert.elementPresent('.single-panel div[data-qa=no-tasks-label]')
            .click('.single-panel button[data-qa=project-save]');

        auth.logout(browser);
    },
};
