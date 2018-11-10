import { errorMsg } from '../components/Notificator/Notificator';
import { logout } from '../model/auth/authActions';

export default function errorHandler(store) {
    return next => (action) => {
        const actionType = action.type.toString();
        if (actionType.includes('ERROR') || action.error) {
            if (!ENV.production) {
                console.warn(`%c📛️ %c${actionType}`, 'color: red; font-weight:bold;', 'font-weight:bold;');
                // eslint-disable-next-line no-console
                console.log(action.payload);
            }

            const errorMessage = (() => {
                if (action.payload.body && action.payload.body.message) {
                    return action.payload.body.message.toString();
                }
                return action.payload.message ? action.payload.message : action.payload.toString();
            })();

            const isCrossOriginError = action.payload.originalError &&
                action.payload.originalError.hasOwnProperty('status') &&
                action.payload.originalError.hasOwnProperty('crossDomain') &&
                action.payload.originalError.status === undefined &&
                action.payload.originalError.crossDomain === true;
            const isUnauthorized = action.payload.status === 401;

            if (!isCrossOriginError) {
                errorMsg(errorMessage);
            }
            if (isUnauthorized) {
                store.dispatch(logout());
            }
        }
        return next(action);
    };
}
