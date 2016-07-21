/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const Q = require('q');

const DB = require('sqlite-crud');
const tableName = 'projects_tasks_relations';

/**
 * Add relation between project and task to the table
 *
 * @param projectId {Number}
 * @param taskId {Number}
 */
exports.addRelation = (projectId, taskId) => {
    const deferred = Q.defer();
    let query = '';

    if (Array.isArray(projectId)) {
        const projectsIds = projectId.map((id) => `project_id=${id}`).join(' OR ');
        if (projectId.length > 0) {
            query = `SELECT * FROM ${tableName} WHERE (${projectsIds}) AND task_id=${taskId}`;
        } else {
            query = `SELECT * FROM ${tableName} WHERE task_id=${taskId}`;
        }
    } else if (!Array.isArray(projectId) && Number(projectId) === Number(projectId)) {
        query = `SELECT * FROM ${tableName} WHERE project_id=${projectId} AND task_id=${taskId}`;
    } else {
        console.log(chalk.red.bold('[addRelations error]'), 'projectId should be a number or Array');
        deferred.reject();
        return deferred.promise;
    }

    const addRelations = () => {
        if (!Array.isArray(projectId)) {
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
        } else if (Array.isArray(projectId) && projectId.length > 0) {
            const values = '(' + projectId.join(`, ${taskId}),(`) + `, ${taskId})`;
            DB.run(`INSERT INTO ${tableName} (project_id, task_id) VALUES ${values};`).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[addRelations error]'), error);
                deferred.reject();
            });
        } else if (Array.isArray(projectId) && projectId.length === 0) {
            deferred.resolve();
        } else {
            console.log(chalk.red.bold('[addRelations error]'), 'Error while adding relations');
            deferred.reject();
        }
    };

    DB.queryRows(query)
        .then((rows) => {
            console.log('rows', rows);
            if (rows.length === 0) {
                addRelations();
            } else {
                DB.run(`DELETE FROM ${tableName} WHERE task_id=${taskId};`).then(() => {
                    addRelations();
                }, (error) => {
                    console.log(chalk.red.bold('[addRelations error]'), error);
                    deferred.reject();
                });
            }
        }, () => {
            deferred.reject();
            console.log(chalk.red.bold('[addRelation error]'), 'Error while fetching relations');
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
