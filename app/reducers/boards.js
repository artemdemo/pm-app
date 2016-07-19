import * as boardsConst from '../constants/boards';

export default function boards(state = [], action) {
    switch (action.type) {
        case boardsConst.BOARDS_LOADED:
            return action.boards;
        default:
            return state;
    }
}
