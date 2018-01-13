const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');

const tableName = 'projects';

const getAll = async function(projectsData) {
    const projectsQuery = `SELECT projects.id, projects.name, projects.description,
                                  projects.added, projects.updated
                           FROM projects
                           INNER JOIN sessions 
                                   ON sessions.user_id = projects.user_id
                           WHERE sessions.id = ?;`;

    const projects = await DB.queryRows(projectsQuery, [projectsData.tokenId]);
    const promisesList = [];
    projects.forEach((project) => {
        const tasksQuery = `SELECT projects_tasks_relations.task_id,
                                           projects_tasks_relations.project_id
                                    FROM projects
                                    INNER JOIN projects_tasks_relations
                                            ON projects.id = projects_tasks_relations.project_id
                                    WHERE projects.id = ?;`;
        promisesList.push(DB.queryRows(tasksQuery, [project.id]));
    });

    const resultsList = await Promise.all(promisesList);
    resultsList.forEach((data, index) => {
        projects[index].tasks = data.map(item => item.task_id);
    });
    return projects;
};


const addNew = async function(newProjectData) {
    const now = moment(new Date());

    if (!newProjectData.payload.name) {
        throw new Error('No newProjectData.payload.name in given project');
    }

    const id = newProjectData.tokenId;

    const session = await sessions.getSession({ id });
    const result = await DB.insertRow(tableName, {
        name: newProjectData.payload.name,
        description: newProjectData.payload.description,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
        user_id: session.user_id,
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

    if (!projectData.payload.id) {
        throw new Error('No projectData.payload.id in given project');
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (projectData.payload.hasOwnProperty(field)) {
            updateData[field] = projectData.payload[field];
        }
    });

    if (!updateAllowed) {
        throw new Error('No fields to update');
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    const id = projectData.tokenId;

    const session = await sessions.getSession({ id });
    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: projectData.payload.id,
    }, {
        column: 'user_id',
        comparator: '=',
        value: session.user_id,
    }]);

    return {
        updated: updateData.updated,
    };
};


const deleteProject = async function(projectData) {
    if (!projectData.payload) {
        throw new Error('No projectId in given project');
    }

    const id = projectData.tokenId;

    const session = await sessions.getSession({ id });
    return DB.deleteRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: projectData.payload,
    }, {
        column: 'user_id',
        comparator: '=',
        value: session.user_id,
    }]);
};

module.exports = {
    getAll,
    addNew,
    updateProject,
    deleteProject,
};
