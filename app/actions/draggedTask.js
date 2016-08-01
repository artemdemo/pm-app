import * as draggedTaskConst from '../constants/draggedTask';

export function setDraggedTask(task) {
    return {
        type: draggedTaskConst.SET_DRAGGED_TASK,
        task,
    };
}

export function dropDraggedTask() {
    return {
        type: draggedTaskConst.DROP_DRAGGED_TASK,
    };
}

/**
 * Set position of the task after it dropped
 * @param nearTaskId {Number} - next to this task dragged one should be placed
 * @param position {String} - where to place it: `before` or `after`
 */
export function setDraggedTaskDropPosition(nearTaskId, position) {
    return {
        type: draggedTaskConst.SET_DRAGGED_TASK_POSITION,
        nearTaskId,
        position,
    };
}
