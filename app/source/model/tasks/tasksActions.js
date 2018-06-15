import { createAction } from '../../services/actionCreator';

/*
 * Loading
 */

export const loadTasks = createAction('LOAD_TASKS');
export const tasksLoaded = createAction('TASKS_LOADED', tasks => ({ tasks }));
export const tasksLoadingError = createAction('TASKS_LOADING_ERROR', err => ({ err }));

/*
 * Load single task
 */

export const loadSingleTask = createAction('LOAD_SINGLE_TASK', id => ({ id }));
export const singleTaskLoaded = createAction('SINGLE_TASK_LOADED', data => ({ data }));
export const singleTasksLoadingError = createAction('SINGLE_TASK_LOADING_ERROR', err => ({ err }));

/*
 * Adding
 */

export const addTask = createAction('ADD_TASK', task => ({ task }));
export const taskAdded = createAction('TASK_ADDED', task => ({ task }));
export const taskAddingError = createAction('TASK_ADDING_ERROR', err => ({ err }));

/*
 * Updating
 */

export const updateTask = createAction('UPDATE_TASK', task => ({ task }));
export const taskUpdated = createAction('TASK_UPDATED', task => ({ task }));
export const taskUpdatingError = createAction('TASK_UPDATING_ERROR', err => ({ err }));

/*
 * Deleting
 */

export const deleteTask = createAction('DELETE_TASK', id => ({ id }));
export const taskDeleted = createAction('TASK_DELETED', id => ({ id }));
export const taskDeletingError = createAction('TASK_DELETING_ERROR', err => ({ err }));

/*
 * Updating position
 */

export const updateTaskPosition = createAction(
    'UPDATE_TASK_POSITION',
    (draggedTask, boardId, nearTaskId, position) => ({
        draggedTask,
        boardId,
        nearTaskId,
        position,
    })
);
export const taskPositionUpdated = createAction('TASK_POSITION_UPDATED');
export const taskPositionUpdateError = createAction('TASK_POSITION_UPDATING_ERROR', err => ({ err }));

/*
 * Reset
 */

export const resetTasks = createAction('RESET_TASKS');
