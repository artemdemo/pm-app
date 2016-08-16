/* eslint-disable strict*/
'use strict';

const helper = require('./helper');

/**
 * Function generate and return tasks names
 * @param taskId {String}
 * @returns {String}
 */
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

/**
 * Return css path to the task DOM element
 * @param id {Number|String}
 * @returns {String}
 */
const getTaskPath = (id) => {
    switch (true) {
        case id === 'first':
            return '.tasks-list .tasks-list-item:nth-child(2)';
        case id === 'last':
            return '.tasks-list .tasks-list-item:last-of-type';
    }
    return `.tasks-list .tasks-list-item:nth-child(${id})`;
};

/**
 * Return css path to the DOM element that contain task name
 * @param id {Number|String}
 * @returns {String}
 */
const getTaskNamePath = (id) => {
    return `${getTaskPath(id)} .tasks-list-item__text`;
};

/**
 * Delete task by given id
 * @param browser
 * @param id {Number|String}
 */
const deleteTask = (browser, id) => {
    browser
        .click(getTaskPath(id))
        .click('.single-panel span[data-qa=delete-button]')
        .click('.single-panel .delete-button .delete-button-buttons__ok');
};

module.exports = {
    getTaskName,
    getTaskPath,
    getTaskNamePath,
    deleteTask,
};
