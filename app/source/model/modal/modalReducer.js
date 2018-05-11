import * as modalConst from './modalConst';

const initState = {
    content: null,
};

export default function modal(state = initState, action) {
    switch (action.type) {
        case modalConst.HIDE_MODAL:
            return {
                ...state,
                content: null,
            };
        case modalConst.SHOW_MODAL:
            return {
                ...state,
                content: action.content,
            };
        default:
            return state;
    }
}
