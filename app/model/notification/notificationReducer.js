import * as notificationConst from './notificationConst';

const initialState = {
    type: notificationConst.HIDE_MSG,
    message: '',
};

export default function notification(state = initialState, action) {
    switch (action.type) {
        case notificationConst.ERROR_MSG:
        case notificationConst.SUCCESS_MSG:
            return Object.assign({}, state, {
                type: action.type,
                message: action.message,
            });
        case notificationConst.HIDE_MSG:
            return Object.assign({}, state, {
                type: action.type,
            });
        default:
            return state;
    }
}
