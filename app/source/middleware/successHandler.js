import changeCase from 'change-case';
import { successMsg } from '../components/Notificator/Notificator';

export default function successHandler() {
    return next => (action) => {
        const actionType = action.type.toString();
        if (
            actionType.includes('DELETED') ||
            actionType.includes('UPDATED') ||
            actionType.includes('CREATED') ||
            actionType.includes('ADDED') ||
            actionType.includes('REMOVED')
        ) {
            if (actionType !== null) {
                successMsg(changeCase.sentenceCase(actionType));
            }
        }
        return next(action);
    };
}
