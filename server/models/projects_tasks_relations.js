const debug = require('debug')('pm:models:relations');
const DB = require('sqlite-crud');
const _isNumber = require('lodash/isNumber');

const tableName = 'projects_tasks_relations';

/**
 * Add relation between project and task to the table
 *
 * @param projectId {Number || Array}
 * @param taskId {Number || Array}
 */
exports.addRelation = (projectId, taskId) => new Promise((resolve, reject) => {

    if (Array.isArray(projectId) && Array.isArray(taskId)) {
        const err = 'projectId and taskId can\'t be both an Array';
        debug(new Error(err));
        reject(err);
        return;
    } else if (!Array.isArray(taskId) && !_isNumber(taskId)) {
        const err = 'taskId should be a number or Array';
        debug(new Error(err));
        reject(err);
        return;
    } else if (!Array.isArray(projectId) && !_isNumber(projectId)) {
        const err = 'projectId should be a number or Array';
        debug(new Error(err));
        reject(err);
        return;
    }

    const addRelations = () => {
        if (!Array.isArray(projectId) && !Array.isArray(taskId)) {
            const data = {
                project_id: projectId,
                task_id: taskId,
            };
            return DB.insertRow(tableName, data);
        } else if (!Array.isArray(projectId) && Array.isArray(taskId) && taskId.length > 0) {
            // eslint-disable-next-line
            const values = '(' + taskId.join(`, ${projectId}),(`) + `, ${projectId})`;
            return DB.run(`INSERT INTO ${tableName} (task_id, project_id) VALUES ${values};`);
        } else if (!Array.isArray(taskId) && Array.isArray(projectId) && projectId.length > 0) {
            // eslint-disable-next-line
            const values = '(' + projectId.join(`, ${taskId}),(`) + `, ${taskId})`;
            return DB.run(`INSERT INTO ${tableName} (project_id, task_id) VALUES ${values};`);
        } else if (!Array.isArray(projectId) && Array.isArray(taskId) && taskId.length === 0) {
            return Promise.resolve();
        } else if (!Array.isArray(taskId) && Array.isArray(projectId) && projectId.length === 0) {
            return Promise.resolve();
        }
        // eslint-disable-next-line
        return Promise.reject('Error while adding relations');
    };

    let query;

    if (!Array.isArray(taskId)) {
        query = `DELETE FROM ${tableName} WHERE task_id=${taskId};`;
    } else {
        query = `DELETE FROM ${tableName} WHERE project_id=${projectId};`;
    }

    DB.run(query)
        .then(addRelations)
        .then(() => {
            debug(`Added relation between project id ${projectId} and task id ${taskId}`);
            resolve();
        })
        .catch((err) => {
            debug(new Error(err));
            reject(err);
        });
});


/**
 * Delete relation
 *
 * @param projectId {Number}
 * @param taskId {Number}
 */
exports.deleteRelation = (projectId, taskId) => new Promise((resolve, reject) => {
    if (_isNumber(projectId) || Number(projectId) < 1) {
        const err = 'projectId should be a number, greater than 1';
        debug(new Error(err));
        reject(err);
        return;
    } else if (_isNumber(taskId) || Number(taskId) < 1) {
        const err = 'taskId should be a number, greater than 1';
        debug(new Error(err));
        reject(err);
        return;
    }

    DB.deleteRows(tableName, [
        {
            column: 'task_id',
            comparator: '=',
            value: taskId,
        },
        {
            column: 'project_id',
            comparator: '=',
            value: projectId,
        },
    ]).then(() => {
        debug(`Relation deleted between project id ${projectId} and task id ${taskId}`);
        resolve();
    }).catch((err) => {
        debug(new Error(err));
        reject(err);
    });
});

/**
 * Get all relations by project id or task id
 *
 * @param type {String} - 'project' or 'task'
 * @param typeId {Number} - id of project or task
 */
exports.getRelations = (type, typeId) => new Promise((resolve, reject) => {
    const allowedTypes = ['project', 'task'];
    let query;

    if (!type) {
        const err = 'No type given';
        debug(new Error(err));
        reject(err);
        return;
    } else if (allowedTypes.indexOf(type) === -1) {
        const err = `Given type is not allowed: ${type}`;
        debug(new Error(err));
        reject(err);
        return;
    } else if (!typeId) {
        const err = 'No typeId given';
        debug(new Error(err));
        reject(err);
        return;
    }

    query = `SELECT * FROM ${tableName} `;

    switch (true) {
        case type === 'project':
            query += `WHERE project_id=${typeId};`;
            break;
        default:
            query += `WHERE task_id=${typeId};`;
            break;
    }

    DB.getAll(query)
        .then((rows) => {
            resolve(rows);
        })
        .catch((err) => {
            debug(new Error(err));
            reject(err);
        });
});
