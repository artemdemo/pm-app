const debug = require('debug')('pm:model:projects');
const moment = require('moment');
const DB = require('sqlite-crud');
const { queryRows } = require('../utils/db');

const tableName = 'projects';

const getAll = async function(projectsData) {
    const projects = await queryRows({
        tableName,
        fields: ['id', 'name', 'description', 'added', 'updated'],
        userId: projectsData.userId,
    });
    const promisesList = [];
    projects.forEach((project) => {
        const tasksQuery = `SELECT projects_tasks_relations.task_id,
                                   projects_tasks_relations.project_id,
                                   tasks.name AS task_name
                            FROM projects
                            INNER JOIN projects_tasks_relations
                                    ON projects.id = projects_tasks_relations.project_id
                            INNER JOIN tasks
                                    ON tasks.id = projects_tasks_relations.task_id
                            WHERE projects.id = ?;`;
        promisesList.push(DB.queryRows(tasksQuery, [project.id]));
    });

    const resultsList = await Promise.all(promisesList);
    resultsList.forEach((data, index) => {
        projects[index].tasks = data.map((item) => ({
            id: item.task_id,
            name: item.task_name,
        }));
    });
    return projects;
};


const addNew = async function(newProjectData) {
    const now = moment(new Date());

    if (!newProjectData.project.name) {
        throw new Error('No newProjectData.project.name in given project');
    }

    debug(newProjectData);

    const result = await DB.insertRow(tableName, {
        name: newProjectData.project.name,
        description: newProjectData.project.description,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
        user_id: newProjectData.userId,
    });

    return {
        id: result.id,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
    };
};


const updateProject = async function(projectData) {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!projectData.project.id) {
        throw new Error('No projectData.project.id in given project');
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (projectData.project.hasOwnProperty(field)) {
            updateData[field] = projectData.project[field];
        }
    });

    if (!updateAllowed) {
        throw new Error('No fields to update');
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    debug(updateData);

    // ToDo: This API should return number of rows that have been affected
    // (or 0 when no rows affected)
    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: projectData.project.id,
    }, {
        column: 'user_id',
        comparator: '=',
        value: projectData.userId,
    }]);

    return {
        updated: updateData.updated,
    };
};


const deleteProject = async function(projectData) {
    if (!projectData.projectId) {
        throw new Error('No projectId in given project');
    }

    debug(projectData);

    return DB.deleteRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: projectData.projectId,
    }, {
        column: 'user_id',
        comparator: '=',
        value: projectData.userId,
    }]);
};

module.exports = {
    getAll,
    addNew,
    updateProject,
    deleteProject,
};
