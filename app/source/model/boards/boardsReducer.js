import * as boardsConst from './boardsConst';
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
        case boardsConst.LOAD_BOARDS:
            return {
                ...state,
                loading: true
            };
        case boardsConst.BOARDS_LOADED:
            return {
                ...state,
                data: action.boards.sort(sortByIdPosition),
                loading: false,
                loadingError: null,
            };
        case boardsConst.BOARDS_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Add
         */
        case boardsConst.ADD_BOARD:
            return {
                ...state,
                adding: true,
            };
        case boardsConst.BOARD_ADDED:
            return {
                ...state,
                data: [
                    ...state.data,
                    action.board,
                ],
                adding: false,
                addingError: null,
            };
        case boardsConst.BOARD_ADDING_ERROR:
            return {
                ...state,
                adding: false,
                addingError: action.err,
            };
        /*
         * Update
         */
        case boardsConst.UPDATE_BOARD:
            return {
                ...state,
                updating: true,
            };
        case boardsConst.BOARD_UPDATED:
            // After updating single board I'll request all list, since they whole order could change
            return {
                ...state,
                updating: false,
                updatingError: null,
            };
        case boardsConst.BOARD_UPDATING_ERROR:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Delete
         */
        case boardsConst.DELETE_BOARD:
            return {
                ...state,
                deleting: true,
            };
        case boardsConst.BOARD_DELETED:
            return {
                ...state,
                data: state.data.filter(item => item.id !== action.id),
                deleting: true,
                deletingError: null,
            };
        case boardsConst.BOARD_DELETING_ERROR:
            return {
                ...state,
                deleting: false,
                deletingError: action.err,
            };
        /*
         * Clear
         */
        case boardsConst.RESET_BOARDS:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
