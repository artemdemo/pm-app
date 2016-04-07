'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');

const DB = require('./__initDB__.js');
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

exports.addNew = (newTask) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    try {
        DB.insertToTable(tableName, {
            name: newTask.name,
            description: newTask.description,
            added: now.format('YYYY-MM-DD HH:mm:ss'),
            updated: now.format('YYYY-MM-DD HH:mm:ss')
        }).then((result) => {
            deferred.resolve({
                id: result.id,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss')
            });
        }, (error) => {
            console.log(chalk.red.bold('[addNew Task error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[addNew Task error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

exports.updateTask = (task) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    if (!task.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateTask error]'), 'No task.id in given task');
        return deferred.promise;
    }

    try {
        DB.updateInTable(tableName, {
            name: task.name,
            description: task.description,
            updated: now.format('YYYY-MM-DD HH:mm:ss')
        }, [{
            column: 'id',
            comparator: '=',
            value: task.id
        }]).then(() => {
            deferred.resolve();
        }, (error) => {
            console.log(chalk.red.bold('[updateTask error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[updateTask error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

exports.deleteTask = (taskId) => {
    const deferred = Q.defer();

    if (!taskId) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteTask error]'), 'No taskId in given task');
        return deferred.promise;
    }

    try {
        DB.deleteRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: taskId
        }]).then(() => {
            deferred.resolve();
        }, (error) => {
            console.log(chalk.red.bold('[deleteTask error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[deleteTask error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};
