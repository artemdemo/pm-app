import * as tasksActions from './tasksActions';
import { sortByIdPositionScrum } from '../../utils/tasks';

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
        case `${tasksActions.loadTasks}`:
            return {
                ...state,
                loading: true,
            };
        case `${tasksActions.tasksLoaded}`:
            return {
                ...state,
                // ToDo: Why need to sort here? Can't it came sorted from the server?
                data: sortTasksByUpdate(action.tasks),
                loading: false,
                loadingError: null,
            };
        case `${tasksActions.tasksLoadingError}`:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Load single task
         */
        case `${tasksActions.loadSingleTask}`:
            return {
                ...state,
                singleData: {},
                loadingSingle: true,
            };
        case `${tasksActions.singleTaskLoaded}`:
            return {
                ...state,
                singleData: action.data,
                loadingSingle: false,
            };
        case  `${tasksActions.singleTasksLoadingError}`:
            return {
                ...state,
                loadingSingle: false,
                loadingSingleError: action.err,
            };
        /*
         * Adding
         */
        case `${tasksActions.addTask}`:
            return {
                ...state,
                adding: true,
            };
        case `${tasksActions.taskAdded}`:
            return {
                ...state,
                data: [
                    action.task,
                    ...state.data,
                ],
                adding: false,
                addingError: null,
            };
        case `${tasksActions.taskAddingError}`:
            return {
                ...state,
                adding: false,
                addingError: action.err,
            };
        /*
         * Updating
         */
        case `${tasksActions.updateTask}`:
            return {
                ...state,
                updating: true,
            };
        case `${tasksActions.taskUpdated}`:
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
        case `${tasksActions.taskUpdatingError}`:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Deleting
         */
        case `${tasksActions.deleteTask}`:
            return {
                ...state,
                deleting: true,
            };
        case `${tasksActions.taskDeleted}`:
            return {
                ...state,
                data: state.data.filter(task => task.id !== action.id),
                deleting: false,
                deletingError: null,
            };
        case `${tasksActions.taskDeletingError}`:
            return {
                ...state,
                deleting: false,
                deletingError: action.err,
            };
        /*
         * Updating position
         */
        case `${tasksActions.updateTaskPosition}`:
            if (action.draggedTask) {
                const sortedTasks = state
                    .data
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

                return {
                    ...state,
                    data: sortTasksByUpdate(state
                        .data
                        .filter(task => task.board_id !== action.boardId && task.id !== action.draggedTask.id)
                        .concat(boardTasks)),
                };
            }
            return {
                ...state,
            };
        /*
         * Reset task
         */
        case `${tasksActions.resetTasks}`:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
