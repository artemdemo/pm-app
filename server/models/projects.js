const debug = require('debug')('pm:models:projects');
const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');
const errConstants = require('../constants/error');

const tableName = 'projects';

exports.getAll = projectsData => new Promise((resolve, reject) => {
    const projectsQuery = `SELECT projects.id, projects.name, projects.description,
                                  projects.added, projects.updated
                           FROM projects
                           INNER JOIN sessions 
                                   ON sessions.user_id = projects.user_id
                           WHERE sessions.id = ?;`;

    DB.queryRows(projectsQuery, [projectsData.tokenId])
        .then((projects) => {
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
            return Promise.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        projects[index].tasks = data.map(item => item.task_id);
                    });
                    resolve(projects);
                });
        })
        .catch((err) => {
            debug(new Error(err));
            reject(errConstants.DB_ERROR);
        });
});


exports.addNew = newProjectData => new Promise((resolve, reject) => {
    const now = moment(new Date());

    if (!newProjectData.payload.name) {
        const err = 'No newProjectData.payload.name in given project';
        debug(new Error(err));
        reject(err);
        return;
    }

    sessions.getSession({
        id: newProjectData.tokenId,
    }).then((session) => {
        try {
            return DB.insertRow(tableName, {
                name: newProjectData.payload.name,
                description: newProjectData.payload.description,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                user_id: session.user_id,
            }).then((result) => {
                debug(`Project id ${result.id} created`);
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

exports.updateProject = projectData => new Promise((resolve, reject) => {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!projectData.payload.id) {
        const err = 'No projectData.payload.id in given project';
        debug(new Error(err));
        reject(err);
        return;
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (projectData.payload.hasOwnProperty(field)) {
            updateData[field] = projectData.payload[field];
        }
    });

    if (!updateAllowed) {
        const err = 'No fields to update';
        debug(new Error(err));
        debug(projectData.payload);
        reject(err);
        return;
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    sessions.getSession({
        id: projectData.tokenId,
    }).then((session) => {
        try {
            return DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: projectData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                debug(`Project id ${projectData.payload.id} updated`);
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

exports.deleteProject = projectData => new Promise((resolve, reject) => {
    if (!projectData.payload) {
        const err = 'No projectId in given project';
        debug(new Error(err));
        reject(err);
        return;
    }

    sessions.getSession({
        id: projectData.tokenId,
    }).then((session) => {
        try {
            return DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: projectData.payload,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]);
        } catch (err) {
            return Promise.reject(err);
        }
    })
        .then(() => {
            debug(`Project id ${projectData.payload} deleted`);
            resolve();
        })
        .catch((err) => {
            debug(new Error(err));
            reject(errConstants.DB_ERROR);
        });
});
