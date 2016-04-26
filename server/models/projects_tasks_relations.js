'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');

const DB = require('sqlite-crud')('./server/pm.db');
const tableName = 'projects_tasks_relations';

exports.getRelations = (type, typeId) => {
    const deferred = Q.defer();
    const db = DB.getDB();
    const allowedTypes = ['project', 'task'];
    let query = '';
    
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
