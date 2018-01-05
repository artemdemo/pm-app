import * as modalConst from './modalConst';

export function showModal(content) {
    return {
        type: modalConst.SHOW_MODAL,
        content,
    };
}

export function hideModal() {
    return {
        type: modalConst.HIDE_MODAL,
    };
}
