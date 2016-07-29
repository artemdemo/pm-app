import * as entityConst from '../constants/selectedEntity';

export function clearEntity(entityType) {
    return {
        type: entityConst.CLEAR_SELECTED_ENTITY,
        entityType,
    };
}

export function selectTask(entity) {
    return {
        type: entityConst.SET_SELECTED_ENTITY,
        entityType: entityConst.ENTITY_TASK,
        entity,
    };
}

export function selectProject(entity) {
    return {
        type: entityConst.SET_SELECTED_ENTITY,
        entityType: entityConst.ENTITY_PROJECT,
        entity,
    };
}
