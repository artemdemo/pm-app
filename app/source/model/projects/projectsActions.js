import { createAction } from '../../services/actionCreator';

/*
 * Loading
 */
export const loadProjects = createAction('LOAD_PROJECTS');
export const projectsLoaded = createAction('PROJECTS_LOADED', projects => ({ projects }));
export const projectsLoadingError = createAction('PROJECTS_LOADING_ERROR', (err = true) => ({ err }));

/*
* Load single project
*/
export const loadSingleProject = createAction('LOAD_SINGLE_PROJECT', id => ({ id }));
export const singleProjectLoaded = createAction('SINGLE_PROJECT_LOADED', data => ({ data }));
export const singleProjectsLoadingError = createAction('SINGLE_PROJECT_LOADING_ERROR', (err = true) => ({ err }));

/*
 * Adding
 */
export const addProject = createAction('ADD_PROJECT', project => ({ project }));
export const projectAdded = createAction('PROJECT_ADDED', project => ({ project }));
export const projectAddingError = createAction('PROJECT_ADDING_ERROR', (err = true) => ({ err }));

/*
 * Updating
 */
export const updateProject = createAction('UPDATE_PROJECT', project => ({ project }));
export const projectUpdated = createAction('PROJECT_UPDATED', project => ({ project }));
export const projectUpdatingError = createAction('PROJECT_UPDATING_ERROR', (err = true) => ({ err }));

/*
 * Delete
 */
export const deleteProject = createAction('DELETE_PROJECT', id => ({ id }));
export const projectDeleted = createAction('PROJECT_DELETED', id => ({ id }));
export const projectDeletingError = createAction('PROJECT_DELETING_ERROR', (err = true) => ({ err }));

/*
 * Reset
 */
export const resetProjects = createAction('RESET_PROJECTS');
