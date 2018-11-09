import _isObject from 'lodash/isObject';

export const createReducer = (initState, actionsHandler) => {
    return function(state = initState, action) {
        if (actionsHandler.hasOwnProperty(action.type)) {
            const handler = actionsHandler[action.type];
            if (_isObject(handler)) {
                return {
                    ...state,
                    ...handler,
                }
            }
            return handler(state, action);
        }
        return state;
    }
};
