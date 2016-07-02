'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const sessions = require('./sessions');
const DB = require('sqlite-crud');
const tableName = 'tasks';

const parseTasks = (tasks) => tasks.map(task => {
    task.done = !!task.done;
    return task;
});

exports.getAll = (tasksData) => {
    const deferred = Q.defer();
    let tasksQuery = `SELECT tasks.id, tasks.name, tasks.description, tasks.done, tasks.added, tasks.updated, tasks.board_id FROM tasks
                      INNER JOIN sessions ON sessions.user_id = tasks.user_id
                      WHERE sessions.id = '${tasksData.tokenId}';`;

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

exports.addNew = (newTaskData) => {
    const deferred = Q.defer();
    const now = moment(new Date());
    const boardId = newTaskData.board || null;

    sessions.getSession({
        id: newTaskData.tokenId
    }).then((session) => {
        try {
            DB.insertRow(tableName, {
                name: newTaskData.payload.name,
                description: newTaskData.payload.description,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                board_id: newTaskData.board_id || null,
                user_id: session.user_id
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
    }, () => deferred.reject());

    return deferred.promise;
};

exports.updateTask = (taskData) => {
    const deferred = Q.defer();
    const now = moment(new Date());
    let updateData = {};
    let updateAllowed = true;

    if (!taskData.payload.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateTask error]'), 'No taskData.payload.id in given task');
        return deferred.promise;
    }

    const allowedFields = ['name', 'description', 'done', 'board_id'];
    allowedFields.forEach((field) => {
        if (taskData.payload.hasOwnProperty(field)) {
            let data;
            if (field == 'board_id') {
                data = taskData.payload[field] || null;
            } else {
                data = taskData.payload[field];
            }
            updateData[field] = data;
        }
    });

    if (!updateAllowed) {
        deferred.reject();
        console.log(chalk.red.bold('[updateTask error]'), 'No fields to update:', taskData.payload);
        return deferred.promise;
    }

    updateData['updated'] = now.format('YYYY-MM-DD HH:mm:ss');

    console.log(updateData);

    sessions.getSession({
        id: taskData.tokenId
    }).then((session) => {
        try {
            DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: taskData.payload.id
            },{
                column: 'user_id',
                comparator: '=',
                value: session.user_id
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
    }, () => deferred.reject());

    return deferred.promise;
};

exports.deleteTask = (taskData) => {
    const deferred = Q.defer();

    if (!taskData.payload) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteTask error]'), 'No "id" in given task');
        return deferred.promise;
    }
    sessions.getSession({
        id: taskData.tokenId
    }).then((session) => {
        try {
            DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: taskData.payload
            },{
                column: 'user_id',
                comparator: '=',
                value: session.user_id
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
    }, () => deferred.reject());


    return deferred.promise;
};
