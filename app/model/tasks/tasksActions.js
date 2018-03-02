import * as tasksConst from './tasksConst';
import { loadProjects } from '../projects/projectsActions';
import { loadBoards } from '../boards/boardsActions';
import { errorMessage, successMessage } from '../notification/notificationActions';
import { getStoredToken } from '../../utils/user';
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

export function taskAdded() {
    return {
        type: tasksConst.TASK_ADDED,
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
/*
 * Deleting
 */
/*
 * Loading
 */
/*
 * Updating position
 */

/*
 * Add new task
 * @param newTask {Object}
 * @param newTask.name {String} - task name (required)
 * @param newTask.description {String}
 * @param newTask.board_id {Number}
 */
// export function addNewTask(newTask) {
//     const token = getStoredToken();
//
//     function taskAdded(task) {
//         return {
//             type: tasksConst.TASKS_ADDED,
//             task,
//         };
//     }
//
//     return (dispatch) => {
//         fetch('/api/tasks', token, {method: 'POST', body: newTask})
//             .then(checkResponseStatus)
//             .then(response => response.json())
//             .then((task) => {
//                 dispatch(taskAdded(Object.assign({}, newTask, task)));
//                 dispatch(successMessage('Task added'));
//             })
//             .catch((e) => {
//                 console.error(e);
//                 dispatch(errorMessage('Error, while adding task'));
//             });
//     };
// }

/**
 * Delete task
 * @param taskId {Number}
 */
export function deleteTask(taskId) {
    const token = getStoredToken();

    function taskDeleted(id) {
        return {
            type: tasksConst.TASK_DELETED,
            id,
        };
    }

    return (dispatch) => {
        fetch(`/api/tasks/${taskId}`, token, {method: 'DELETE'})
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then(() => {
                dispatch(taskDeleted(taskId));
                dispatch(loadProjects());
                dispatch(loadBoards());
                dispatch(successMessage('Task deleted'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while deleting task'));
            });
    };
}

/**
 * Update task
 * @param taskUpdate {Object}
 * @param taskUpdate.id {String}
 * @param taskUpdate.name {String}
 * @param taskUpdate.description {String}
 * @param taskUpdate.done {Boolean}
 * @param taskUpdate.board_id {Number}
 * @param taskUpdate.projects {Array}
 */
export function updateTask(taskUpdate) {
    const token = getStoredToken();

    function taskUpdated(task) {
        return {
            type: tasksConst.TASK_UPDATED,
            task,
        };
    }

    return (dispatch) => {
        fetch('/api/tasks', token, {method: 'PUT', body: taskUpdate})
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((task) => {
                dispatch(taskUpdated(Object.assign({}, taskUpdate, task)));
                dispatch(loadProjects());
                dispatch(loadBoards());
                dispatch(successMessage('Task updated'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while updating task'));
            });
    };
}

/**
 * After task has been dragged I need to update id of all tasks
 * @param draggedTask {Object}
 * @param boardId {Number}
 * @param nearTaskId {Number|null} - in case there is no near task it will be `null`
 * @param position {String} - `before` or `after`
 */
export function updateDraggedTaskPosition(draggedTask, boardId, nearTaskId, position) {
    const token = getStoredToken();

    function updateTaskPosition(draggedTask) {
        return {
            type: tasksConst.UPDATE_TASK_POSITION,
            draggedTask,
            boardId,
            nearTaskId,
            position,
        };
    }

    return (dispatch) => {
        dispatch(updateTaskPosition(draggedTask));

        fetch('/api/tasks/position', token, {method: 'PUT',
            body: {
                taskId: draggedTask.id,
                nearTaskId,
                position,
                boardId,
            }})
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then(() => {
                dispatch(successMessage('Task position updated'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while updating task position'));
            });
    };
}
