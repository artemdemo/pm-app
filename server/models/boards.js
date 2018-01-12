const debug = require('debug')('pm:models:boards');
const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');

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
 */
const getAllBoards = (tokenId) => {
    const boardsQuery = `SELECT boards.id, boards.title, boards.description, boards.id_position, sessions.user_id
                         FROM boards
                         INNER JOIN sessions ON sessions.user_id = boards.user_id
                         WHERE sessions.id = ?
                         ORDER BY id_position ASC;`;

    return DB.queryRows(boardsQuery, [tokenId]);
};

/**
 * Fetch all boards with tasks
 * @param boardsData {Object}
 * @param boardsData.tokenId {String}
 * @param boardsData.id {String}
 * @returns {Promise}
 */
exports.getAll = boardsData => getAllBoards(boardsData.tokenId)
    .then((boards) => {
        return boards.map(board => ({
            id: board.id,
            title: board.title,
            description: board.description,
            id_position: board.id_position,
        }));
    });

/**
 * Add new board
 * @param newBoardData {Object}
 * @param newBoardData.tokenId {String}
 * @param newBoardData.payload {Object}
 * @param newBoardData.payload.title {String}
 * @param newBoardData.payload.description {String}
 * @param newBoardData.payload.id_position {Number}
 * @returns {Promise}
 */
exports.addNew = (newBoardData) => {
    const now = moment(new Date());
    const promisesList = [];

    promisesList.push(getAllBoards(newBoardData.tokenId));

    // In case there are no boards `getAllBoards` will return empty array
    promisesList.push(sessions.getSession({
        id: newBoardData.tokenId,
    }));

    return Promise.all(promisesList)
        .then((results) => {
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

            return DB.insertRow(tableName, newBoard)
                .then((result) => {
                    const resultData = {
                        id: result.id,
                        added: now.format('YYYY-MM-DD HH:mm:ss'),
                        updated: now.format('YYYY-MM-DD HH:mm:ss'),
                    };

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
                    return DB.run(query)
                        .then(() => resultData);
                });
        });
};

/**
 * Update board
 * @param boardData.tokenId {String}
 * @param boardData.payload {Object}
 * @param boardData.payload.id {String}
 * @param boardData.payload.title {String}
 * @param boardData.payload.description {String} - (optional)
 * @param boardData.payload.id_position {Number} - (optional)
 * @returns {Promise}
 */
exports.updateBoard = (boardData) => {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!boardData.payload.id) {
        const err = 'No boardData.payload.id in given task';
        debug(new Error(err));
        return Promise.reject(err);
    }

    const allowedFields = ['title', 'description'];
    allowedFields.forEach((field) => {
        if (boardData.payload.hasOwnProperty(field)) {
            updateData[field] = boardData.payload[field];
        }
    });

    if (!updateAllowed) {
        const err = 'No fields to update';
        debug(new Error(err));
        debug(boardData.payload);
        return Promise.reject(err);
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    return getAllBoards(boardData.tokenId)
        .then((boards) => {
            const userId = boards[0].user_id;
            const updatedBoard = Object.assign(updateData, {
                id: boardData.payload.id,
                id_position: boardData.payload.id_position,
            });

            return DB.updateRow(tableName, updateData, [{
                column: 'id',
                comparator: '=',
                value: boardData.payload.id,
            }, {
                column: 'user_id',
                comparator: '=',
                value: userId,
            }]).then(() => {
                const boardsList = [];
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

                const boardsListWithIdPosition = boardsList.map((board, index) => Object.assign(board, {
                    id_position: index,
                }));

                const query = cratePositionsQuery(boardsListWithIdPosition);
                return DB.run(query)
                    .then(() => {
                        debug(`Board id ${boardData.payload.id} moved`);
                    });
            });
        });
};

/**
 * Delete board
 * @param boardData {Object}
 * @param boardData.tokenId {String}
 * @param boardData.payload {String} - id of the board that should be deleted
 */
exports.deleteBoard = (boardData) => {
    if (!boardData.payload) {
        const err = 'No "id" in given board';
        debug(new Error(err));
        return Promise.reject(err);
    }

    const id = boardData.tokenId;

    return sessions.getSession({ id })
        .then((session) => {
            return DB.deleteRows(tableName, [{
                column: 'id',
                comparator: '=',
                value: boardData.payload,
            }, {
                column: 'user_id',
                comparator: '=',
                value: session.user_id,
            }]);
        })
        .then(() => getAllBoards(boardData.tokenId))
        .then((boards) => {
            const query = cratePositionsQuery(boards);
            return DB.run(query);
        });
};
