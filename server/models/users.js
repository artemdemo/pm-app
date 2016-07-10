/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const crypto = require('crypto');

const DB = require('sqlite-crud');
const tableName = 'users';

/**
 * Will return user fields for the front
 * @param rawUser {Object} - user object from DB
 */
const getUserFields = (rawUser) => {
    const fields = ['id', 'username', 'email', 'added', 'updated'];
    let user = {};
    for (let key of Object.keys(rawUser)) {
        if (fields.indexOf(key) > -1) {
            user[key] = rawUser[key];
        }
    }
    return user;
};


exports.addNew = (newUser) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    try {
        DB.insertRow(tableName, {
            username: newUser.username,
            email: newUser.email,
            password: crypto.createHash('sha256').update(newUser.password).digest('base64'),
            added: now.format('YYYY-MM-DD HH:mm:ss'),
            updated: now.format('YYYY-MM-DD HH:mm:ss'),
        }).then((result) => {
            deferred.resolve({
                id: result.id,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
            });
        }, (error) => {
            console.log(chalk.red.bold('[addNew User error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[addNew User error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};


exports.getUser = (user) => {
    const deferred = Q.defer();

    try {
        DB.getRows(tableName, [{
            column: 'email',
            comparator: '=',
            value: user.email,
        }, {
            column: 'password',
            comparator: '=',
            value: crypto.createHash('sha256').update(user.password).digest('base64'),
        }]).then((result) => {
            if (result.length === 1) {
                deferred.resolve(getUserFields(result[0]));
            } else {
                deferred.reject();
            }
        }, (error) => {
            console.log(chalk.red.bold('[getUser User error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[getUser User error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};


exports.getUserById = (userId) => {
    const deferred = Q.defer();

    try {
        DB.getRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: userId,
        }]).then((result) => {
            console.log(result);
            if (result.length === 1) {
                deferred.resolve(getUserFields(result[0]));
            } else {
                deferred.reject();
            }
        }, (error) => {
            console.log(chalk.red.bold('[getUserById User error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[getUserById User error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};
