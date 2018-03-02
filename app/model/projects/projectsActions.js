import * as projectsConst from './projectsConst';

/*
 * Loading
 */

export function loadProjects() {
    return {
        type: projectsConst.LOAD_PROJECTS,
    };
}

export function projectsLoaded(projects) {
    return {
        type: projectsConst.PROJECTS_LOADED,
        projects,
    };
}

export function projectsLoadingError(err) {
    return {
        type: projectsConst.PROJECTS_LOADING_ERROR,
        err,
    };
}

/*
 * Adding
 */

export function addProject(project) {
    return {
        type: projectsConst.ADD_PROJECT,
        project,
    };
}

export function projectAdded(project) {
    return {
        type: projectsConst.PROJECT_ADDED,
        project,
    };
}

export function projectAddingError(err) {
    return {
        type: projectsConst.PROJECT_ADDING_ERROR,
        err,
    };
}

/*
 * Updating
 */

export function updateProject(project) {
    return {
        type: projectsConst.UPDATE_PROJECT,
        project,
    };
}

export function projectUpdated(project) {
    return {
        type: projectsConst.PROJECT_UPDATED,
        project,
    };
}

export function projectUpdatingError(err) {
    return {
        type: projectsConst.PROJECT_UPDATING_ERROR,
        err,
    };
}

/*
 * Delete
 */

export function deleteProject(id) {
    return {
        type: projectsConst.DELETE_PROJECT,
        id,
    };
}

export function projectDeleted(id) {
    return {
        type: projectsConst.PROJECT_DELETED,
        id,
    };
}

export function projectDeletingError(err) {
    return {
        type: projectsConst.PROJECT_DELETING_ERROR,
        err,
    };
}

// export function loadProjects() {
//     const token = getStoredToken();
//
//     return (dispatch) => {
//         fetch('/api/projects', token)
//             .then(checkResponseStatus)
//             .then(response => response.json())
//             .then((projects) => {
//                 dispatch(projectsLoaded(projects));
//             })
//             .catch((e) => {
//                 console.error(e);
//                 dispatch(errorMessage('Error, while projects loading'));
//             });
//     };
// }

/**
 * Add new project
 * @param newProject {Object}
 * @param newProject.name {String}
 * @param newProject.description {String}
 * @param newProject.tasks {Array}
 */
// export function addNewProject(newProject) {
//     const token = getStoredToken();
//
//     return (dispatch) => {
//         fetch('/api/projects', token, {method: 'POST', body: newProject})
//             .then(checkResponseStatus)
//             .then(response => response.json())
//             .then((project) => {
//                 dispatch(projectAdded(Object.assign({}, newProject, project)));
//                 dispatch(clearEntity(entityConst.ENTITY_PROJECT));
//                 dispatch(loadTasks());
//                 dispatch(successMessage('Project added'));
//             })
//             .catch((e) => {
//                 console.error(e);
//                 dispatch(errorMessage('Error, while adding project'));
//             });
//     };
// }

/**
 * Delete project
 * @param id {Number}
 */
// export function deleteProject(id) {
//     const token = getStoredToken();
//
//     return (dispatch) => {
//         fetch(`/api/projects/${id}`, token, {method: 'DELETE'})
//             .then(checkResponseStatus)
//             .then(response => response.json())
//             .then(() => {
//                 dispatch(projectDeleted(id));
//                 dispatch(clearEntity(entityConst.ENTITY_PROJECT));
//                 dispatch(loadTasks());
//                 dispatch(successMessage('Project deleted'));
//             })
//             .catch((e) => {
//                 console.error(e);
//                 dispatch(errorMessage('Error, while adding project'));
//             });
//     };
// }

/**
 * Update project
 *
 * @param projectUpdate {Object}
 * @param projectUpdate.name {String}
 * @param projectUpdate.description {String}
 * @param projectUpdate.tasks {Array}
 */
// export function updateProject(projectUpdate) {
//     const token = getStoredToken();
//
//     return (dispatch) => {
//         fetch('/api/projects', token, {method: 'PUT', body: projectUpdate})
//             .then(checkResponseStatus)
//             .then(response => response.json())
//             .then((project) => {
//                 dispatch(projectUpdated(Object.assign({}, projectUpdate, project)));
//                 dispatch(clearEntity(entityConst.ENTITY_PROJECT));
//                 dispatch(loadTasks());
//                 dispatch(successMessage('Project updated'));
//             })
//             .catch((e) => {
//                 console.error(e);
//                 dispatch(errorMessage('Error, while adding project'));
//             });
//     };
// }
