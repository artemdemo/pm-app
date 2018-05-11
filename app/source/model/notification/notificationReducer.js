import * as notificationConst from './notificationConst';

const initState = {
    type: notificationConst.HIDE_MSG,
    message: '',
};

export default function notification(state = initState, action) {
    switch (action.type) {
        case notificationConst.ERROR_MSG:
        case notificationConst.SUCCESS_MSG:
            return {
                ...state,
                type: action.type,
                message: action.message,
            };
        case notificationConst.HIDE_MSG:
            return {
                ...state,
                type: action.type,
            };
        default:
            return state;
    }
}
