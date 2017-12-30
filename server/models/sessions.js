/* eslint-disable no-console */

// ToDo: Refactor error handling and debug errors (see modes/tasks.js)

const chalk = require('chalk');
const moment = require('moment');
const aguid = require('aguid');  // https://github.com/ideaq/aguid
const DB = require('sqlite-crud');

const tableName = 'sessions';

/**
 * Get session data from DB
 * @param queryObject
 * @returns {*|promise}
 */
const getSession = queryObject => new Promise((resolve, reject) => {
    let column;
    let value;

    switch (true) {
        case queryObject.hasOwnProperty('id'):
            column = 'id';
            value = queryObject.id;
            break;
        case queryObject.hasOwnProperty('user_id'):
            column = 'user_id';
            value = queryObject.user_id;
            break;
    }

    if (!column) {
        console.log(chalk.red.bold('[getSession error]'), 'There is no column data');
        reject();
        return;
    }

    if (!value) {
        console.log(chalk.red.bold('[getSession error]'), 'There is no value data');
        reject();
        return;
    }

    try {
        DB.getRows(tableName, [{
            column,
            comparator: '=',
            value,
        }])
            .then((result) => {
                if (result.length === 0) {
                    resolve(null);
                } else {
                    resolve(result[0]);
                }
            }).catch((err) => {
                console.log(chalk.red.bold('[getSession error]'), err);
                reject();
            });
    } catch (error) {
        console.log(chalk.red.bold('[getSession error]'), error);
        reject();
    }
});

const updateSession = session => new Promise((resolve, reject) => {
    const expiration = moment(new Date()).add(7, 'days');
    const updateData = {};

    if (!session.id) {
        reject();
        console.log(chalk.red.bold('[updateSession error]'), 'No session.id in given session');
        return;
    }

    updateData.expiration = expiration.format('YYYY-MM-DD HH:mm:ss');

    try {
        DB.updateRow(tableName, updateData, [{
            column: 'id',
            comparator: '=',
            value: session.id,
        }]).then(() => {
            resolve({
                expiration: expiration.format('YYYY-MM-DD HH:mm:ss'),
            });
        }).catch((error) => {
            console.log(chalk.red.bold('[updateSession error]'), error);
            reject();
        });
    } catch (error) {
        console.log(chalk.red.bold('[updateSession error]'), error);
        reject();
    }
});

const addSession = newSession => new Promise((resolve, reject) => {
    if (!newSession.user_id) {
        reject();
        console.log(chalk.red.bold('[addSession error]'), 'No user_id in given object');
        return;
    }

    try {
        getSession({
            user_id: newSession.user_id,
        }).then((session) => {
            if (!session) {
                const sessionId = aguid(); // a random session id
                const expiration = moment(new Date()).add(30, 'm');
                DB.insertRow(tableName, {
                    id: sessionId,
                    user_id: newSession.user_id,
                    expiration: expiration.format('YYYY-MM-DD HH:mm:ss'),
                }).then(() => {
                    resolve({
                        id: sessionId,
                        expiration: expiration.format('YYYY-MM-DD HH:mm:ss'),
                    });
                }).catch((error) => {
                    console.log(chalk.red.bold('[addSession error]'), error);
                    reject();
                });
            } else {
                updateSession({
                    id: session.id,
                }).then((result) => {
                    resolve({
                        id: session.id,
                        expiration: result.expiration,
                    });
                }).catch((error) => {
                    console.log(chalk.red.bold('[addSession error]'), error);
                    reject();
                });
            }
        }).catch((error) => {
            console.log(chalk.red.bold('[addSession error]'), error);
            reject();
        });

    } catch (error) {
        console.log(chalk.red.bold('[addSession error]'), error);
        reject();
    }
});

const deleteSession = sessionId => new Promise((resolve, reject) => {
    if (!sessionId) {
        reject();
        console.log(chalk.red.bold('[deleteSession error]'), 'No sessionId in given task');
        return;
    }

    try {
        DB.deleteRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: sessionId,
        }]).then(() => {
            resolve();
        }).catch((error) => {
            console.log(chalk.red.bold('[deleteSession error]'), error);
            reject();
        });
    } catch (error) {
        console.log(chalk.red.bold('[deleteSession error]'), error);
        reject();
    }
});

exports.addSession = addSession;
exports.getSession = getSession;
exports.updateSession = updateSession;
exports.deleteSession = deleteSession;
