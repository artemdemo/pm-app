import _get from 'lodash/get';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isFunction from 'lodash/isFunction';

export const createReducer = (initState, actionsHandler) => {
    return function(state = initState, action) {
        const type = _get(action, 'type');
        if (type && actionsHandler.hasOwnProperty(type)) {
            const handler = actionsHandler[action.type];
            if (_isFunction(handler)) {
                return handler(state, action);
            }
            // Array in js is also an object, therefore I can't just check that given handler is object
            // I also want ot be sure that it's not an array
            //
            if (!_isArray(handler) && _isObject(handler)) {
                return {
                    ...state,
                    ...handler,
                }
            }
            throw new Error('action handler should be an object or a function');
        }
        return state;
    }
};
