'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const crypto = require('crypto');

const DB = require('sqlite-crud');
const tableName = 'users';


exports.addNew = (newUser) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    try {
        DB.insertRow(tableName, {
            username: newUser.username,
            email: newUser.email,
            password: crypto.createHash('sha256').update(newUser.password).digest('base64'),
            added: now.format('YYYY-MM-DD HH:mm:ss'),
            updated: now.format('YYYY-MM-DD HH:mm:ss')
        }).then((result) => {
            deferred.resolve({
                id: result.id,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss')
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
            value: user.email
        },{
            column: 'password',
            comparator: '=',
            value: crypto.createHash('sha256').update(user.password).digest('base64')
        }]).then((result) => {
            if (result.length === 1) {
                deferred.resolve(result[0]);
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
