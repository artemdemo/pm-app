import * as selectedEntityConst from '../constants/selectedEntity';

export default function(state = null, action) {
    switch (action.type) {
        case selectedEntityConst.SET_SELECTED_ENTITY:
            return {
                entity: action.entity,
                type: action.entityType,
            };
        case selectedEntityConst.CLEAR_SELECTED_ENTITY:
            if (state.type === action.entityType) {
                return null;
            }
            return state;
        default:
            return state;
    }
}
