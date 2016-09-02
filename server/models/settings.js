/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const Q = require('q');
const sessions = require('./sessions');
const DB = require('sqlite-crud');
const serializer = require('../utils/serializer');
const tableName = 'settings';

exports.getAll = (settingsData) => {
    const deferred = Q.defer();
    const settingsQuery = `SELECT settings.name, settings.value
                           FROM settings
                           INNER JOIN sessions 
                                   ON sessions.user_id = settings.user_id
                           WHERE sessions.id = ?;`;

    DB.queryRows(settingsQuery, [settingsData.tokenId])
        .then((rows) => {
            const settings = serializer.strArrToObj(rows);

            deferred.resolve(settings);
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};
