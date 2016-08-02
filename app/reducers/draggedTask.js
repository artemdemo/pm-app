import * as draggedTaskConst from '../constants/draggedTask';

export default function setDraggedTask(state = null, action) {
    switch (action.type) {
        case draggedTaskConst.SET_DRAGGED_TASK:
            return Object.assign({}, state, {
                task: action.task,
            });
        case draggedTaskConst.SET_DRAGGED_TASK_POSITION:
            return Object.assign({}, state, {
                nearTaskId: action.nearTaskId,
                position: action.position,
            });
        case draggedTaskConst.DROP_DRAGGED_TASK:
            return null;
        default:
            return state;
    }
}
