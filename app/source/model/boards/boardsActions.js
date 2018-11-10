import { createAction } from 'redux-act';

/*
 * Loading
 */
export const loadBoards = createAction('LOAD_BOARDS');
export const loadBoardsResult = createAction('LOAD_BOARDS_RESULT');

/*
 * Adding
 */

export const addBoard = createAction('ADD_BOARD');
export const addBoardResult = createAction('ADD_BOARD_RESULT');

/*
 * Updating
 */

export const updateBoard = createAction('UPDATE_BOARD');
export const updateBoardResult = createAction('UPDATE_BOARD_RESULT');

/*
 * Deleting
 */

/**
 * Delete board
 * @param id {Number}
 */

export const deleteBoard = createAction('DELETE_BOARD');
export const deleteBoardResult = createAction('DELETE_BOARD_RESULT');

/*
 * Reset
 */

export const resetBoards = createAction('RESET_BOARDS');
