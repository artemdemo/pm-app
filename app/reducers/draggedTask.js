import * as draggedTaskConst from '../constants/draggedTask';

export default function setDraggedTask(state = {}, action) {
    switch (action.type) {
        case draggedTaskConst.SET_DRAGGED_TASK:
            return {
                task: action.task,
                ...state,
            };
        case draggedTaskConst.SET_DRAGGED_TASK_POSITION:
            return {
                nearTaskId: action.nearTaskId,
                position: action.position,
                ...state,
            };
        case draggedTaskConst.DROP_DRAGGED_TASK:
            return {};
        default:
            return state;
    }
}
