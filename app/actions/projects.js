import * as projectsConst from '../constante/projects';
import { errorMessage } from './notification';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

function projectsLoaded(projects) {
    return {
        type: projectsConst.PROJECTS_LOADED,
        projects,
    };
}

export function loadprojects(token) {
    return dispatch => {
        fetch('/projects/all', token)
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((projects) => {
                dispatch(projectsLoaded(projects));
            })
            .catch(() => {
                dispatch(errorMessage('Error, while projects loading'));
            });
    };
}
