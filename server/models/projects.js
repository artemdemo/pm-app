'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');

const DB = require('sqlite-crud')('./server/pm.db');
const tableName = 'projects';

exports.getAll = () => {
    const deferred = Q.defer();
    const db = DB.getDB();
    let query = '';

    query = `SELECT * FROM ${tableName};`;

    if (query) {
        db.all(query, (err, rows) => {
            if (err) {
                console.log(chalk.red.bold('[getAll projects error]'), err);
                deferred.reject();
            } else {
                deferred.resolve(rows);
            }
        });
    } else {
        console.log(chalk.red.bold('[getAll projects error]'), 'There is no query');
        deferred.reject();
    }

    return deferred.promise;
};

exports.addNew = (newProject) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    try {
        DB.insertToTable(tableName, {
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
    console.log('updateData', updateData);

    try {
        DB.updateInTable(tableName, updateData, [{
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
