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

/**
 * After task has been dragged I need to update id of all tasks
 * @param draggedTask {Object}
 * @param boardId {Number}
 * @param nearTaskId {Number|null} - in case there is no near task it will be `null`
 * @param position {String} - `before` or `after`
 */
// export function updateDraggedTaskPosition(draggedTask, boardId, nearTaskId, position) {
//     const token = getStoredToken();
//
//     function updateTaskPosition(draggedTask) {
//         return {
//             type: tasksConst.UPDATE_TASK_POSITION,
//             draggedTask,
//             boardId,
//             nearTaskId,
//             position,
//         };
//     }
//
//     return (dispatch) => {
//         dispatch(updateTaskPosition(draggedTask));
//
//         fetch('/api/tasks/position', token, {method: 'PUT',
//             body: {
//                 taskId: draggedTask.id,
//                 nearTaskId,
//                 position,
//                 boardId,
//             }})
//             .then(checkResponseStatus)
//             .then((response) => {
//                 return response.json();
//             })
//             .then(() => {
//                 dispatch(successMessage('Task position updated'));
//             })
//             .catch((e) => {
//                 console.error(e);
//                 dispatch(errorMessage('Error, while updating task position'));
//             });
//     };
// }

/*
 * Reset
 */

export function resetTasks() {
    return {
        type: tasksConst.RESET_TASKS,
    }
}
