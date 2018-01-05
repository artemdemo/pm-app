import * as boardsConst from './boardsConst';
import { sortByIdPosition } from '../../utils/boards';

function sortBoardsByPosition(boardsList) {
    return boardsList.map((board, index) => Object.assign(board, {
        id_position: index,
    }));
}

export default function boards(state = [], action) {
    const boardsList = [];
    let newBoardAdded = false;

    switch (action.type) {
        case boardsConst.BOARDS_LOADED:
            return action.boards.sort(sortByIdPosition);
        case boardsConst.BOARDS_ADDED:
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
            return sortBoardsByPosition(boardsList);
        case boardsConst.BOARD_DELETED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (state[i].id === action.id) {
                    const boardsList = [
                        ...state.slice(0, i),
                        ...state.slice(i + 1),
                    ];
                    return sortBoardsByPosition(boardsList);
                }
            }
            return state;
        case boardsConst.BOARD_UPDATED:
            for (let i = 0, len = state.length; i < len; i++) {
                if (action.board.id_position === i) {
                    newBoardAdded = true;
                    boardsList.push(action.board);
                }
                if (state[i].id !== action.board.id) {
                    boardsList.push(state[i]);
                }
            }
            if (!newBoardAdded) {
                boardsList.push(action.board);
            }
            return sortBoardsByPosition(boardsList);
        default:
            return state;
    }
}
