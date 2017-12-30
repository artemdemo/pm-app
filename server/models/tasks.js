const debug = require('debug')('pm:models:tasks');
const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');
const errConstants = require('../constants/error');

const tableName = 'tasks';

const parseTasks = tasks => tasks.map((task) => {
    task.done = !!task.done;
    return task;
});

exports.getAll = tasksData => new Promise((resolve, reject) => {
    const tasksQuery = `SELECT tasks.id, tasks.name, tasks.description, tasks.done, tasks.sp, tasks.priority, tasks.due,
                               tasks.added, tasks.updated, tasks.board_id, tasks.id_position_scrum
                        FROM tasks
                        INNER JOIN sessions 
                                ON sessions.user_id = tasks.user_id
                        WHERE sessions.id = ?;`;

    DB.queryRows(tasksQuery, [tasksData.tokenId])
        .then((rows) => {
            const promisesList = [];
            const tasks = parseTasks(rows);
            tasks.forEach((task) => {
                const projectsQuery = `SELECT projects_tasks_relations.task_id,
                                              projects_tasks_relations.project_id
                                       FROM tasks
                                       INNER JOIN projects_tasks_relations
                                               ON tasks.id = projects_tasks_relations.task_id
                                       WHERE tasks.id = ?;`;
                promisesList.push(DB.queryRows(projectsQuery, [task.id]));
            });
            return Promise.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        tasks[index].projects = data.map(item => item.project_id);
                    });
                    resolve(tasks);
                });
        })
        .catch((err) => {
            debug(new Error(err));
            reject(errConstants.DB_ERROR);
        });
});

exports.addNew = newTaskData => new Promise((resolve, reject) => {
    const now = moment(new Date());

    if (!newTaskData.payload.name) {
        const err = 'No newTaskData.payload.name in given task';
        debug(new Error(err));
        reject(err);
        return;
    }

    sessions.getSession({
        id: newTaskData.tokenId,
    }).then((session) => {
        try {
            return DB.insertRow(tableName, {
                name: newTaskData.payload.name,
                description: newTaskData.payload.description || '',
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                sp: newTaskData.sp || null,
                due: newTaskData.due || null,
                board_id: newTaskData.board_id || null,
                user_id: session.user_id,
            }).then((result) => {
                resolve({
                    id: result.id,
                    added: now.format('YYYY-MM-DD HH:mm:ss'),
                    updated: now.format('YYYY-MM-DD HH:mm:ss'),
                });
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }).catch((err) => {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    });
});

exports.updateTask = taskData => new Promise((resolve, reject) => {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!taskData.payload.id) {
        const err = 'No taskData.payload.id in given task';
        debug(new Error(err));
        reject(err);
        return;
    }

    const allowedFields = ['name', 'description', 'done', 'sp', 'priority', 'due', 'board_id'];
    allowedFields.forEach((field) => {
        if (taskData.payload.hasOwnProperty(field)) {
            let data;
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            switch (field) {
                case 'board_id':
                    data = taskData.payload[field] || null;
                    break;
                case 'due':
                    if (Array.isArray(dateTimeRegex.exec(taskData.payload[field]))) {
                        data = taskData.payload[field];
                    } else if (Array.isArray(dateRegex.exec(taskData.payload[field]))) {
                        data = `${taskData.payload[field]} 00:01:00`;
                    } else {
                        data = null;
                    }
                    break;
                default:
                    data = taskData.payload[field];
            }
            updateData[field] = data;
        }
    });

    if (!updateAllowed) {
        const err = 'No fields to update';
        debug(new Error(err));
        debug(taskData.payload);
        reject(err);
        return;
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
            return DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: taskData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                resolve({
                    updated: updateData.updated,
                });
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }).catch((err) => {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    });
});

exports.deleteTask = taskData => new Promise((resolve, reject) => {
    if (!taskData.payload) {
        const err = 'No "id" in given task';
        debug(new Error(err));
        return reject(err);
    }
    sessions.getSession({
        id: taskData.tokenId,
    }).then((session) => {
        try {
            return DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: taskData.payload,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                resolve();
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }).catch((err) => {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    });
});


/**
 * Update task position
 * @param taskData {Object}
 * @param taskData.tokenId {String}
 * @param taskData.taskId {Number}
 * @param taskData.nearTaskId {Number|null}
 * @param taskData.position {String} `before` or `after`
 * @param taskData.boardId {Number}
 */
exports.updateTaskPosition = taskData => new Promise((resolve, reject) => {
    const tasksQuery = `SELECT tasks.id, tasks.id_position_scrum
                        FROM tasks
                        INNER JOIN sessions 
                                ON sessions.user_id = tasks.user_id
                        WHERE sessions.id = ? AND tasks.board_id = ?
                        ORDER BY tasks.id_position_scrum ASC;`;

    if (!taskData.taskId) {
        const err = 'No "taskId" in given taskData';
        debug(new Error(err));
        return reject(err);
    }

    let query;

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
            query = 'UPDATE tasks SET id_position_scrum = CASE id';
            const ids = [];

            taskList.forEach((task, index) => {
                ids.push(task.id);
                query += ` WHEN ${task.id} THEN ${index}`;
            });
            query += ' END,';
            query += ` board_id = ${taskData.boardId}`;
            query += ` WHERE id IN (${ids.join(', ')});`;

            return DB.run(query)
                .then(() => resolve(taskList));
        })
        .catch((err) => {
            debug(new Error(err));
            debug('Query was:');
            debug(query);
            reject(errConstants.DB_ERROR);
        });
});
