import * as selectedEntityConst from '../constants/selectedEntity';

export default function(state = {}, action) {
    switch (action.type) {
        case selectedEntityConst.SET_SELECTED_ENTITY:
            return {
                entity: action.entity,
                type: action.entityType,
            };
        case selectedEntityConst.CLEAR_SELECTED_ENTITY:
            if (state && state.type === action.entityType) {
                return {};
            }
            return state;
        default:
            return state;
    }
}
