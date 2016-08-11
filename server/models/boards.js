/* eslint-disable no-console, strict*/
'use strict';

const chalk = require('chalk');
const moment = require('moment');
const Q = require('q');
const sessions = require('./sessions');
const DB = require('sqlite-crud');
const tableName = 'boards';


/**
 * Create SQL query to set position_id by order of given array
 * @param boards {Array}
 * @returns {string}
 */
const cratePositionsQuery = (boards) => {
    let query = 'UPDATE boards SET id_position = CASE id';
    const ids = [];
    boards.forEach((board, index) => {
        ids.push(board.id);
        query += ` WHEN ${board.id} THEN ${index}`;
    });
    query += ' END';
    query += ` WHERE id IN (${ids.join(', ')});`;
    return query;
};

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
                         WHERE sessions.id = '${tokenId}'
                         ORDER BY id_position ASC;`;

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
            const boardsList = boards.map((board) => {
                return {
                    id: board.id,
                    title: board.title,
                    description: board.description,
                    id_position: board.id_position,
                };
            });
            deferred.resolve(boardsList);
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
    const promisesList = [];

    promisesList.push(getAllBoards(newBoardData.tokenId));

    // In case there are no boards `getAllBoards` will return empty array
    promisesList.push(sessions.getSession({
        id: newBoardData.tokenId,
    }));

    Q.all(promisesList)
        .then(results => {
            const boards = results[0];
            const session = results[1];

            const userId = session.user_id;
            const newBoard = {
                title: newBoardData.payload.title,
                description: newBoardData.payload.description,
                added: now.format('YYYY-MM-DD HH:mm:ss'),
                updated: now.format('YYYY-MM-DD HH:mm:ss'),
                user_id: userId,
            };

            DB.insertRow(tableName, newBoard)
                .then((result) => {
                    const resultData = {
                        id: result.id,
                        added: now.format('YYYY-MM-DD HH:mm:ss'),
                        updated: now.format('YYYY-MM-DD HH:mm:ss'),
                    };
                    deferred.resolve(resultData);

                    let boardsList = [];
                    let newBoardAdded = false;
                    newBoard.id_position = newBoardData.payload.id_position;
                    boards.forEach((board, i) => {
                        if (newBoardData.payload.id_position === i) {
                            newBoardAdded = true;
                            boardsList.push(Object.assign(newBoard, resultData));
                        }
                        boardsList.push(board);
                    });
                    if (!newBoardAdded) {
                        boardsList.push(Object.assign(newBoard, resultData));
                    }
                    boardsList = boardsList.map((board, index) => Object.assign(board, {
                        id_position: index,
                    }));

                    const query = cratePositionsQuery(boardsList);
                    DB.run(query);
                }, (error) => {
                    console.log(chalk.red.bold('[addNew Board error]'), error);
                    deferred.reject();
                });
        }, (error) => {
            console.log(chalk.red.bold('[addNew Board error]'), error);
            deferred.reject();
        });

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

    const allowedFields = ['title', 'description'];
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

    getAllBoards(boardData.tokenId)
        .then(boards => {
            const userId = boards[0].user_id;
            const updatedBoard = Object.assign(updateData, {
                id: boardData.payload.id,
                id_position: boardData.payload.id_position,
            });

            DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: boardData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: userId,
            }]).then(() => {
                let boardsList = [];
                let newBoardAdded = false;

                boards.forEach((board, i) => {
                    if (board.id !== updatedBoard.id) {
                        if (updatedBoard.id_position === i) {
                            newBoardAdded = true;
                            boardsList.push(updatedBoard);
                        }
                        boardsList.push(board);
                    }
                });
                if (!newBoardAdded) {
                    boardsList.push(updatedBoard);
                }
                boardsList = boardsList.map((board, index) => Object.assign(board, {
                    id_position: index,
                }));

                const query = cratePositionsQuery(boardsList);
                DB.run(query);

                deferred.resolve();
            }, (error) => {
                console.log(chalk.red.bold('[updateBoard error]'), error);
                deferred.reject();
            });
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
                getAllBoards(boardData.tokenId)
                    .then(boards => {
                        const query = cratePositionsQuery(boards);
                        DB.run(query);
                    });
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
