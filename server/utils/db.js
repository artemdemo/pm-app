const DB = require('sqlite-crud');
const _ = require('lodash');

/**
 * Query rows with session
 * @param tableName {String}
 * @param fields {Array<String>}
 * @param tokenId {String}
 * @return {Promise<void>}
 */
exports.queryRowsWithSession = async function(tableName, fields, tokenId) {
    let query = 'SELECT ';

    if (!_.isArray(fields) || fields.length === 0) {
        throw new Error('`fields` should be array');
    }

    fields.forEach((field, index) => {
        const comma = index < fields.length - 1 ? ', ' : ' ';
        query += `${tableName}.${field}${comma}`;
    });

    query += `FROM ${tableName}
              INNER JOIN sessions
                      ON sessions.user_id = ${tableName}.user_id
              WHERE sessions.id = ?;`;
    return DB.queryRows(query, [tokenId]);
};
