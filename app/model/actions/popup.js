import * as popupConst from '../constants/popup';

export function showPopup(content) {
    return {
        type: popupConst.SHOW_POPUP,
        content,
    };
}

export function hidePopup() {
    return {
        type: popupConst.HIDE_POPUP,
    };
}
