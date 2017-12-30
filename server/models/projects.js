/* eslint-disable no-console */

const chalk = require('chalk');
const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');

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
            Promise.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        projects[index].tasks = data.map(item => item.task_id);
                    });
                    resolve(projects);
                }).catch(() => reject());
        }).catch(() => reject());
});


exports.addNew = newProjectData => new Promise((resolve, reject) => {
    const now = moment(new Date());

    if (!newProjectData.payload.name) {
        reject();
        console.log(chalk.red.bold('[addNew project error]'), 'No newProjectData.payload.name in given project');
        return;
    }

    sessions.getSession({
        id: newProjectData.tokenId,
    }).then((session) => {
        try {
            DB.insertRow(tableName, {
                name: newProjectData.payload.name,
                description: newProjectData.payload.description,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                user_id: session.user_id,
            }).then((result) => {
                resolve({
                    id: result.id,
                    added: now.format('YYYY-MM-DD HH:mm:ss'),
                    updated: now.format('YYYY-MM-DD HH:mm:ss'),
                });
            }).catch((error) => {
                console.log(chalk.red.bold('[addNew projects error]'), error);
                reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[addNew projects error]'), error);
            reject();
        }
    }).catch(() => reject());
});

exports.updateProject = projectData => new Promise((resolve, reject) => {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!projectData.payload.id) {
        reject();
        console.log(chalk.red.bold('[updateProject error]'), 'No projectData.payload.id in given project');
        return;
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (projectData.payload.hasOwnProperty(field)) {
            updateData[field] = projectData.payload[field];
        }
    });

    if (!updateAllowed) {
        reject();
        console.log(chalk.red.bold('[updateProject error]'), 'No fields to update:', projectData.payload);
        return;
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    sessions.getSession({
        id: projectData.tokenId,
    }).then((session) => {
        try {
            DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: projectData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                resolve({
                    updated: updateData.updated,
                });
            }).catch((error) => {
                console.log(chalk.red.bold('[updateProject error]'), error);
                reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[updateProject error]'), error);
            reject();
        }
    }).catch(() => reject());
});

exports.deleteProject = projectData => new Promise((resolve, reject) => {
    if (!projectData.payload) {
        reject();
        console.log(chalk.red.bold('[deleteProject error]'), 'No projectId in given project');
        return;
    }

    sessions.getSession({
        id: projectData.tokenId,
    }).then((session) => {
        try {
            DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: projectData.payload,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                resolve();
            }).catch((error) => {
                console.log(chalk.red.bold('[deleteProject error]'), error);
                reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[deleteProject error]'), error);
            reject();
        }
    }).catch(() => reject());
});
