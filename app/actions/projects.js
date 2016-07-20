import * as projectsConst from '../constants/projects';
import { errorMessage } from './notification';
import { getStoredToken } from '../utils/user';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

function projectsLoaded(projects) {
    return {
        type: projectsConst.PROJECTS_LOADED,
        projects,
    };
}

export function loadProjects() {
    const token = getStoredToken();

    return dispatch => {
        fetch('/projects/all', token)
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((projects) => {
                dispatch(projectsLoaded(projects));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while projects loading'));
            });
    };
}
