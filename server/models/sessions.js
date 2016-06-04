'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const aguid = require('aguid');  // https://github.com/ideaq/aguid

const DB = require('sqlite-crud')('./pm-database/pm.db');
const tableName = 'sessions';

/**
 * Get session data from DB
 * @param queryObject
 * @returns {*|promise}
 */
const getSession = (queryObject) => {
    const deferred = Q.defer();
    let column;
    let value;

    switch(true) {
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
        deferred.reject();
        return deferred.promise;
    }

    if (!value) {
        console.log(chalk.red.bold('[getSession error]'), 'There is no value data');
        deferred.reject();
        return deferred.promise;
    }

    try {
        DB.getRows(tableName, [{
            column: column,
            comparator: '=',
            value: value
        }])
            .then((result) => {
                if (result.length == 0) {
                    console.log(chalk.red.bold('[getSession error]'), 'There is no sessions with id:', sessionId);
                    deferred.reject();
                } else {
                    deferred.resolve(result[0]);
                }
            }, () => {
                console.log(chalk.red.bold('[getSession error]'), error);
                deferred.reject();
            });
    } catch(error) {
        console.log(chalk.red.bold('[getSession error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

const updateSession = (session) => {
    const deferred = Q.defer();
    const expiration = moment(new Date()).add(30, 'm');
    let updateData = {};

    if (!session.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateSession error]'), 'No session.id in given session');
        return deferred.promise;
    }

    updateData['expiration'] = expiration.format('YYYY-MM-DD HH:mm:ss');

    try {
        DB.updateRow(tableName, updateData, [{
            column: 'id',
            comparator: '=',
            value: session.id
        }]).then(() => {
            deferred.resolve({
                expiration: expiration.format('YYYY-MM-DD HH:mm:ss')
            });
        }, (error) => {
            console.log(chalk.red.bold('[updateSession error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[updateSession error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

const addSession = (newSession) => {
    const deferred = Q.defer();

    if (!newSession.user_id) {
        deferred.reject();
        console.log(chalk.red.bold('[addSession error]'), 'No user_id in given object');
        return deferred.promise;
    }

    try {
        getSession({
            user_id: newSession.user_id
        }).then((session) => {
            if (!session) {
                const sessionId = aguid(); // a random session id
                const expiration = moment(new Date()).add(30, 'm');
                DB.insertRow(tableName, {
                    id: sessionId,
                    user_id: newSession.user_id,
                    expiration: expiration.format('YYYY-MM-DD HH:mm:ss')
                }).then((result) => {
                    deferred.resolve({
                        id: sessionId,
                        expiration: expiration.format('YYYY-MM-DD HH:mm:ss')
                    });
                }, (error) => {
                    console.log(chalk.red.bold('[addSession error]'), error);
                    deferred.reject();
                });
            } else {
                updateSession({
                    id: session.id
                }).then((result) => {
                    deferred.resolve({
                        id: session.id,
                        expiration: result.expiration
                    });
                }, (error) => {
                    console.log(chalk.red.bold('[addSession error]'), error);
                    deferred.reject();
                });
            }
        }, (error) => {
            console.log(chalk.red.bold('[addSession error]'), error);
            deferred.reject();
        });

    } catch(error) {
        console.log(chalk.red.bold('[addSession error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

const deleteSession = (sessionId) => {
    const deferred = Q.defer();

    if (!sessionId) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteSession error]'), 'No sessionId in given task');
        return deferred.promise;
    }

    try {
        DB.deleteRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: sessionId
        }]).then(() => {
            deferred.resolve();
        }, (error) => {
            console.log(chalk.red.bold('[deleteSession error]'), error);
            deferred.reject();
        });
    } catch(error) {
        console.log(chalk.red.bold('[deleteSession error]'), error);
        deferred.reject();
    }

    return deferred.promise;
};

exports.addSession = addSession;
exports.getSession = getSession;
exports.updateSession = updateSession;
exports.deleteSession = deleteSession;
