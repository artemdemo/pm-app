import { errorMsg } from '../components/Notificator/Notificator';
import { logout } from '../model/auth/authActions';

export default function errorHandler(store) {
    return next => (action) => {
        const actionType = action.type.toString();
        if (actionType.includes('ERROR')) {
            if (!ENV.production) {
                console.warn(`%c📛️ %c${actionType}`, 'color: red; font-weight:bold;', 'font-weight:bold;');
                // eslint-disable-next-line no-console
                console.log(action.err);
            }

            const errorMessage = (() => {
                if (action.err.body && action.err.body.message) {
                    return action.err.body.message.toString();
                }
                return action.err.message ? action.err.message : action.err.toString();
            })();

            const isCrossOriginError = action.err.originalError &&
                action.err.originalError.hasOwnProperty('status') &&
                action.err.originalError.hasOwnProperty('crossDomain') &&
                action.err.originalError.status === undefined &&
                action.err.originalError.crossDomain === true;
            const isUnauthorized = action.err.status === 401;

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
