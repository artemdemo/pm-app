import * as boardsConst from './boardsConst';

/*
 * Loading
 */

export function loadBoards() {
    return {
        type: boardsConst.LOAD_BOARDS,
    };
}

export function boardsLoaded(boards) {
    return {
        type: boardsConst.BOARDS_LOADED,
        boards,
    };
}

export function boardsLoadingError(err = true) {
    return {
        type: boardsConst.BOARDS_LOADING_ERROR,
        err,
    };
}

/*
 * Adding
 */

/**
 * Add new board
 * @param board {Object}
 * @param board.title {String}
 * @param board.description {String}
 */
export function addBoard(board) {
    return {
        type: boardsConst.ADD_BOARD,
        board,
    };
}

export function boardAdded(board) {
    return {
        type: boardsConst.BOARD_ADDED,
        board,
    };
}

export function boardAddingError(err) {
    return {
        type: boardsConst.BOARD_ADDING_ERROR,
        err,
    };
}

/*
 * Updating
 */

/**
 * Update board
 * @param board {Object}
 * @param board.id {String}
 * @param board.title {String}
 * @param board.description {String}
 */
export function updateBoard(board) {
    return {
        type: boardsConst.UPDATE_BOARD,
        board,
    };
}

export function boardUpdated() {
    // After updating single board I'll request all list, since they whole order could change
    // Therefore there is no additional data here
    return {
        type: boardsConst.BOARD_UPDATED,
    };
}

export function boardUpdatingError(err) {
    return {
        type: boardsConst.BOARD_UPDATING_ERROR,
        err,
    };
}

/*
 * Deleting
 */

/**
 * Delete board
 * @param id {Number}
 */
export function deleteBoard(id) {
    return {
        type: boardsConst.DELETE_BOARD,
        id,
    };
}

export function boardDeleted(id) {
    return {
        type: boardsConst.BOARD_DELETED,
        id,
    };
}

export function boardDeletingError(err) {
    return {
        type: boardsConst.BOARD_DELETING_ERROR,
        err,
    };
}
