import * as boardsActions from './boardsActions';
import { sortByIdPosition } from '../../utils/boards';

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

export default function boards(state = initState, action) {
    switch (action.type) {
        /*
         * Load
         */
        case `${boardsActions.loadBoards}`:
            return {
                ...state,
                loading: true
            };
        case `${boardsActions.boardsLoaded}`:
            return {
                ...state,
                data: action.boards.sort(sortByIdPosition),
                loading: false,
                loadingError: null,
            };
        case `${boardsActions.boardsLoadingError}`:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Add
         */
        case `${boardsActions.addBoard}`:
            return {
                ...state,
                adding: true,
            };
        case `${boardsActions.boardAdded}`:
            return {
                ...state,
                data: [
                    ...state.data,
                    action.board,
                ],
                adding: false,
                addingError: null,
            };
        case `${boardsActions.boardAddingError}`:
            return {
                ...state,
                adding: false,
                addingError: action.err,
            };
        /*
         * Update
         */
        case `${boardsActions.updateBoard}`:
            return {
                ...state,
                updating: true,
            };
        case `${boardsActions.boardUpdated}`:
            // After updating single board I'll request all list, since they whole order could change
            return {
                ...state,
                updating: false,
                updatingError: null,
            };
        case `${boardsActions.boardUpdatingError}`:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Delete
         */
        case `${boardsActions.deleteBoard}`:
            return {
                ...state,
                deleting: true,
            };
        case `${boardsActions.boardDeleted}`:
            return {
                ...state,
                data: state.data.filter(item => item.id !== action.id),
                deleting: true,
                deletingError: null,
            };
        case `${boardsActions.boardDeletingError}`:
            return {
                ...state,
                deleting: false,
                deletingError: action.err,
            };
        /*
         * Clear
         */
        case `${boardsActions.resetBoards}`:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
