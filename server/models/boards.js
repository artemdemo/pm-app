const debug = require('debug')('pm:models:boards');
const moment = require('moment');
const DB = require('sqlite-crud');
const sessions = require('./sessions');
const { queryRowsWithSession } = require('../utils/db');

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
const getAllBoards = tokenId => queryRowsWithSession({
    tableName,
    fields: ['id', 'title', 'description', 'id_position'],
    tokenId,
});

/**
 * Fetch all boards with tasks
 * @param boardsData {Object}
 * @param boardsData.tokenId {String}
 * @param boardsData.id {String}
 * @returns {Promise}
 */
const getAll = boardsData => getAllBoards(boardsData.tokenId)
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
const addNew = async function(newBoardData) {
    const now = moment(new Date());
    const promisesList = [];

    promisesList.push(getAllBoards(newBoardData.tokenId));

    // In case there are no boards `getAllBoards` will return empty array
    promisesList.push(sessions.getSession({
        id: newBoardData.tokenId,
    }));

    const results = await Promise.all(promisesList);
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

    const result = await DB.insertRow(tableName, newBoard);
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

    await DB.run(query);
    return resultData;
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
const updateBoard = async function(boardData) {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!boardData.payload.id) {
        throw new Error('No boardData.payload.id in given task');
    }

    const allowedFields = ['title', 'description'];
    allowedFields.forEach((field) => {
        if (boardData.payload.hasOwnProperty(field)) {
            updateData[field] = boardData.payload[field];
        }
    });

    if (!updateAllowed) {
        throw new Error('No fields to update');
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    const boards = await getAllBoards(boardData.tokenId);
    const userId = boards[0].user_id;
    const updatedBoard = Object.assign(updateData, {
        id: boardData.payload.id,
        id_position: boardData.payload.id_position,
    });

    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: boardData.payload.id,
    }, {
        column: 'user_id',
        comparator: '=',
        value: userId,
    }]);

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
};

/**
 * Delete board
 * @param boardData {Object}
 * @param boardData.tokenId {String}
 * @param boardData.payload {String} - id of the board that should be deleted
 */
const deleteBoard = async function(boardData) {
    if (!boardData.payload) {
        throw new Error('No "id" in given board');
    }

    const id = boardData.tokenId;

    const session = await sessions.getSession({ id });
    await DB.deleteRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: boardData.payload,
    }, {
        column: 'user_id',
        comparator: '=',
        value: session.user_id,
    }]);

    const boards = await getAllBoards(boardData.tokenId);
    const query = cratePositionsQuery(boards);
    return DB.run(query);
};

module.exports = {
    getAll,
    addNew,
    updateBoard,
    deleteBoard,
};
