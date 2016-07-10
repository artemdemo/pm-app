import * as notificationConst from '../constants/notification';

export default function notification(state = {}, action) {
    switch(action.type) {
        case notificationConst.ERROR_MSG:
        case notificationConst.SUCCESS_MSG:
            return {
                type: action.type,
                message: action.message,
            }
        case notificationConst.HIDE_MSG:
            return {
                type: action.type,
                message: state.message,
            }
        default:
            return state
    }
}
