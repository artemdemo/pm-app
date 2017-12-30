/* eslint-disable no-console */

const chalk = require('chalk');
const moment = require('moment');
const crypto = require('crypto');
const DB = require('sqlite-crud');

const tableName = 'users';

/**
 * Will return user fields for the front
 * @param rawUser {Object} - user object from DB
 */
const getUserFields = (rawUser) => {
    const fields = ['id', 'username', 'email', 'added', 'updated'];
    const user = {};
    for (const key of Object.keys(rawUser)) {
        if (fields.indexOf(key) > -1) {
            user[key] = rawUser[key];
        }
    }
    return user;
};


exports.addNew = newUser => new Promise((resolve, reject) => {
    const now = moment(new Date());

    try {
        DB.insertRow(tableName, {
            username: newUser.username,
            email: newUser.email,
            password: crypto.createHash('sha256').update(newUser.password).digest('base64'),
            added: now.format('YYYY-MM-DD HH:mm:ss'),
            updated: now.format('YYYY-MM-DD HH:mm:ss'),
        }).then((result) => {
            resolve({
                id: result.id,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
            });
        }).catch((error) => {
            console.log(chalk.red.bold('[addNew User error]'), error);
            reject();
        });
    } catch (error) {
        console.log(chalk.red.bold('[addNew User error]'), error);
        reject();
    }
});


exports.getUser = user => new Promise((resolve, reject) => {
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
                resolve(getUserFields(result[0]));
            } else {
                reject();
            }
        }).catch((error) => {
            console.log(chalk.red.bold('[getUser User error]'), error);
            reject();
        });
    } catch (error) {
        console.log(chalk.red.bold('[getUser User error]'), error);
        reject();
    }
});


exports.getUserById = userId => new Promise((resolve, reject) => {
    try {
        DB.getRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: userId,
        }]).then((result) => {
            if (result.length === 1) {
                resolve(getUserFields(result[0]));
            } else {
                reject();
            }
        }).catch((error) => {
            console.log(chalk.red.bold('[getUserById User error]'), error);
            reject();
        });
    } catch (error) {
        console.log(chalk.red.bold('[getUserById User error]'), error);
        reject();
    }
});
