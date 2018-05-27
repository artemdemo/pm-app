import * as tasksConst from './tasksConst';
import { errorMessage, successMessage } from '../notification/notificationActions';
import fetch from '../../utils/fetch';
import checkResponseStatus from '../../utils/checkResponseStatus';

/*
 * Loading
 */

export function loadTasks() {
    return {
        type: tasksConst.LOAD_TASKS,
    };
}

export function tasksLoaded(tasks) {
    return {
        type: tasksConst.TASKS_LOADED,
        tasks,
    };
}

export function tasksLoadingError(err) {
    return {
        type: tasksConst.TASKS_LOADING_ERROR,
        err,
    };
}

/*
 * Adding
 */

export function addTask(task) {
    return {
        type: tasksConst.ADD_TASK,
        task,
    };
}

export function taskAdded(task) {
    return {
        type: tasksConst.TASK_ADDED,
        task,
    };
}

export function taskAddingError(err) {
    return {
        type: tasksConst.TASK_ADDING_ERROR,
        err,
    };
}

/*
 * Updating
 */

export function updateTask(task) {
    return {
        type: tasksConst.UPDATE_TASK,
        task,
    };
}

export function taskUpdated(task) {
    return {
        type: tasksConst.TASK_UPDATED,
        task,
    };
}

export function taskUpdatingError(err) {
    return {
        type: tasksConst.TASK_UPDATING_ERROR,
        err,
    };
}

/*
 * Deleting
 */

export function deleteTask(id) {
    return {
        type: tasksConst.DELETE_TASK,
        id,
    };
}

export function taskDeleted(id) {
    return {
        type: tasksConst.TASK_DELETED,
        id,
    };
}

export function taskDeletingError(err = true) {
    return {
        type: tasksConst.TASK_DELETING_ERROR,
        err,
    };
}

/*
 * Updating position
 */

export function updateTaskPosition(draggedTask, boardId, nearTaskId, position) {
    return {
        type: tasksConst.UPDATE_TASK_POSITION,
        draggedTask,
        boardId,
        nearTaskId,
        position,
    };
}

export function taskPositionUpdated() {
    return {
        type: tasksConst.TASK_POSITION_UPDATED,
    };
}

export function taskPositionUpdateError(err = true) {
    return {
        type: tasksConst.TASK_POSITION_UPDATING_ERROR,
        err,
    };
}

/*
 * Reset
 */

export function resetTasks() {
    return {
        type: tasksConst.RESET_TASKS,
    }
}
