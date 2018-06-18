import * as projectsActions from './projectsActions';

const initState = {
    data: [],
    singleData: {},
    loading: false,
    loadingError: null,
    loadingSingle: false,
    loadingSingleError: null,
    updating: false,
    updatingError: null,
    adding: false,
    addingError: null,
    deleting: false,
    deletingError: null,
};

export default function projects(state = initState, action) {
    switch (action.type) {
        /*
         * Load
         */
        case `${projectsActions.loadProjects}`:
            return {
                ...state,
                loading: true,
            };
        case `${projectsActions.projectsLoaded}`:
            return {
                ...state,
                data: [...action.projects],
                loading: false,
                loadingError: null,
            };
        case `${projectsActions.projectsLoadingError}`:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Load single task
         */
        case `${projectsActions.loadSingleProject}`:
            return {
                ...state,
                singleData: {},
                loadingSingle: true,
            };
        case `${projectsActions.singleProjectLoaded}`:
            return {
                ...state,
                singleData: action.data,
                loadingSingle: false,
            };
        case `${projectsActions.singleProjectsLoadingError}`:
            return {
                ...state,
                loadingSingle: false,
                loadingSingleError: action.err,
            };
        /*
         * Add
         */
        case `${projectsActions.addProject}`:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        case `${projectsActions.projectAdded}`:
            return {
                ...state,
                data: [
                    ...state.data,
                    action.project,
                ],
                adding: false,
                addingError: null,
            };
        case `${projectsActions.projectAddingError}`:
            return {
                ...state,
                adding: false,
                addingError: action.err,
            };
        /*
         * Update
         */
        case `${projectsActions.updateProject}`:
            return {
                ...state,
                updating: true,
            };
        case `${projectsActions.projectUpdated}`:
            return {
                ...state,
                data: state.data.map((item) => {
                    return action.project.id === item.id ? action.project : item;
                }),
                updating: false,
                updatingError: null,
            };
        case `${projectsActions.projectUpdatingError}`:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Delete
         */
        case `${projectsActions.deleteProject}`:
            return {
                ...state,
                deleting: true,
            };
        case `${projectsActions.projectDeleted}`:
            return {
                ...state,
                data: state.data.filter(item => item.id !== action.id),
                deleting: false,
                deletingError: null,
            };
        case `${projectsActions.projectDeletingError}`:
            return {
                ...state,
                deleting: false,
                deletingError: action.err,
            };
        /*
         * Reset
         */
        case `${projectsActions.resetProjects}`:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
