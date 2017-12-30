/* eslint-disable no-console */

// ToDo: Refactor error handling and debug errors (see modes/tasks.js)

const chalk = require('chalk');
const DB = require('sqlite-crud');
const _isNumber = require('lodash/isNumber');

const tableName = 'projects_tasks_relations';

/**
 * Add relation between project and task to the table
 *
 * @param projectId {Number || Array}
 * @param taskId {Number || Array}
 */
exports.addRelation = (projectId, taskId) => new Promise((resolve, reject) => {
    if (Array.isArray(projectId) && Array.isArray(taskId)) {
        console.log(chalk.red.bold('[addRelations error]'), 'projectId and taskId can\'t be both an Array');
        reject();
        return;
    } else if (!Array.isArray(taskId) && _isNumber(taskId)) {
        console.log(chalk.red.bold('[addRelations error]'), 'taskId should be a number or Array');
        reject();
        return;
    } else if (!Array.isArray(projectId) && _isNumber(projectId)) {
        console.log(chalk.red.bold('[addRelations error]'), 'projectId should be a number or Array');
        reject();
        return;
    }

    const addRelations = () => {
        if (!Array.isArray(projectId) && !Array.isArray(taskId)) {
            const data = {
                project_id: projectId,
                task_id: taskId,
            };
            DB.insertRow(tableName, data).then(() => {
                resolve();
            }).catch((error) => {
                console.log(chalk.red.bold('[addRelation error]'), error);
                reject();
            });
        } else if (!Array.isArray(projectId) && Array.isArray(taskId) && taskId.length > 0) {
            const values = '(' + taskId.join(`, ${projectId}),(`) + `, ${projectId})`;
            DB.run(`INSERT INTO ${tableName} (task_id, project_id) VALUES ${values};`).then(() => {
                resolve();
            }).catch((error) => {
                console.log(chalk.red.bold('[addRelations error]'), error);
                reject();
            });
        } else if (!Array.isArray(taskId) && Array.isArray(projectId) && projectId.length > 0) {
            const values = '(' + projectId.join(`, ${taskId}),(`) + `, ${taskId})`;
            DB.run(`INSERT INTO ${tableName} (project_id, task_id) VALUES ${values};`).then(() => {
                resolve();
            }).catch((error) => {
                console.log(chalk.red.bold('[addRelations error]'), error);
                reject();
            });
        } else if (!Array.isArray(projectId) && Array.isArray(taskId) && taskId.length === 0) {
            resolve();
        } else if (!Array.isArray(taskId) && Array.isArray(projectId) && projectId.length === 0) {
            resolve();
        } else {
            console.log(chalk.red.bold('[addRelations error]'), 'Error while adding relations');
            reject();
        }
    };

    let query;

    if (!Array.isArray(taskId)) {
        query = `DELETE FROM ${tableName} WHERE task_id=${taskId};`;
    } else {
        query = `DELETE FROM ${tableName} WHERE project_id=${projectId};`;
    }

    DB.run(query).then(() => {
        addRelations();
    }).catch((error) => {
        console.log(chalk.red.bold('[addRelations error]'), error);
        reject();
    });
});


/**
 * Delete relation
 *
 * @param projectId {Number}
 * @param taskId {Number}
 */
exports.deleteRelation = (projectId, taskId) => new Promise((resolve, reject) => {
    if (_isNumber(projectId) || Number(projectId) < 1) {
        reject();
        console.log(chalk.red.bold('[deleteRelation error]'), 'projectId should be a number, greater than 1');
        return;
    } else if (_isNumber(taskId) || Number(taskId) < 1) {
        reject();
        console.log(chalk.red.bold('[deleteRelation error]'), 'taskId should be a number, greater than 1');
        return;
    }

    DB.deleteRows(tableName, [
        {
            column: 'task_id',
            comparator: '=',
            value: taskId,
        },
        {
            column: 'project_id',
            comparator: '=',
            value: projectId,
        },
    ]).then(() => {
        resolve();
    }).catch((error) => {
        console.log(chalk.red.bold('[deleteRelation error]'), error);
        reject();
    });
});

/**
 * Get all relations by project id or task id
 *
 * @param type {String} - 'project' or 'task'
 * @param typeId {Number} - id of project or task
 */
exports.getRelations = (type, typeId) => new Promise((resolve, reject) => {
    const allowedTypes = ['project', 'task'];
    let query;

    if (!type) {
        reject();
        console.log(chalk.red.bold('[getRelations error]'), 'No type given');
        return;
    } else if (allowedTypes.indexOf(type) === -1) {
        reject();
        console.log(chalk.red.bold('[getRelations error]'), 'Given type is not allowed:', type);
        return;
    } else if (!typeId) {
        reject();
        console.log(chalk.red.bold('[getRelations error]'), 'No typeId given');
        return;
    }

    query = `SELECT * FROM ${tableName} `;

    switch (true) {
        case type === 'project':
            query += `WHERE project_id=${typeId};`;
            break;
        default:
            query += `WHERE task_id=${typeId};`;
            break;
    }

    DB.getAll(query)
        .then((rows) => {
            resolve(rows);
        }).catch(() => reject());
});
