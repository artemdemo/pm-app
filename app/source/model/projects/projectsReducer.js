import * as projectsConst from './projectsConst';

const initState = {
    data: [],
    loading: false,
    loadingError: null,
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
        case projectsConst.LOAD_PROJECTS:
            return {
                ...state,
                loading: true,
            };
        case projectsConst.PROJECTS_LOADED:
            return {
                ...state,
                data: [...action.projects],
                loading: false,
                loadingError: null,
            };
        case projectsConst.PROJECTS_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Add
         */
        case projectsConst.ADD_PROJECT:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        case projectsConst.PROJECT_ADDED:
            return {
                ...state,
                data: [
                    ...state.data,
                    action.project,
                ],
                adding: false,
                addingError: null,
            };
        case projectsConst.PROJECT_ADDING_ERROR:
            return {
                ...state,
                adding: false,
                addingError: action.err,
            };
        /*
         * Update
         */
        case projectsConst.UPDATE_PROJECT:
            return {
                ...state,
                updating: true,
            };
        case projectsConst.PROJECT_UPDATED:
            return {
                ...state,
                data: state.data.map((item) => {
                    return action.project.id === item.id ? action.project : item;
                }),
                updating: false,
                updatingError: null,
            };
        case projectsConst.PROJECT_UPDATING_ERROR:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Delete
         */
        case projectsConst.DELETE_PROJECT:
            return {
                ...state,
                deleting: true,
            };
        case projectsConst.PROJECT_DELETED:
            return {
                ...state,
                data: state.data.filter(item => item.id !== action.id),
                deleting: false,
                deletingError: null,
            };
        case projectsConst.PROJECT_DELETING_ERROR:
            return {
                ...state,
                deleting: false,
                deletingError: action.err,
            };
        default:
            return state;
    }
}
