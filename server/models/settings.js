const DB = require('sqlite-crud');
const serializer = require('../utils/serializer');

const tableName = 'settings';

exports.getAll = async function(settingsData) {
    const settingsQuery = `SELECT ${tableName}.name, ${tableName}.value
                           FROM ${tableName}
                           INNER JOIN sessions 
                                   ON sessions.user_id = ${tableName}.user_id
                           WHERE sessions.id = ?;`;

    const rows = await DB.queryRows(settingsQuery, [settingsData.tokenId]);
    return serializer.strArrToObj(rows);
};
