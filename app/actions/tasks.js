import * as tasksConst from '../constants/tasks';
import { loadProjects } from './projects';
import { loadBoards } from './boards';
import { errorMessage, successMessage } from './notification';
import { getStoredToken } from '../utils/user';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

/**
 * Load tasks from the server
 */
export function loadTasks() {
    const token = getStoredToken();

    function tasksLoaded(tasks) {
        return {
            type: tasksConst.TASKS_LOADED,
            tasks,
        };
    }

    return dispatch => {
        fetch('/tasks/all', token)
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((tasks) => {
                dispatch(tasksLoaded(tasks));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while tasks loading'));
            });
    };
}

/**
 * Add new task
 * @param newTask {Object}
 * @param newTask.name {String} - task name (required)
 * @param newTask.description {String}
 * @param newTask.board_id {Number}
 */
export function addNewTask(newTask) {
    const token = getStoredToken();

    function taskAdded(task) {
        return {
            type: tasksConst.TASKS_ADDED,
            task,
        };
    }

    return dispatch => {
        fetch('/tasks', token, {method: 'POST', body: newTask})
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((task) => {
                dispatch(taskAdded(Object.assign({}, newTask, task)));
                dispatch(successMessage('Task added'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while adding task'));
            });
    };
}

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

    return dispatch => {
        fetch(`/tasks/${taskId}`, token, {method: 'DELETE'})
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

    return dispatch => {
        fetch('/tasks', token, {method: 'PUT', body: taskUpdate})
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
 * @param draggedTask.task {Object}
 * @param draggedTask.task.id {Number}
 * @param draggedTask.nearTaskId {Number|null} - in case there is no near task it will be `null`
 * @param draggedTask.position {String} - `before` or `after`
 * @param draggedTask.boardId {Number}
 */
export function updateDraggedTaskPosition(draggedTask) {
    const token = getStoredToken();

    function updateTaskPosition(draggedTask) {
        return {
            type: tasksConst.UPDATE_TASK_POSITIONS_AFTER_DRAGGING,
            draggedTask,
        };
    }

    return dispatch => {
        dispatch(updateTaskPosition(draggedTask));

        fetch('/tasks/position', token, {method: 'PUT', body: {
            taskId: draggedTask.task.id,
            nearTaskId: draggedTask.nearTaskId,
            position: draggedTask.position,
            boardId: draggedTask.boardId,
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
