import * as taskConst from '../constants/tasks';
import { errorMessage } from './notification';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

function tasksLoaded(tasks) {
    return {
        type: taskConst.TASKS_LOADED,
        tasks,
    };
}

export function loadTasks(token) {
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
