/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const Q = require('q');

const DB = require('sqlite-crud');
const tableName = 'projects_tasks_relations';

/**
 * Add relation between project and task to the table
 *
 * @param projectId {Number || Array}
 * @param taskId {Number || Array}
 */
exports.addRelation = (projectId, taskId) => {
    const deferred = Q.defer();

    if (Array.isArray(projectId) && Array.isArray(taskId)) {
        console.log(chalk.red.bold('[addRelations error]'), 'projectId and taskId can\'t be both an Array');
        deferred.reject();
        return deferred.promise;
    } else if (!Array.isArray(taskId) && Number(taskId) !== Number(taskId)) {
        console.log(chalk.red.bold('[addRelations error]'), 'taskId should be a number or Array');
        deferred.reject();
        return deferred.promise;
    } else if (!Array.isArray(projectId) && Number(projectId) !== Number(projectId)) {
        console.log(chalk.red.bold('[addRelations error]'), 'projectId should be a number or Array');
        deferred.reject();
        return deferred.promise;
    }

    const addRelations = () => {
        if (!Array.isArray(projectId) && !Array.isArray(taskId)) {
            const data = {
                project_id: projectId,
                task_id: taskId,
            };
            DB.insertRow(tableName, data).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[addRelation error]'), error);
                deferred.reject();
            });
        } else if (!Array.isArray(projectId) && Array.isArray(taskId) && taskId.length > 0) {
            const values = '(' + taskId.join(`, ${projectId}),(`) + `, ${projectId})`;
            DB.run(`INSERT INTO ${tableName} (task_id, project_id) VALUES ${values};`).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[addRelations error]'), error);
                deferred.reject();
            });
        } else if (!Array.isArray(taskId) && Array.isArray(projectId) && projectId.length > 0) {
            const values = '(' + projectId.join(`, ${taskId}),(`) + `, ${taskId})`;
            DB.run(`INSERT INTO ${tableName} (project_id, task_id) VALUES ${values};`).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[addRelations error]'), error);
                deferred.reject();
            });
        } else if (!Array.isArray(projectId) && Array.isArray(taskId) && taskId.length === 0) {
            deferred.resolve();
        } else if (!Array.isArray(taskId) && Array.isArray(projectId) && projectId.length === 0) {
            deferred.resolve();
        } else {
            console.log(chalk.red.bold('[addRelations error]'), 'Error while adding relations');
            deferred.reject();
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
    }, (error) => {
        console.log(chalk.red.bold('[addRelations error]'), error);
        deferred.reject();
    });

    return deferred.promise;
};

/**
 * Delete relation
 *
 * @param projectId {Number}
 * @param taskId {Number}
 */
exports.deleteRelation = (projectId, taskId) => {
    const deferred = Q.defer();

    if (Number(projectId) !== Number(projectId) || Number(projectId) < 1) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteRelation error]'), 'projectId should be a number, greater than 1');
        return deferred.promise;
    } else if (Number(taskId) !== Number(taskId) || Number(taskId) < 1) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteRelation error]'), 'taskId should be a number, greater than 1');
        return deferred.promise;
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
        deferred.resolve();
    }, (error) => {
        console.log(chalk.red.bold('[deleteRelation error]'), error);
        deferred.reject();
    });

    return deferred.promise;
};

/**
 * Get all relations by project id or task id
 *
 * @param type {String} - 'project' or 'task'
 * @param typeId {Number} - id of project or task
 */
exports.getRelations = (type, typeId) => {
    const deferred = Q.defer();
    const allowedTypes = ['project', 'task'];
    let query;

    if (!type) {
        deferred.reject();
        console.log(chalk.red.bold('[getRelations error]'), 'No type given');
        return deferred.promise;
    } else if (allowedTypes.indexOf(type) === -1) {
        deferred.reject();
        console.log(chalk.red.bold('[getRelations error]'), 'Given type is not allowed:', type);
        return deferred.promise;
    } else if (!typeId) {
        deferred.reject();
        console.log(chalk.red.bold('[getRelations error]'), 'No typeId given');
        return deferred.promise;
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
            deferred.resolve(rows);
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};
