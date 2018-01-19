import * as boardsConst from './boardsConst';
import { sortByIdPosition } from '../../utils/boards';

const initialState = {
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

export default function boards(state = initialState, action) {
    switch (action.type) {
        /*
         * Loading
         */
        case boardsConst.LOAD_BOARDS:
            return Object.assign({}, state, {loading: true});
        case boardsConst.BOARDS_LOADED:
            return Object.assign({}, state, {
                data: action.boards.sort(sortByIdPosition),
                loading: false,
                loadingError: null,
            });
        case boardsConst.BOARDS_LOADING_ERROR:
            return Object.assign({}, state, {
                loading: false,
                loadingError: action.err,
            });
        /*
         * Adding
         */
        case boardsConst.ADD_BOARD:
            return Object.assign({}, state, {adding: true});
        case boardsConst.BOARD_ADDED:
            return Object.assign({}, state, {
                data: [
                    ...state.data,
                    action.board,
                ],
                adding: false,
                addingError: null,
            });
        case boardsConst.BOARD_ADDING_ERROR:
            return Object.assign({}, state, {
                adding: false,
                addingError: action.err,
            });
        /*
         * Updating
         */
        case boardsConst.UPDATE_BOARD:
            return Object.assign({}, state, {updating: true});
        case boardsConst.BOARD_UPDATED:
            return Object.assign({}, state, {
                data: state.data.map((item) => {
                    if (item.id === action.board.id) {
                        return action.board;
                    }
                    return item;
                }),
                updating: false,
                updatingError: null,
            });
        case boardsConst.BOARD_UPDATING_ERROR:
            return Object.assign({}, state, {
                updating: false,
                updatingError: action.err,
            });
        /*
         * Deleting
         */
        case boardsConst.DELETE_BOARD:
            return Object.assign({}, state, {deleting: true});
        case boardsConst.BOARD_DELETED:
            return Object.assign({}, state, {
                data: state.data.filter(item => item.id !== action.id),
                deleting: true,
                deletingError: null,
            });
        case boardsConst.BOARD_DELETING_ERROR:
            return Object.assign({}, state, {
                deleting: false,
                deletingError: action.err,
            });
        default:
            return state;
    }
}
