/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const sessions = require('./sessions');
const DB = require('sqlite-crud');
const tableName = 'boards';

/**
 * Return all boards (without tasks), that related to given session id
 * @param tokenId {String} - for example: bbad4972-43d3-43fa-bb7f-35fb1ae64333
 * @returns {Array|promise}
 */
const getAllBoards = (tokenId) => {
    const deferred = Q.defer();
    const boardsQuery = `SELECT boards.id, boards.title, boards.description, boards.id_position, sessions.user_id
                         FROM boards
                         INNER JOIN sessions ON sessions.user_id = boards.user_id
                         WHERE sessions.id = '${tokenId}';`;

    DB.queryRows(boardsQuery)
        .then((boards) => {
            deferred.resolve(boards);
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};

/**
 * Fetch all boards with tasks
 * @param boardsData {Object}
 * @param boardsData.tokenId {String}
 * @param boardsData.id {String}
 * @returns {Array|promise}
 */
exports.getAll = (boardsData) => {
    const deferred = Q.defer();

    getAllBoards(boardsData.tokenId)
        .then((boards) => {
            const promisesList = [];
            const boardsList = boards.map((board) => {
                const tasksQuery = `SELECT tasks.id FROM tasks
                                    INNER JOIN sessions ON sessions.user_id = tasks.user_id
                                    WHERE sessions.id = '${boardsData.tokenId}' AND tasks.board_id = ${board.id};`;
                promisesList.push(DB.queryRows(tasksQuery));
                return {
                    id: board.id,
                    title: board.title,
                    description: board.description,
                    id_position: board.id_position,
                    tasks: [],
                };
            });
            Q.all(promisesList)
                .then((resultsList) => {
                    resultsList.forEach((data, index) => {
                        boardsList[index].tasks = data.map(item => item.id);
                    });
                    deferred.resolve(boardsList);
                }, () => {
                    deferred.reject();
                });
        }, () => {
            deferred.reject();
        });

    return deferred.promise;
};

/**
 * Add new board
 * @param newBoardData {Object}
 * @param newBoardData.tokenId {String}
 * @param newBoardData.payload {Object}
 * @param newBoardData.payload.title {String}
 * @param newBoardData.payload.description {String}
 * @param newBoardData.payload.id_position {Number}
 * @returns {Object|promise}
 */
exports.addNew = (newBoardData) => {
    const deferred = Q.defer();
    const now = moment(new Date());

    sessions.getSession({
        id: newBoardData.tokenId,
    }).then((session) => {
        try {
            DB.insertRow(tableName, {
                title: newBoardData.payload.title,
                description: newBoardData.payload.description,
                // id_position: newBoardData.payload.id_position || null,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                user_id: session.user_id,
            }).then((result) => {
                deferred.resolve({
                    id: result.id,
                    added: now.format('YYYY-MM-DD HH:mm:ss'),
                    updated: now.format('YYYY-MM-DD HH:mm:ss'),
                });
            }, (error) => {
                console.log(chalk.red.bold('[addNew Board error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[addNew Board error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};

/**
 * Update board
 * @param boardData.tokenId {String}
 * @param boardData.payload {Object}
 * @param boardData.payload.id {String}
 * @param boardData.payload.title {String}
 * @param boardData.payload.description {String} - (optional)
 * @param boardData.payload.id_position {Number} - (optional)
 * @returns {Object|promise}
 */
exports.updateBoard = (boardData) => {
    const deferred = Q.defer();
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!boardData.payload.id) {
        deferred.reject();
        console.log(chalk.red.bold('[updateBoard error]'), 'No boardData.payload.id in given task');
        return deferred.promise;
    }

    const allowedFields = ['title', 'description', 'id_position'];
    allowedFields.forEach((field) => {
        if (boardData.payload.hasOwnProperty(field)) {
            updateData[field] = boardData.payload[field];
        }
    });

    if (!updateAllowed) {
        deferred.reject();
        console.log(chalk.red.bold('[updateBoard error]'), 'No fields to update:', boardData.payload);
        return deferred.promise;
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    sessions.getSession({
        id: boardData.tokenId,
    }).then((session) => {
        try {
            DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: boardData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[updateBoard error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[updateBoard error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());

    return deferred.promise;
};

/**
 * Delete board
 * @param boardData {Object}
 * @param boardData.tokenId {String}
 * @param boardData.payload {String} - id of the board that should be deleted
 * @returns {Object|promise}
 */
exports.deleteBoard = (boardData) => {
    const deferred = Q.defer();

    if (!boardData.payload) {
        deferred.reject();
        console.log(chalk.red.bold('[deleteBoard error]'), 'No "id" in given board');
        return deferred.promise;
    }
    sessions.getSession({
        id: boardData.tokenId,
    }).then((session) => {
        try {
            DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: boardData.payload,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]).then(() => {
                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[deleteBoard error]'), error);
                deferred.reject();
            });
        } catch (error) {
            console.log(chalk.red.bold('[deleteBoard error]'), error);
            deferred.reject();
        }
    }, () => deferred.reject());


    return deferred.promise;
};
