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
                    const task = action.task;
                    // If task is `done` it shouldn't be connected to any board
                    if (task.done) {
                        task.board_id = null;
                    }
                    return sortTasksByUpdate([
                        ...state.slice(0, i),
                        task,
                        ...state.slice(i + 1),
                    ]);
                }
            }
            return state;
        case tasksConst.UPDATE_TASK_POSITIONS_AFTER_DRAGGING:
            if (action.draggedTask) {
                const sortedTasks = state
                    .filter(task => task.board_id === action.boardId)
                    .sort(sortByIdPositionScrum);
                let boardTasks = [];

                for (let i = 0, len = sortedTasks.length; i < len; i++) {
                    if (sortedTasks[i].id !== action.draggedTask.id) {
                        if (sortedTasks[i].id === action.nearTaskId) {
                            const task = Object.assign(action.draggedTask, {
                                board_id: action.boardId,
                            });
                            if (action.position === 'before') {
                                boardTasks.push(task);
                                boardTasks.push(sortedTasks[i]);
                            } else {
                                boardTasks.push(sortedTasks[i]);
                                boardTasks.push(task);
                            }
                        } else {
                            boardTasks.push(sortedTasks[i]);
                        }
                    }
                }
                if (!action.nearTaskId) {
                    const task = Object.assign(action.draggedTask, {
                        board_id: action.boardId,
                    });
                    if (action.position === 'before') {
                        boardTasks.unshift(task);
                    } else {
                        boardTasks.push(task);
                    }
                }

                const newState = [];
                boardTasks = boardTasks.map((task, index) => Object.assign(task, {
                    id_position_scrum: index,
                }));

                state.forEach(task => {
                    let boardTaskAdded = false;
                    for (let i = 0, len = boardTasks.length; i < len; i++) {
                        if (task.id === boardTasks[i].id) {
                            boardTaskAdded = true;
                            newState.push(boardTasks[i]);
                        }
                    }
                    if (!boardTaskAdded) {
                        newState.push(task);
                    }
                });
                return newState;
            }
            return state;
        default:
            return state;
    }
}
