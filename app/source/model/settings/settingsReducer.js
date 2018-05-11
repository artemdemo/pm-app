import * as settingsConst from './settingsConst';

const initState = {
    data: {},
    loading: false,
    updating: false,
};

export default function settings(state = initState, action) {
    switch (action.type) {
        case settingsConst.LOAD_SETTINGS:
            return {
                ...state,
                loading: true,
            };
        case settingsConst.SETTINGS_LOADED:
            return Object.assign({}, action.settings);
        case settingsConst.SETTINGS_UPDATED:
            return Object.assign({}, state, action.settings);
        default:
            return state;
    }
}
