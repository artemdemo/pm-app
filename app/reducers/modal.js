import * as modalConst from '../constants/modal';

export default function modal(state = {}, action) {
    switch (action.type) {
        case modalConst.HIDE_MODAL:
            return {
                type: modalConst.HIDE_MODAL,
            };
        case modalConst.SHOW_MODAL:
            return {
                type: modalConst.SHOW_MODAL,
                content: action.content,
            };
        default:
            return state;
    }
}
