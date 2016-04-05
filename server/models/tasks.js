'use strict';

let chalk = require('chalk');
let moment = require('moment');
let Q = require('q');

let DB = require('./__initDB__.js');

const tableName = 'tasks';

const parseTasks = (tasks) => tasks.map(task => {
    task.done = !!task.done;
    return task;
});

exports.getAll = () => {
    const deferred = Q.defer();
    const db = DB.getDB();
    let query = '';

    query = `SELECT * FROM ${tableName};`;

    if (query) {
        db.all(query, (err, rows) => {
            if (err) {
                console.log(chalk.red.bold('[getAll tasks error]'), err);
                deferred.reject();
            } else {
                deferred.resolve(parseTasks(rows));
            }
        });
    } else {
        console.log(chalk.red.bold('[getAll tasks error]'), 'There is no query');
        deferred.reject();
    }

    return deferred.promise;
};
