import { createAction } from '../../services/actionCreator';

/*
 * Loading
 */
export const loadBoards = createAction('LOAD_BOARDS');
export const boardsLoaded = createAction('BOARDS_LOADED', boards => ({ boards }));
export const boardsLoadingError = createAction('BOARDS_LOADING_ERROR', (err = true) => ({ err }));

/*
 * Adding
 */

export const addBoard = createAction('ADD_BOARD', board => ({ board }));
export const boardAdded = createAction('BOARD_ADDED', board => ({ board }));
export const boardAddingError = createAction('BOARD_ADDING_ERROR', (err = true) => ({ err }));

/*
 * Updating
 */

export const updateBoard = createAction('UPDATE_BOARD', board => ({ board }));
// After updating single board I'll request all list, since they whole order could change
// Therefore there is no additional data here
export const boardUpdated = createAction('BOARD_UPDATED');
export const boardUpdatingError = createAction('BOARD_UPDATING_ERROR', (err = true) => ({ err }));

/*
 * Deleting
 */

/**
 * Delete board
 * @param id {Number}
 */

export const deleteBoard = createAction('DELETE_BOARD', id => ({ id }));
export const boardDeleted = createAction('BOARD_DELETED', id => ({ id }));
export const boardDeletingError = createAction('BOARD_DELETING_ERROR', (err = true) => ({ err }));

/*
 * Reset
 */

export const resetBoards = createAction('RESET_BOARDS');
