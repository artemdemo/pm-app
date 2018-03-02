import * as projectsConst from './projectsConst';

const initialState = {
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

function sortProjectsByUpdate(inProjects = []) {
    return inProjects.sort((projectA, projectB) => {
        if (projectA.updated > projectB.updated) {
            return -1;
        }
        if (projectA.updated < projectB.updated) {
            return 1;
        }
        return 0;
    });
}

export default function projects(state = initialState, action) {
    switch (action.type) {
        /*
         * Loading
         */
        case projectsConst.LOAD_PROJECTS:
            return Object.assign({}, state, {loading: true});
        case projectsConst.PROJECTS_LOADED:
            return Object.assign({}, state, {
                data: [...action.projects],
                loading: false,
                loadingError: null,
            });
        case projectsConst.PROJECTS_LOADING_ERROR:
            return Object.assign({}, state, {
                loading: false,
                loadingError: action.err,
            });
        /*
         * Adding
         */
        case projectsConst.ADD_PROJECT:
            return Object.assign({}, state, {adding: true});
        case projectsConst.PROJECT_ADDED:
            return Object.assign({}, state, {
                data: [
                    ...state.data,
                    action.project,
                ],
                adding: false,
                addingError: null,
            });
        case projectsConst.PROJECT_ADDING_ERROR:
            return Object.assign({}, state, {
                adding: false,
                addingError: action.err,
            });
        /*
         * Updating
         */
        case projectsConst.UPDATE_PROJECT:
            return Object.assign({}, state, {updating: true});
        case projectsConst.PROJECT_UPDATED:
            return Object.assign({}, state, {
                data: state.data.map((item) => {
                    if (action.project.id === item.id) {
                        return action.project;
                    }
                    return item;
                }),
                updating: false,
                updatingError: null,
            });
        case projectsConst.PROJECT_UPDATING_ERROR:
            return Object.assign({}, state, {
                updating: false,
                updatingError: action.err,
            });
        /*
         * Deleting
         */
        case projectsConst.DELETE_PROJECT:
            return Object.assign({}, state, {deleting: true});
        case projectsConst.PROJECT_DELETED:
            let projectsAfterDelete = state.data;
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.id) {
                    projectsAfterDelete = [
                        ...state.slice(0, i),
                        ...state.slice(i + 1),
                    ];
                }
            }
            return Object.assign({}, state, {
                data: projectsAfterDelete,
                deleting: false,
                deletingError: null,
            });
        case projectsConst.PROJECT_DELETING_ERROR:
            return Object.assign({}, state, {
                deleting: false,
                deletingError: action.err,
            });
        default:
            return state;
    }
}
