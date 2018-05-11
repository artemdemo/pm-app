import * as tasksConst from './tasksConst';
import { sortByIdPositionScrum } from '../../utils/tasks';

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
    updatingPosition: false,
    updatingPositionError: null,
};

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
    return [
        ...undoneTasks,
        ...doneTasks,
    ];
}

export default function tasksReducer(state = initState, action) {
    switch (action.type) {
        /*
         * Loading
         */
        case tasksConst.LOAD_TASKS:
            return {
                ...state,
                loading: true,
            };
        case tasksConst.TASKS_LOADED:
            return {
                ...state,
                // ToDo: Why need to sort here? Can't it came sorted from the server?
                data: sortTasksByUpdate(action.tasks),
                loading: false,
                loadingError: null,
            };
        case tasksConst.TASKS_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Adding
         */
        case tasksConst.ADD_TASK:
            return {
                ...state,
                adding: true,
            };
        case tasksConst.TASK_ADDED:
            return {
                ...state,
                data: [
                    action.task,
                    ...state.data,
                ],
                adding: false,
                addingError: null,
            };
        case tasksConst.TASK_ADDING_ERROR:
            return {
                ...state,
                adding: false,
                addingError: action.err,
            };
        /*
         * Updating
         */
        case tasksConst.UPDATE_TASK:
            return {
                ...state,
                updating: true,
            };
        case tasksConst.TASK_UPDATED:
            return {
                ...state,
                data: sortTasksByUpdate(state.data.map((task) => {
                    if (task.id === action.task.id) {
                        return Object.assign(
                            {},
                            action.task,
                            // If task is `done` it shouldn't be connected to any board
                            task.done ? {board_id: null} : null
                        );
                    }
                    return task;
                })),
                updating: false,
                updatingError: null,
            };
        case tasksConst.TASK_UPDATING_ERROR:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Deleting
         */
        /*
         * Loading
         */
        /*
         * Updating position
         */
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
        // case tasksConst.TASK_UPDATED:
        //     for (let i = 0, len = state.length; i < len; i++) {
        //         const { task } = action;
        //         if (state[i].id === task.id) {
        //             // If task is `done` it shouldn't be connected to any board
        //             if (task.done) {
        //                 task.board_id = null;
        //             }
        //             return sortTasksByUpdate([
        //                 ...state.slice(0, i),
        //                 task,
        //                 ...state.slice(i + 1),
        //             ]);
        //         }
        //     }
        //     return state;
        case tasksConst.UPDATE_TASK_POSITIONS_AFTER_DRAGGING:
            if (action.draggedTask) {
                const sortedTasks = state
                    .filter(task => task.board_id === action.boardId && task.id !== action.draggedTask.id)
                    .sort(sortByIdPositionScrum);
                let boardTasks = [];

                for (let i = 0, len = sortedTasks.length; i < len; i++) {
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

                boardTasks = boardTasks.map((task, index) => Object.assign(task, {
                    id_position_scrum: index,
                }));

                return sortTasksByUpdate(state
                    .filter(task => task.board_id !== action.boardId && task.id !== action.draggedTask.id)
                    .concat(boardTasks));
            }
            return state;
        default:
            return state;
    }
}
