import * as boardsConst from '../constants/boards';

export default function boards(state = [], action) {
    switch (action.type) {
        case boardsConst.BOARDS_LOADED:
            return action.boards;
        case boardsConst.BOARDS_ADDED:
            return state.concat(action.board);
        case boardsConst.BOARD_DELETED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.id) {
                    return [
                        ...state.slice(0, i),
                        ...state.slice(i + 1),
                    ];
                }
            }
            return state;
        case boardsConst.BOARD_UPDATED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.board.id) {
                    return [
                        ...state.slice(0, i),
                        action.board,
                        ...state.slice(i + 1),
                    ];
                }
            }
            return state;
        default:
            return state;
    }
}
