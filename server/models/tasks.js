const debug = require('debug')('pm:models:tasks');
const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');
const { queryRowsWithSession } = require('../utils/db');

const tableName = 'tasks';

const parseTasks = tasks => tasks.map((task) => {
    task.done = !!task.done;
    return task;
});

const TASK_FIELDS = ['id', 'name', 'description', 'done', 'priority',
    'due', 'added', 'updated', 'board_id', 'id_position_scrum'];

exports.getAll = async function(tasksData) {
    const rows = await queryRowsWithSession({
        tableName,
        fields: TASK_FIELDS,
        tokenId: tasksData.tokenId,
    });
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

    const resultsList = await Promise.all(promisesList);
    resultsList.forEach((data, index) => {
        tasks[index].projects = data.map(item => item.project_id);
    });
    return tasks;
};

/**
 * Get task by its id
 * @param taskData {Object}
 * @param taskData.tokenId {String}
 * @param taskData.taskId {Number}
 * @return {Promise<Object>}
 */
exports.getById = async function(taskData) {
    const tasks = await queryRowsWithSession({
        tableName,
        fields: TASK_FIELDS,
        tokenId: taskData.tokenId,
        where: `tasks.id = ${taskData.taskId}`,
    });
    if (tasks.length === 0) {
        return null;
    }
    return parseTasks(tasks)[0];
};


exports.addNew = async function(newTaskData) {
    const now = moment(new Date());

    if (!newTaskData.payload.name) {
        throw new Error('No newTaskData.payload.name in given task');
    }

    const id = newTaskData.tokenId;

    const session = await sessions.getSession({ id });
    const result = await DB.insertRow(tableName, {
        name: newTaskData.payload.name,
        description: newTaskData.payload.description || '',
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
        sp: newTaskData.sp || null,
        due: newTaskData.due || null,
        board_id: newTaskData.board_id || null,
        user_id: session.user_id,
    });

    return {
        id: result.id,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
    };
};


exports.updateTask = async function(taskData) {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!taskData.payload.id) {
        throw new Error('No taskData.payload.id in given task');
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
        throw new Error('No fields to update');
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    // If task is `done` it shouldn't be connected to any board
    if (updateData.done) {
        updateData.board_id = null;
    }

    const id = taskData.tokenId;

    const session = await sessions.getSession({ id });
    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: taskData.payload.id,
    }, {
        column: 'user_id',
        comparator: '=',
        value: session.user_id,
    }]);

    return {
        updated: updateData.updated,
    };
};


exports.deleteTask = async function(taskData) {
    if (!taskData.payload) {
        throw new Error('No "id" in given task');
    }

    const id = taskData.tokenId;
    const session = await sessions.getSession({ id });

    return DB.deleteRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: taskData.payload,
    }, {
        column: 'user_id',
        comparator: '=',
        value: session.user_id,
    }]);
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
exports.updateTaskPosition = async function(taskData) {
    const tasksQuery = `SELECT tasks.id, tasks.id_position_scrum
                        FROM tasks
                        INNER JOIN sessions 
                                ON sessions.user_id = tasks.user_id
                        WHERE sessions.id = ? AND tasks.board_id = ?
                        ORDER BY tasks.id_position_scrum ASC;`;

    if (!taskData.taskId) {
        throw new Error('No "taskId" in given taskData');
    }

    let query;
    let taskList = [];

    const tasks = await DB.queryRows(tasksQuery, [taskData.tokenId, taskData.boardId]);
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

    try {
        await DB.run(query);
        return taskList;
    } catch (err) {
        debug(err);
        debug('Query was:');
        debug(query);
        throw new Error(err);
    }
};
