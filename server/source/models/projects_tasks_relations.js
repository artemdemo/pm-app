const DB = require('sqlite-crud');
const _isNumber = require('lodash/isNumber');

const tableName = 'projects_tasks_relations';

/**
 * Add relation between project and task to the table
 *
 * @param projectId {Number || Array}
 * @param taskId {Number || Array}
 */
const addRelation = async function(projectId, taskId) {

    if (Array.isArray(projectId) && Array.isArray(taskId)) {
        throw new Error('projectId and taskId can\'t be both an Array');
    } else if (!Array.isArray(taskId) && !_isNumber(taskId)) {
        throw new Error('taskId should be a number or Array');
    } else if (!Array.isArray(projectId) && !_isNumber(projectId)) {
        throw new Error('projectId should be a number or Array');
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

    return DB.run(query).then(addRelations);
};


/**
 * Delete relation
 *
 * @param projectId {Number}
 * @param taskId {Number}
 */
const deleteRelation = async function(projectId, taskId) {
    if (_isNumber(projectId) || Number(projectId) < 1) {
        throw new Error('projectId should be a number, greater than 1');
    } else if (_isNumber(taskId) || Number(taskId) < 1) {
        throw new Error('taskId should be a number, greater than 1');
    }

    return DB.deleteRows(tableName, [
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
    ]);
};

module.exports = {
    addRelation,
    deleteRelation,
};
