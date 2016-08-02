import * as tasksConst from '../constants/tasks';
import { sortByIdPositionScrum } from '../utils/tasks';

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
        case tasksConst.UPDATE_TASK_POSITIONS_AFTER_DRAGGING:
            if (action.draggedTask) {
                const sortedTasks = state.sort(sortByIdPositionScrum);
                const newState = [];

                for (let i = 0, len = sortedTasks.length; i < len; i++) {
                    if (sortedTasks[i].id !== action.draggedTask.task.id) {
                        if (sortedTasks[i].id === action.draggedTask.nearTaskId) {
                            if (action.draggedTask.position === 'before') {
                                newState.push(sortedTasks[i]);
                                newState.push(action.draggedTask.task);
                            } else {
                                newState.push(action.draggedTask.task);
                                newState.push(sortedTasks[i]);
                            }
                        } else {
                            newState.push(sortedTasks[i]);
                        }
                    }
                }
                return newState.map((task, index) => Object.assign(task, {
                    id_position_scrum: index,
                }));
            }
            return state;
        default:
            return state;
    }
}
