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

export function projectsLoadingError(err = true) {
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

export function projectAddingError(err = true) {
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

export function projectUpdatingError(err = true) {
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

export function projectDeletingError(err = true) {
    return {
        type: projectsConst.PROJECT_DELETING_ERROR,
        err,
    };
}

/*
 * Reset
 */

export function resetProjects() {
    return {
        type: projectsConst.RESET_PROJECTS,
    }
}
