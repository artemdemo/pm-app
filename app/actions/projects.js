import * as projectsConst from '../constants/projects';
import * as entityConst from '../constants/selectedEntity';
import { loadTasks } from './tasks';
import { errorMessage, successMessage } from './notification';
import { getStoredToken } from '../utils/user';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';
import { clearEntity } from './selectedEntity';

function projectsLoaded(projects) {
    return {
        type: projectsConst.PROJECTS_LOADED,
        projects,
    };
}

function projectAdded(project) {
    return {
        type: projectsConst.PROJECTS_ADDED,
        project,
    };
}

function projectDeleted(id) {
    return {
        type: projectsConst.PROJECT_DELETED,
        id,
    };
}

function projectUpdated(project) {
    return {
        type: projectsConst.PROJECT_UPDATED,
        project,
    };
}

export function loadProjects() {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/projects/all', token)
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((projects) => {
                dispatch(projectsLoaded(projects));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while projects loading'));
            });
    };
}

/**
 * Add new project
 * @param newProject {Object}
 * @param newProject.name {String}
 * @param newProject.description {String}
 * @param newProject.tasks {Array}
 */
export function addNewProject(newProject) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/projects', token, {method: 'POST', body: newProject})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((project) => {
                dispatch(projectAdded(Object.assign({}, newProject, project)));
                dispatch(clearEntity(entityConst.ENTITY_PROJECT));
                dispatch(loadTasks());
                dispatch(successMessage('Project added'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while adding project'));
            });
    };
}

/**
 * Delete project
 * @param id {Number}
 */
export function deleteProject(id) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch(`/projects/${id}`, token, {method: 'DELETE'})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then(() => {
                dispatch(projectDeleted(id));
                dispatch(clearEntity(entityConst.ENTITY_PROJECT));
                dispatch(loadTasks());
                dispatch(successMessage('Project deleted'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while adding project'));
            });
    };
}

/**
 * Update project
 *
 * @param projectUpdate {Object}
 * @param projectUpdate.name {String}
 * @param projectUpdate.description {String}
 * @param projectUpdate.tasks {Array}
 */
export function updateProject(projectUpdate) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/projects', token, {method: 'PUT', body: projectUpdate})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((project) => {
                dispatch(projectUpdated(Object.assign({}, projectUpdate, project)));
                dispatch(clearEntity(entityConst.ENTITY_PROJECT));
                dispatch(loadTasks());
                dispatch(successMessage('Project updated'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while adding project'));
            });
    };
}
