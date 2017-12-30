/* eslint-disable no-console */

const DB = require('sqlite-crud');
const serializer = require('../utils/serializer');

const tableName = 'settings';

exports.getAll = settingsData => new Promise((resolve, reject) => {
    const settingsQuery = `SELECT ${tableName}.name, ${tableName}.value
                           FROM ${tableName}
                           INNER JOIN sessions 
                                   ON sessions.user_id = ${tableName}.user_id
                           WHERE sessions.id = ?;`;

    DB.queryRows(settingsQuery, [settingsData.tokenId])
        .then((rows) => {
            const settings = serializer.strArrToObj(rows);

            resolve(settings);
        }).catch(() => reject());
});
