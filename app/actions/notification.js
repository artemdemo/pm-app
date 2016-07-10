import * as notificationConst from '../constants/notification';

export function hideNotification() {
    return {
        type: notificationConst.HIDE_MSG,
    }
}

export function errorMessage(message) {
    return {
        type: notificationConst.ERROR_MSG,
        message,
    }
}

export function successMessage(message) {
    return {
        type: notificationConst.SUCCESS_MSG,
        message,
    }
}
