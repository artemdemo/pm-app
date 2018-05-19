const debug = require('debug')('pm:models:users');
const moment = require('moment');
const crypto = require('crypto');
const DB = require('sqlite-crud');
const errConstants = require('../constants/error');

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


exports.addNew = async function(newUser) {
    const now = moment(new Date());

    debug(newUser);

    const result = await DB.insertRow(tableName, {
        username: newUser.username,
        email: newUser.email,
        password: crypto.createHash('sha256').update(newUser.password).digest('base64'),
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
    });

    return {
        id: result.id,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
    };
};


exports.getUser = async function(user) {
    debug(user);

    const result = await DB.getRows(tableName, [{
        column: 'email',
        comparator: '=',
        value: user.email,
    }, {
        column: 'password',
        comparator: '=',
        value: crypto.createHash('sha256').update(user.password).digest('base64'),
    }]);

    if (result.length === 0) {
        throw new Error(errConstants.USER_ERROR);
    }

    return getUserFields(result[0]);
};


exports.getUserById = async function(userId) {
    const result = await DB.getRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: userId,
    }]);

    if (result.length === 0) {
        throw new Error(errConstants.USER_ERROR);
    }

    return getUserFields(result[0]);
};
