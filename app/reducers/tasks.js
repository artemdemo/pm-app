import * as tasksConst from '../constants/tasks';

export default function tasks(state = [], action) {
    switch (action.type) {
        case tasksConst.TASKS_LOADED:
            return action.tasks;
        default:
            return state;
    }
}
