/* eslint-disable no-console, strict*/
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
    const tasksQuery = `SELECT tasks.id, tasks.name, tasks.description, tasks.done,
                               tasks.added, tasks.updated, tasks.board_id, tasks.id_position_scrum
                        FROM tasks
                        INNER JOIN sessions 
                                ON sessions.user_id = tasks.user_id
                        WHERE sessions.id = ?;`;

    DB.queryRows(tasksQuery, [tasksData.tokenId])
        .then((rows) => {
            const promisesList = [];
            const tasks = parseTasks(rows);
            tasks.forEach(task => {
                const projectsQuery = `SELECT projects_tasks_relations.task_id,
                                              projects_tasks_relations.project_id
                                       FROM tasks
                                       INNER JOIN projects_tasks_relations
                                               ON tasks.id = projects_tasks_relations.task_id
                                       WHERE tasks.id = ?;`;
                promisesList.push(DB.queryRows(projectsQuery, [task.id]));
            });
            Q.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        tasks[index].projects = data.map(item => item.project_id);
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

    if (!newTaskData.payload.name) {
        deferred.reject();
        console.log(chalk.red.bold('[addNew task error]'), 'No newTaskData.payload.name in given task');
        return deferred.promise;
    }

    sessions.getSession({
        id: newTaskData.tokenId,
    }).then((session) => {
        try {
            DB.insertRow(tableName, {
                name: newTaskData.payload.name,
                description: newTaskData.payload.description || '',
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                board_id: newTaskData.board_id || null,
                user_id: session.user_id,
            }).then((result) => {
                deferred.resolve({
                    id: result.id,
                    added: now.format('YYYY-MM-DD HH:mm:ss'),
                    updated: now.format('YYYY-MM-DD HH:mm:ss'),
                });
            }, (error) => {
                console.log(chalk.red.bold('[addNew Task error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[addNew Task error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};

exports.updateTask = (taskData) => {
    const deferred = Q.defer();
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!taskData.payload.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateTask error]'), 'No taskData.payload.id in given task');
        return deferred.promise;
    }

    const allowedFields = ['name', 'description', 'done', 'board_id'];
    allowedFields.forEach((field) => {
        if (taskData.payload.hasOwnProperty(field)) {
            let data;
            if (field === 'board_id') {
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

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    // If task is `done` it shouldn't be connected to any board
    if (updateData.done) {
        updateData.board_id = null;
    }

    sessions.getSession({
        id: taskData.tokenId,
    }).then((session) => {
        try {
            DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: taskData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                deferred.resolve({
                    updated: updateData.updated,
                });
            }, (error) => {
                console.log(chalk.red.bold('[updateTask error]'), error);
                deferred.reject();
            });
        } catch (error) {
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
        id: taskData.tokenId,
    }).then((session) => {
        try {
            DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: taskData.payload,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[deleteTask error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[deleteTask error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};

/**
 * Update task position
 * @param taskData {Object}
 * @param taskData.tokenId {String}
 * @param taskData.taskId {Number}
 * @param taskData.nearTaskId {Number|null}
 * @param taskData.position {String} `before` or `after`
 * @param taskData.boardId {Number}
 */
exports.updateTaskPosition = (taskData) => {
    const deferred = Q.defer();
    const tasksQuery = `SELECT tasks.id, tasks.id_position_scrum
                        FROM tasks
                        INNER JOIN sessions 
                                ON sessions.user_id = tasks.user_id
                        WHERE sessions.id = ? AND tasks.board_id = ?
                        ORDER BY tasks.id_position_scrum ASC;`;

    DB.queryRows(tasksQuery, [taskData.tokenId, taskData.boardId])
        .then((tasks) => {
            let taskList = [];
            const newTask = {
                id: taskData.taskId,
                id_position_scrum: 888, // this number doesn't matter for now, it will be corrected later
            };
            let newTaskAdded = false;
            for (let i = 0, len = tasks.length; i < len; i++) {
                const task = tasks[i];
                if (task.id !== taskData.taskId) {
                    if (task.id === taskData.nearTaskId) {
                        newTaskAdded = true;
                        if (taskData.position === 'before') {
                            taskList.push(newTask);
                            taskList.push(task);
                        } else {
                            taskList.push(task);
                            taskList.push(newTask);
                        }
                    } else {
                        taskList.push(task);
                    }
                }
            }
            if (!newTaskAdded) {
                taskList.push(newTask);
            }
            taskList = taskList.map((task, index) => Object.assign(task, {
                id_position_scrum: index,
            }));
            let query = 'UPDATE tasks SET id_position_scrum = CASE id';
            const ids = [];
            taskList.forEach((task, index) => {
                ids.push(task.id);
                query += ` WHEN ${task.id} THEN ${index}`;
            });
            query += ' END,';
            query += ` board_id = ${taskData.boardId}`;
            query += ` WHERE id IN (${ids.join(', ')});`;

            DB.run(query)
                .then(
                    () => deferred.resolve(taskList),
                    () => {
                        deferred.reject();
                    });
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};
