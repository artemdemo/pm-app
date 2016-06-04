'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');

const DB = require('sqlite-crud')('./pm-database/pm.db');
const tableName = 'tasks';

const parseTasks = (tasks) => tasks.map(task => {
    task.done = !!task.done;
    return task;
});

exports.getAll = () => {
    const deferred = Q.defer();
    let tasksQuery = `SELECT * FROM ${tableName};`;

    DB.queryRows(tasksQuery)
        .then((rows) => {
            let promisesList = [];
            let tasks = parseTasks(rows);
            tasks.forEach(task => {
                let projectsQuery = `SELECT projects_tasks_relations.task_id, projects_tasks_relations.project_id FROM tasks 
                                     INNER JOIN projects_tasks_relations ON tasks.id = projects_tasks_relations.task_id 
                                     WHERE tasks.id = ${task.id};`;
                promisesList.push(DB.queryRows(projectsQuery));
            });
            Q.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        tasks[index]['projects'] = data.map(item => item.project_id)
                    });
                    deferred.resolve(tasks);
                }, () => {
                    deferred.reject();
                });
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};

exports.addNew = (newTask) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    try {
        DB.insertRow(tableName, {
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
    let updateData = {};
    let updateAllowed = true;

    if (!task.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateTask error]'), 'No task.id in given task');
        return deferred.promise;
    }

    const allowedFields = ['name', 'description', 'done'];
    allowedFields.forEach((field) => {
        if (task.hasOwnProperty(field)) {
            updateData[field] = task[field];
        }
    });

    if (!updateAllowed) {
        deferred.reject();
        console.log(chalk.red.bold('[updateTask error]'), 'No fields to update:', task);
        return deferred.promise;
    }

    updateData['updated'] = now.format('YYYY-MM-DD HH:mm:ss');

    try {
        DB.updateRow(tableName, updateData, [{
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
