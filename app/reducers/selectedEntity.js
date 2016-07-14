import * as selectedEntityConst from '../constants/selectedEntity';

export default function(state = null, action) {
    switch (action.type) {
        case selectedEntityConst.SET_SELECTED_ENTITY:
            return action.entity;
        case selectedEntityConst.CLEAR_SELECTED_ENTITY:
            return null;
        default:
            return state;
    }
}
