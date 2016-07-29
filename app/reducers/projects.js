import * as projectsConst from '../constants/projects';

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

export default function projects(state = [], action) {
    switch (action.type) {
        case projectsConst.PROJECTS_LOADED:
            return sortProjectsByUpdate(action.projects);
        case projectsConst.PROJECTS_ADDED:
            return [action.project].concat(state);
        case projectsConst.PROJECT_DELETED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.id) {
                    return [
                        ...state.slice(0, i),
                        ...state.slice(i + 1),
                    ];
                }
            }
            return state;
        case projectsConst.PROJECT_UPDATED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.project.id) {
                    return sortProjectsByUpdate([
                        ...state.slice(0, i),
                        action.project,
                        ...state.slice(i + 1),
                    ]);
                }
            }
            return state;
        default:
            return state;
    }
}
