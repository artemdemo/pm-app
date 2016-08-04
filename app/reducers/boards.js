import * as boardsConst from '../constants/boards';
import { sortByIdPosition } from '../utils/boards';

export default function boards(state = [], action) {
    switch (action.type) {
        case boardsConst.BOARDS_LOADED:
            return action.boards.sort(sortByIdPosition);
        case boardsConst.BOARDS_ADDED:
            const boardsList = [];
            let newBoardAdded = false;
            state.forEach((board, i) => {
                if (action.board.id_position === i) {
                    newBoardAdded = true;
                    boardsList.push(action.board);
                }
                boardsList.push(board);
            });
            if (!newBoardAdded) {
                boardsList.push(action.board);
            }
            return boardsList.map((board, index) => Object.assign(board, {
                id_position: index,
            }));
        case boardsConst.BOARD_DELETED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.id) {
                    const boardsList = [
                        ...state.slice(0, i),
                        ...state.slice(i + 1),
                    ];
                    return boardsList.map((board, index) => Object.assign(board, {
                        id_position: index,
                    }));
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
