'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');

const DB = require('sqlite-crud')('./pm-database/pm.db');
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
    
    if (Number(projectId) != Number(projectId) || Number(projectId) < 1) {
        deferred.reject();
        console.log(chalk.red.bold('[addRelation error]'), 'projectId should be a number, greater than 1');
        return deferred.promise;
    } else if (Number(taskId) != Number(taskId) || Number(taskId) < 1) {
        deferred.reject();
        console.log(chalk.red.bold('[addRelation error]'), 'taskId should be a number, greater than 1');
        return deferred.promise;
    }
    
    query = `SELECT * FROM ${tableName} WHERE project_id=${projectId} AND task_id=${taskId}`;
    
    DB.getAll(query)
        .then((rows) => {
            const data = {
                project_id: projectId,
                task_id: taskId
            };
            if (rows.length == 0) {
                DB.insertToTable(tableName, data).then(() => {
                    deferred.resolve();
                }, (error) => {
                    console.log(chalk.red.bold('[addRelation error]'), error);
                    deferred.reject();
                });
            } else {
                console.log(chalk.yellow.bold('[addRelation warning]'), 'Relation already exists:', data);
                deferred.reject();
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
    let query = '';
    
    if (Number(projectId) != Number(projectId) || Number(projectId) < 1) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteRelation error]'), 'projectId should be a number, greater than 1');
        return deferred.promise;
    } else if (Number(taskId) != Number(taskId) || Number(taskId) < 1) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteRelation error]'), 'taskId should be a number, greater than 1');
        return deferred.promise;
    }
    
    DB.deleteRows(tableName, [
        {
            column: 'task_id',
            comparator: '=',
            value: taskId
        },
        {
            column: 'project_id',
            comparator: '=',
            value: projectId
        }
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
    } else if (allowedTypes.indexOf(type) == -1) {
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
        case type == 'project':
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
