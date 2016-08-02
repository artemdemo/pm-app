import * as popupConst from '../constants/popup';

export default function popup(state = {}, action) {
    switch (action.type) {
        case popupConst.HIDE_POPUP:
            return {
                type: popupConst.HIDE_POPUP,
            };
        case popupConst.SHOW_POPUP:
            return {
                type: popupConst.SHOW_POPUP,
                content: action.content,
            };
        default:
            return state;
    }
}
