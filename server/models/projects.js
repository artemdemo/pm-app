/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const sessions = require('./sessions');
const DB = require('sqlite-crud');
const tableName = 'projects';

exports.getAll = (projectsData) => {
    const deferred = Q.defer();
    const projectsQuery = `SELECT projects.id, projects.name, projects.description,
                                  projects.added, projects.updated
                        FROM projects
                        INNER JOIN sessions 
                                ON sessions.user_id = projects.user_id
                        WHERE sessions.id = '${projectsData.tokenId}';`;

    DB.queryRows(projectsQuery)
        .then((projects) => {
            const promisesList = [];
            projects.forEach(project => {
                const tasksQuery = `SELECT projects_tasks_relations.task_id,
                                           projects_tasks_relations.project_id
                                    FROM projects
                                    INNER JOIN projects_tasks_relations
                                            ON projects.id = projects_tasks_relations.project_id
                                    WHERE projects.id = ${project.id};`;
                promisesList.push(DB.queryRows(tasksQuery));
            });
            Q.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        projects[index].tasks = data.map(item => item.task_id);
                    });
                    deferred.resolve(projects);
                }, () => {
                    deferred.reject();
                });
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};

exports.addNew = (newProjectData) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    if (!newProjectData.payload.name) {
        deferred.reject();
        console.log(chalk.red.bold('[addNew project error]'), 'No newProjectData.payload.name in given project');
        return deferred.promise;
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
                deferred.resolve({
                    id: result.id,
                    added: now.format('YYYY-MM-DD HH:mm:ss'),
                    updated: now.format('YYYY-MM-DD HH:mm:ss'),
                });
            }, (error) => {
                console.log(chalk.red.bold('[addNew projects error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[addNew projects error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};

exports.updateProject = (projectData) => {
    const deferred = Q.defer();
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!projectData.payload.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateProject error]'), 'No projectData.payload.id in given project');
        return deferred.promise;
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (projectData.payload.hasOwnProperty(field)) {
            updateData[field] = projectData.payload[field];
        }
    });

    if (!updateAllowed) {
        deferred.reject();
        console.log(chalk.red.bold('[updateProject error]'), 'No fields to update:', projectData.payload);
        return deferred.promise;
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
                deferred.resolve({
                    updated: updateData.updated,
                });
            }, (error) => {
                console.log(chalk.red.bold('[updateProject error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[updateProject error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};

exports.deleteProject = (projectData) => {
    const deferred = Q.defer();

    if (!projectData.payload) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteProject error]'), 'No projectId in given project');
        return deferred.promise;
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
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[deleteProject error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[deleteProject error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};
