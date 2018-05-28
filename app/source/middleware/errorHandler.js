import { NOTIFICATION_STATUSES } from '../model/notifications/notificationsConstants';
import { sendNotification } from '../model/notifications/notificationsActions';
import { logout } from '../model/user/userActions';

export default function errorHandler(store) {
    return next => (action) => {
        const actionType = action.type.toString();
        if (actionType.includes('ERROR')) {
            if (!ENV.production) {
                console.warn(`%c📛️ %c${actionType}`, 'color: red; font-weight:bold;', 'font-weight:bold;');
                // eslint-disable-next-line no-console
                console.log(action.error);
            }

            const errorMessage = (() => {
                if (action.error.body && action.error.body.message) {
                    return action.error.body.message.toString();
                }
                return action.error.message ? action.error.message : action.error.toString();
            })();

            const isCrossOriginError = action.error.originalError &&
                action.error.originalError.hasOwnProperty('status') &&
                action.error.originalError.hasOwnProperty('crossDomain') &&
                action.error.originalError.status === undefined &&
                action.error.originalError.crossDomain === true;
            const isUnauthorized = action.error.status === 401;
            if (!isCrossOriginError && !isUnauthorized) {
                store.dispatch(sendNotification(errorMessage, NOTIFICATION_STATUSES.DANGER));
            }
            if (isUnauthorized) {
                store.dispatch(logout());
            }
        }
        return next(action);
    };
}
