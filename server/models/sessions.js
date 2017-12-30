const debug = require('debug')('pm:models:sessions');
const moment = require('moment');
const aguid = require('aguid');  // https://github.com/ideaq/aguid
const DB = require('sqlite-crud');
const errConstants = require('../constants/error');

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
        const err = 'There is no column data';
        debug(new Error(err));
        reject(err);
        return;
    }

    if (!value) {
        const err = 'There is no value data';
        debug(new Error(err));
        reject(err);
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
            })
            .catch((err) => {
                debug(new Error(err));
                reject(errConstants.DB_ERROR);
            });
    } catch (err) {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    }
});

const updateSession = session => new Promise((resolve, reject) => {
    const expiration = moment(new Date()).add(7, 'days');
    const updateData = {};

    if (!session.id) {
        const err = 'No session.id in given session';
        debug(new Error(err));
        reject(err);
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
        }).catch((err) => {
            debug(new Error(err));
            reject(errConstants.DB_ERROR);
        });
    } catch (err) {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    }
});

const addSession = newSession => new Promise((resolve, reject) => {
    if (!newSession.user_id) {
        const err = 'No user_id in given object';
        debug(new Error(err));
        reject(err);
        return;
    }

    try {
        getSession({
            user_id: newSession.user_id,
        }).then((session) => {
            if (!session) {
                const sessionId = aguid(); // a random session id
                const expiration = moment(new Date()).add(30, 'm');
                return DB.insertRow(tableName, {
                    id: sessionId,
                    user_id: newSession.user_id,
                    expiration: expiration.format('YYYY-MM-DD HH:mm:ss'),
                }).then(() => {
                    resolve({
                        id: sessionId,
                        expiration: expiration.format('YYYY-MM-DD HH:mm:ss'),
                    });
                });
            }
            return updateSession({
                id: session.id,
            }).then((result) => {
                resolve({
                    id: session.id,
                    expiration: result.expiration,
                });
            });
        }).catch((err) => {
            debug(new Error(err));
            reject(errConstants.DB_ERROR);
        });

    } catch (err) {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    }
});

const deleteSession = sessionId => new Promise((resolve, reject) => {
    if (!sessionId) {
        const err = 'No sessionId in given task';
        debug(new Error(err));
        reject(err);
        return;
    }

    try {
        DB.deleteRows(tableName, [{
            column: 'id',
            comparator: '=',
            value: sessionId,
        }]).then(() => {
            resolve();
        }).catch((err) => {
            debug(new Error(err));
            reject(errConstants.DB_ERROR);
        });
    } catch (err) {
        debug(new Error(err));
        reject(errConstants.DB_ERROR);
    }
});

exports = {
    addSession,
    getSession,
    updateSession,
    deleteSession,
};
