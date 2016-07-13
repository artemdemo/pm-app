import * as projectsConst from '../constants/projects';

export default function projects(state = [], action) {
    switch (action.type) {
        case projectsConst.PROJECTS_LOADED:
            return action.projects;
        default:
            return state;
    }
}
