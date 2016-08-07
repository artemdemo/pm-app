import * as draggedTaskConst from '../constants/draggedTask';

/**
 * draggedTask reduced
 * @param state {Array}
 * @param action {Object}
 * @param action.task {Object}
 * @param action.nearTaskId {Number}
 * @param action.position {String} - `before` or `after`
 * @param action.boardId {Number}
 * @returns {*}
 */
export default function draggedTask(state = null, action) {
    switch (action.type) {
        case draggedTaskConst.SET_DRAGGED_TASK:
            return Object.assign({}, state, {
                task: action.task,
            });
        case draggedTaskConst.SET_DRAGGED_TASK_POSITION:
            return Object.assign({}, state, {
                nearTaskId: action.nearTaskId,
                position: action.position,
                boardId: action.boardId,
            });
        case draggedTaskConst.DROP_DRAGGED_TASK:
            return null;
        default:
            return state;
    }
}
