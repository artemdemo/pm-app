import * as boardsConst from './boardsConst';
import { sortByIdPosition } from '../../utils/boards';

function sortBoardsByPosition(boardsList) {
    return boardsList.map((board, index) => Object.assign(board, {
        id_position: index,
    }));
}

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
        case boardsConst.BOARDS_ADDED:
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
            let updatedBoardId;
            for (let i = 0, len = state.data.length; i < len; i++) {
                if (state.data[i].id !== action.board.id) {
                    updatedBoardId = i;
                }
            }
            return Object.assign({}, state, {
                data: [
                    ...state.data.slice(0, updatedBoardId),
                    action.board,
                    ...state.data.slice(updatedBoardId + 1),
                ],
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
            let deletedBoardId;
            for (let i = 0, len = state.data.length; i < len; i++) {
                if (state.data[i].id === action.id) {
                    deletedBoardId = i;
                }
            }
            return Object.assign({}, state, {
                data: [
                    ...state.data.slice(0, deletedBoardId),
                    ...state.data.slice(deletedBoardId + 1),
                ],
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
