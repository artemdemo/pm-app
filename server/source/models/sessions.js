const moment = require('moment');
const aguid = require('aguid');  // https://github.com/ideaq/aguid
const DB = require('sqlite-crud');
const config = require('../config');

const tableName = 'sessions';

const getSession = async function(queryObject) {
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
        throw new Error('There is no column data');
    }

    if (!value) {
        throw new Error('There is no value data');
    }

    const result = await DB.getRows(tableName, [{
        column,
        comparator: '=',
        value,
    }]);

    return result.length === 0 ? null : result[0];
};


const updateSession = async function(session) {
    const updateData = {
        added: moment().format('YYYY-MM-DD HH:mm:ss'),
        expires_in: config.expPeriod,
    };

    if (!session.id) {
        throw new Error('No session.id in given session');
    }

    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: session.id,
    }]);

    return updateData;
};


const addSession = async function(newSession) {
    if (!newSession.user_id) {
        throw new Error('No user_id in given object');
    }

    // eslint-disable-next-line
    const { user_id } = newSession;
    const session = await getSession({ user_id });

    if (!session) {
        const sessionId = aguid(); // a random session id
        await DB.insertRow(tableName, {
            id: sessionId,
            user_id: newSession.user_id,
            added: moment().format('YYYY-MM-DD HH:mm:ss'),
            expires_in: config.expPeriod,
        });

        return {
            id: sessionId,
            expiresIn: config.expPeriod,
        };
    }

    const result = await updateSession({
        id: session.id,
    });

    return {
        id: session.id,
        expiration: result.expiration,
    };
};


module.exports = {
    addSession,
    getSession,
};
