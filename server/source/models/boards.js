const debug = require('debug')('pm:models:boards');
const moment = require('moment');
const DB = require('sqlite-crud');
const _sortBy = require('lodash/sortBy');
const _get = require('lodash/get');
const arrayMove = require('array-move');
const { queryRows } = require('../utils/db');

const tableName = 'boards';

/**
 * Create SQL query to set position_id by order of given array
 * @param boards {Array}
 * @returns {string}
 */
const createPositionsQuery = (boards) => {
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
 * @param userId {String}
 */
const getAllBoards = userId => queryRows({
    tableName,
    fields: ['id', 'name', 'description', 'id_position'],
    userId,
});

/**
 * Fetch all boards with tasks
 * @param boardsData {Object}
 * @param boardsData.userId {String}
 * @param boardsData.id {String}
 * @returns {Promise}
 */
exports.getAll = boardsData => getAllBoards(boardsData.userId)
    .then((boards) => {
        return boards.map(board => ({
            id: board.id,
            name: board.name,
            description: board.description,
            id_position: board.id_position,
        }));
    });

/**
 * Add new board
 * @param newBoardData {Object}
 * @param newBoardData.userId {String}
 * @param newBoardData.board {Object}
 * @param newBoardData.board.name {String}
 * @param newBoardData.board.description {String}
 * @param newBoardData.board.id_position {Number}
 * @returns {Promise}
 */
exports.addNew = async function(newBoardData) {
    const now = moment(new Date());

    const boards = await getAllBoards(newBoardData.userId);

    const newBoard = {
        name: newBoardData.board.name,
        description: newBoardData.board.description,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
        user_id: newBoardData.userId,
    };

    debug(newBoard);

    const result = await DB.insertRow(tableName, newBoard);
    const resultData = {
        id: result.id,
        added: now.format('YYYY-MM-DD HH:mm:ss'),
        updated: now.format('YYYY-MM-DD HH:mm:ss'),
    };

    let boardsList = [];
    let newBoardAdded = false;
    newBoard.id_position = newBoardData.board.id_position;
    boards.forEach((board, i) => {
        if (newBoardData.board.id_position === i) {
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

    const query = createPositionsQuery(boardsList);

    await DB.run(query);
    return resultData;
};

/**
 * Update board
 * @returns {Promise}
 */
exports.updateBoard = async function(boardData) {
    const now = moment(new Date());
    const updateData = {};
    const updateAllowed = true;

    if (!boardData.board.id) {
        throw new Error('No boardData.board.id in given task');
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
        if (boardData.board.hasOwnProperty(field)) {
            updateData[field] = boardData.board[field];
        }
    });

    if (!updateAllowed) {
        throw new Error('No fields to update');
    }

    updateData.updated = now.format('YYYY-MM-DD HH:mm:ss');

    await DB.updateRow(tableName, updateData, [{
        column: 'id',
        comparator: '=',
        value: boardData.board.id,
    }, {
        column: 'user_id',
        comparator: '=',
        value: boardData.userId,
    }]);

    let boards = await getAllBoards(boardData.userId);
    boards = _sortBy(boards, ['id_position']);

    const updatedBoard = Object.assign(updateData, {
        id: boardData.board.id,
        id_position: boardData.board.id_position,
    });

    debug(updatedBoard);

    const prevPosition = (() => {
        const board = boards.find(item => item.id === updatedBoard.id);
        return _get(board, 'id_position', undefined);
    })();

    const updatedBoardsList = (() => {
        const newPosition = updatedBoard.id_position;
        if (prevPosition != null && prevPosition !== newPosition) {
            const movedBoards = arrayMove(boards, prevPosition, newPosition);
            return movedBoards.map((board, index) => Object.assign(board, {
                id_position: index,
            }));
        }
        return boards;
    })();

    const query = createPositionsQuery(updatedBoardsList);
    return DB.run(query)
        .then(() => {
            debug(`Board id ${boardData.board.id} moved`);
        });
};

/**
 * Delete board
 * @param boardData {Object}
 * @param boardData.userId {String}
 * @param boardData.boardId {String}
 */
exports.deleteBoard = async function(boardData) {
    if (!boardData.boardId) {
        throw new Error('No "id" in given board');
    }

    debug(boardData);

    await DB.deleteRows(tableName, [{
        column: 'id',
        comparator: '=',
        value: boardData.boardId,
    }, {
        column: 'user_id',
        comparator: '=',
        value: boardData.userId,
    }]);

    const boards = await getAllBoards(boardData.userId);
    const query = createPositionsQuery(boards);
    return DB.run(query);
};
