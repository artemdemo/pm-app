import * as boardsConst from '../constants/boards';
import { errorMessage, successMessage } from './notification';
import { getStoredToken } from '../../utils/user';
import { loadTasks } from './tasks';
import fetch from '../../utils/fetch';
import checkResponseStatus from '../../utils/checkResponseStatus';

function boardsLoaded(boards) {
    return {
        type: boardsConst.BOARDS_LOADED,
        boards,
    };
}

function boardAdded(board) {
    return {
        type: boardsConst.BOARDS_ADDED,
        board,
    };
}

function boardDeleted(id) {
    return {
        type: boardsConst.BOARD_DELETED,
        id,
    };
}

function boardUpdated(board) {
    return {
        type: boardsConst.BOARD_UPDATED,
        board,
    };
}

export function loadBoards() {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/boards/all', token)
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((boards) => {
                dispatch(boardsLoaded(boards));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while boards loading'));
            });
    };
}

/**
 * Add new board
 * @param newBoard {Object}
 * @param newBoard.title {String}
 * @param newBoard.description {String}
 */
export function addNewBoard(newBoard) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/boards', token, {method: 'POST', body: newBoard})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((board) => {
                dispatch(boardAdded(Object.assign({}, newBoard, board)));
                dispatch(successMessage('Board added'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while adding board'));
            });
    };
}

/**
 * Delete board
 * @param boardId {Number}
 */
export function deleteBoard(boardId) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch(`/boards/${boardId}`, token, {method: 'DELETE'})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then(() => {
                dispatch(boardDeleted(boardId));
                dispatch(loadTasks());
                dispatch(successMessage('Board deleted'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while deleting board'));
            });
    };
}

/**
 * Update board
 * @param boardUpdate {Object}
 * @param boardUpdate.id {String}
 * @param boardUpdate.title {String}
 * @param boardUpdate.description {String}
 */
export function updateBoard(boardUpdate) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/boards', token, {method: 'PUT', body: boardUpdate})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((board) => {
                dispatch(boardUpdated(Object.assign({}, boardUpdate, board)));
                dispatch(successMessage('Board updated'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while updating board'));
            });
    };
}
