const debug = require('debug')('pm:models:tasks');
const moment = require('moment');
const DB = require('sqlite-crud');
const { queryRows } = require('../utils/db');

const tableName = 'tasks';

const parseTasks = tasks => tasks.map((task) => {
    task.done = !!task.done;
    return task;
});

const TASK_FIELDS = ['id', 'name', 'description', 'done', 'priority',
    'due', 'added', 'updated', 'board_id', 'id_position_scrum'];

const TASK_ROJECTS_QUERY = `SELECT projects_tasks_relations.task_id,
                                   projects_tasks_relations.project_id,
                                   projects.name AS project_name
                            FROM tasks
                            INNER JOIN projects_tasks_relations
                                    ON tasks.id = projects_tasks_relations.task_id
                            INNER JOIN projects
                                    ON projects.id = projects_tasks_relations.project_id
                            WHERE tasks.id = ?;`;

exports.getAll = async function(tasksData) {
    const rows = await queryRows({
        tableName,
        fields: TASK_FIELDS,
        userId: tasksData.userId,
    });
    const relationsListPromises = [];
    const tasks = parseTasks(rows);
    tasks.forEach((task) => {
        relationsListPromises.push(DB.queryRows(TASK_ROJECTS_QUERY, [task.id]));
    });

    const relationsList = await Promise.all(relationsListPromises);

    relationsList.forEach((data, index) => {
        tasks[index].projects = data.map(item => ({
            id: item.project_id,
            name: item.project_name,
        }));
    });
    return tasks;
};

/**
 * Get task by its id
 * @param taskData {Object}
 * @param taskData.userId {Number}
 * @param taskData.taskId {Number}
 * @return {Promise<Object>}
 */
exports.getById = async function(taskData) {
    const tasks = await queryRows({
        tableName,
        fields: TASK_FIELDS,
        userId: taskData.userId,
        where: `tasks.id = ${taskData.taskId}`,
    });
    if (tasks.length === 0) {
        return null;
    }
    const task = parseTasks(tasks)[0];
    const relations = await DB.queryRows(TASK_ROJECTS_QUERY, [task.id]);

    return {
        ...task,
        projects: relations.map(item => ({
            id: item.project_id,
            name: item.project_name,
        })),
    };
};

/**
 * Add new task
 * @param newTaskData {object}
 * @param newTaskData.task {object}
 * @param newTaskData.userId {number}
 * @return {Promise<{id: *, added: string, updated: string}>}
 */
exports.addNew = async function(newTaskData) {
    const now = moment(new Date());

    if (!newTaskData.task.name) {
        throw new Error('No newTaskData.task.name in given task');
    }

    const result = await DB.insertRow(tableName, {
        name: newTaskData.task.name,
        description: newTaskData.task.description || '',
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
        sp: newTaskData.sp || null,
        due: newTaskData.due || null,
        board_id: newTaskData.board_id || null,
        user_id: newTaskData.userId,
    });

    return {
        id: result.id,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
    };
};

/**
 * Update task
 * @param taskData
 * @param taskData.task {object}
 * @param taskData.userId {number}
 * @return {Promise<any>}
 */
exports.updateTask = async function(taskData) {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!taskData.task.id) {
        throw new Error('No taskData.task.id in given task');
    }

    const allowedFields = ['name', 'description', 'done', 'sp', 'priority', 'due', 'board_id'];
    allowedFields.forEach((field) => {
        if (taskData.task.hasOwnProperty(field)) {
            let data;
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            switch (field) {
                case 'board_id':
                    data = taskData.task[field] || null;
                    break;
                case 'due':
                    if (Array.isArray(dateTimeRegex.exec(taskData.task[field]))) {
                        data = taskData.task[field];
                    } else if (Array.isArray(dateRegex.exec(taskData.task[field]))) {
                        data = `${taskData.task[field]} 00:01:00`;
                    } else {
                        data = null;
                    }
                    break;
                default:
                    data = taskData.task[field];
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

    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: taskData.task.id,
    }, {
        column: 'user_id',
        comparator: '=',
        value: taskData.userId,
    }]);

    return {
        updated: updateData.updated,
    };
};

/**
 * Delete task
 * @param taskData {object}
 * @param taskData.taskId {number}
 * @param taskData.userId {number}
 * @return {Promise}
 */
exports.deleteTask = async function(taskData) {
    return DB.deleteRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: taskData.taskId,
    }, {
        column: 'user_id',
        comparator: '=',
        value: taskData.userId,
    }]);
};


/**
 * Update task position
 * @param taskData {Object}
 * @param taskData.userId {Number}
 * @param taskData.taskId {Number}
 * @param taskData.nearTaskId {Number|null}
 * @param taskData.position {String} `before` or `after`
 * @param taskData.boardId {Number}
 */
exports.updateTaskPosition = async function(taskData) {
    const tasksQuery = `SELECT tasks.id, tasks.id_position_scrum
                        FROM tasks
                        WHERE tasks.user_id = ? AND tasks.board_id = ?
                        ORDER BY tasks.id_position_scrum ASC;`;

    if (!taskData.taskId) {
        throw new Error('No "taskId" in given taskData');
    }

    let query;
    let taskList = [];

    const tasks = await DB.queryRows(tasksQuery, [taskData.userId, taskData.boardId]);
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
