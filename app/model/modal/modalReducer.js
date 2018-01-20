import * as modalConst from './modalConst';

const initialState = {
    content: null,
};

export default function modal(state = initialState, action) {
    switch (action.type) {
        case modalConst.HIDE_MODAL:
            return Object.assign({}, state, {
                content: null,
            });
        case modalConst.SHOW_MODAL:
            return Object.assign({}, state, {
                content: action.content,
            });
        default:
            return state;
    }
}
