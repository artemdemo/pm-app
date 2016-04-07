/**
 * Establishing connection to the database
 *
 * @source http://blog.modulus.io/nodejs-and-sqlite
 */

'use strict';

let fs = require('fs');
let Q = require('q');
let chalk = require('chalk');

let dbFileName = './server/pm.db';
let dbFile = fs.existsSync(dbFileName);

if(!dbFile) {
    console.log('There is no DB. Creating new empty file');
    fs.openSync(dbFileName, "w");
}

let sqlite3 = require('sqlite3').verbose();
let db = null;

let getDB = () => {
    db = db || new sqlite3.Database(dbFileName);
    return db;
};

exports.getDB = getDB;


/**
 * Insert row into given table
 * @param tableName {string}
 * @param data {object}
 */
exports.insertToTable = (tableName, data) => {
    let deferred = Q.defer();
    let DB = getDB();
    let query = 'INSERT INTO ' + tableName + ' ';
    let columns = [];
    let columnValues = [];
    if (!tableName) {
        throw new Error('tableName is not provided');
    }
    if (!data) {
        throw new Error('data object is not provided');
    }
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            columns.push(key);
            columnValues.push(data[key]);
        }
    }
    if (columns.length == 0) {
        throw new Error('There is no columns in data object');
    }
    query += '(' + columns.join(',') + ') VALUES (';
    columns.forEach((column, i) => {
        query += '?';
        if (i < columns.length - 1) {
            query += ',';
        }
    });
    query += ')';
    //console.log(chalk.blue('Query:'), query);

    let stmt = DB.prepare(query);
    stmt.run(columnValues, function(error) {
        if (!error) {
            /**
             * `this` object will contain:
             * {
             *     sql: 'INSERT INTO hh_vacancies (name,vacancy_id) VALUES (?,?)',
             *     lastID: 11,
             *     changes: 1
             * }
             */
            deferred.resolve({ id: this.lastID });
        } else {
            //console.log(chalk.red.bold('[insertToTable error]'), error);
            //console.log(chalk.red.bold('[insertToTable data]'), data)
            /**
             * In case of UNIQUE constraint failed
             * `error.errorno` will be 19
             */
            deferred.reject({
                errno: error.errno,
                code: error.code
            });
        }
    });
    stmt.finalize();
    return deferred.promise;
};


/**
 * Update table row
 * @param tableName {string}
 * @param data {object}
 * @param where {array}
 *  [
 *      {
 *          column: '',
 *          comparator: '',
 *          value: ''
 *      },
 *      ...
 *  ]
 */
exports.updateInTable = (tableName, data, where) => {
    let deferred = Q.defer();
    let DB = getDB();
    let query = 'UPDATE ' + tableName + ' SET ';
    let columns = [];
    let columnValues = [];
    if (!tableName) {
        throw new Error('`tableName` is not provided');
    }
    if (!data) {
        throw new Error('`data` object is not provided');
    }
    if (!where) {
        throw new Error('`where` is not provided');
    } else if (!where.hasOwnProperty('length')) {
        throw new Error('`where` should be an array');
    } else if (where.length == 0) {
        throw new Error('There is no data in `where` object');
    }
    var key;
    for (key in data) {
        if (data.hasOwnProperty(key)) {
            columns.push(key);
            columnValues.push(data[key]);
        }
    }
    if (columns.length == 0) {
        throw new Error('There is no columns in `data` object');
    }
    columns.forEach((column, i) => {
        query += column + ' = ?';
        if (i < columns.length - 1) {
            query += ', ';
        }
    });

    query += ' WHERE ';

    where.forEach((whereItem, i) => {
        query += whereItem.column + ' ' + whereItem.comparator + ' ?';
        if (i < where.length - 1) {
            query += ', ';
        }
        columnValues.push(whereItem.value);
    });

    //console.log(chalk.blue('Query:'), query);

    DB.run(query, columnValues, (error) => {
        if (error) {
            console.log(chalk.red.bold('[updateInTable error]'), error);
            deferred.reject();
        } else {
            console.log(chalk.blue('Inserted '), where);
            deferred.resolve();
        }
    });

    return deferred.promise;
};

/**
 * Return first result row
 * @param query {string}
 */
exports.getFromTable = (query) => {
    let deferred = Q.defer();
    let DB = getDB();

    DB.get(query, (err, row) => {
        if (err) {
            console.log(chalk.red.bold('[getFromTable error]'), err);
            console.log('QUERY was: ', query);
            deferred.reject();
        } else {
            deferred.resolve(row);
        }
    });

    return deferred.promise;
};

/**
 * Delete rows from table
 * @param tableName {string}
 * @param where {array}
 *  [
 *      {
 *          column: '',
 *          comparator: '',
 *          value: ''
 *      },
 *      ...
 *  ]
 */
exports.deleteRows = (tableName, where) => {
    let deferred = Q.defer();
    let DB = getDB();
    let query = 'DELETE FROM ' + tableName;
    let columnValues = [];
    if (!tableName) {
        throw new Error('`tableName` is not provided');
    }
    if (!where) {
        throw new Error('`where` is not provided');
    } else if (!where.hasOwnProperty('length')) {
        throw new Error('`where` should be an array');
    } else if (where.length == 0) {
        throw new Error('There is no data in `where` object');
    }

    query += ' WHERE ';

    where.forEach((whereItem, i) => {
        query += whereItem.column + ' ' + whereItem.comparator + ' ?';
        if (i < where.length - 1) {
            query += ', ';
        }
        columnValues.push(whereItem.value);
    });

    console.log(chalk.blue('Query:'), query);

    DB.run(query, columnValues, (error, row) => {
        if (error) {
            console.log(chalk.red.bold('[updateInTable error]'), error);
            deferred.reject();
        } else {
            console.log(chalk.blue('Deleted '), where);
            deferred.resolve(row);
        }
    });

    return deferred.promise;
};
