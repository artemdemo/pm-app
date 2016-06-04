'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');

const DB = require('sqlite-crud')('./pm-database/pm.db');
const tableName = 'projects';

exports.getAll = () => {
    const deferred = Q.defer();
    let projectsQuery = `SELECT * FROM ${tableName};`;

    DB.queryRows(projectsQuery)
        .then((projects) => {
            let promisesList = [];
            projects.forEach(project => {
                let tasksQuery = `SELECT projects_tasks_relations.task_id, projects_tasks_relations.project_id FROM projects 
                                  INNER JOIN projects_tasks_relations ON projects.id = projects_tasks_relations.project_id 
                                  WHERE projects.id = ${project.id};`;
                promisesList.push(DB.queryRows(tasksQuery));
            });
            Q.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        projects[index]['tasks'] = data.map(item => item.task_id)
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

exports.addNew = (newProject) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    try {
        DB.insertRow(tableName, {
            name: newProject.name,
            description: newProject.description,
            added: now.format('YYYY-MM-DD HH:mm:ss'),
            updated: now.format('YYYY-MM-DD HH:mm:ss')
        }).then((result) => {
            deferred.resolve({
                id: result.id,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss')
            });
        }, (error) => {
            console.log(chalk.red.bold('[addNew projects error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[addNew projects error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

exports.updateProject = (project) => {
    const deferred = Q.defer();
    const now = moment(new Date());
    let updateData = {};
    let updateAllowed = true;

    if (!project.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateProject error]'), 'No project.id in given project');
        return deferred.promise;
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (project.hasOwnProperty(field)) {
            updateData[field] = project[field];
        }
    });

    if (!updateAllowed) {
        deferred.reject();
        console.log(chalk.red.bold('[updateProject error]'), 'No fields to update:', project);
        return deferred.promise;
    }

    updateData['updated'] = now.format('YYYY-MM-DD HH:mm:ss');

    try {
        DB.updateRow(tableName, updateData, [{
            column: 'id',
            comparator: '=',
            value: project.id
        }]).then(() => {
            deferred.resolve();
        }, (error) => {
            console.log(chalk.red.bold('[updateProject error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[updateProject error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

exports.deleteProject = (projectId) => {
    const deferred = Q.defer();

    if (!projectId) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteProject error]'), 'No projectId in given project');
        return deferred.promise;
    }

    try {
        DB.deleteRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: projectId
        }]).then(() => {
            deferred.resolve();
        }, (error) => {
            console.log(chalk.red.bold('[deleteProject error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[deleteProject error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};
