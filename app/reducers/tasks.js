import * as tasksConst from '../constants/tasks';

function sortTasksByUpdate(inTasks = []) {
    const sortedByUpdate = inTasks.sort((taskA, taskB) => {
        if (taskA.updated > taskB.updated) {
            return -1;
        }
        if (taskA.updated < taskB.updated) {
            return 1;
        }
        return 0;
    });
    const undoneTasks = [];
    const doneTasks = [];
    sortedByUpdate.forEach((task) => {
        if (task.done) {
            doneTasks.push(task);
        } else {
            undoneTasks.push(task);
        }
    });
    return undoneTasks.concat(doneTasks);
}

export default function tasks(state = [], action) {
    switch (action.type) {
        case tasksConst.TASKS_LOADED:
            return sortTasksByUpdate(action.tasks);
        case tasksConst.TASKS_ADDED:
            return [action.task].concat(state);
        case tasksConst.TASK_DELETED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.id) {
                    return [
                        ...state.slice(0, i),
                        ...state.slice(i + 1),
                    ];
                }
            }
            return state;
        case tasksConst.TASK_UPDATED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.task.id) {
                    return sortTasksByUpdate([
                        ...state.slice(0, i),
                        action.task,
                        ...state.slice(i + 1),
                    ]);
                }
            }
            return state;
        default:
            return state;
    }
}
