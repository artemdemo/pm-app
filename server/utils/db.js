const DB = require('sqlite-crud');
const _ = require('lodash');

exports.queryRows = async function({tableName, fields, userId, where = null}) {
    let query = 'SELECT ';
    let _where = 'user_id = ?';

    if (!_.isArray(fields) || fields.length === 0) {
        throw new Error('`fields` should be array');
    }

    if (_.isString(where)) {
        _where += ` AND (${where})`;
    }

    fields.forEach((field, index) => {
        const comma = index < fields.length - 1 ? ', ' : ' ';
        query += `${tableName}.${field}${comma}`;
    });

    query += `FROM ${tableName}
              WHERE ${_where};`;
    return DB.queryRows(query, [userId]);
};

/**
 * Query all rows where session fits given token
 * @param args {Object}
 * @param args.tableName {String}
 * @param args.fields {Array<String>}
 * @param args.tokenId {String}
 * @param args.where {String}
 * @return {Promise<void>}
 */
exports.queryRowsWithSession = async function({tableName, fields, tokenId, where = null}) {
    let query = 'SELECT ';
    let _where = 'sessions.id = ?';

    if (!_.isArray(fields) || fields.length === 0) {
        throw new Error('`fields` should be array');
    }

    if (_.isString(where)) {
        _where += ` AND (${where})`;
    }

    fields.forEach((field, index) => {
        const comma = index < fields.length - 1 ? ', ' : ' ';
        query += `${tableName}.${field}${comma}`;
    });

    query += `FROM ${tableName}
              INNER JOIN sessions
                      ON sessions.user_id = ${tableName}.user_id
              WHERE ${_where};`;
    return DB.queryRows(query, [tokenId]);
};
