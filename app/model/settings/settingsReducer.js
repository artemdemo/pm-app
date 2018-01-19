import * as settingsConst from './settingsConst';

export default function settings(state = {}, action) {
    switch (action.type) {
        case settingsConst.SETTINGS_LOADED:
            return Object.assign({}, action.settings);
        case settingsConst.SETTINGS_UPDATED:
            return Object.assign({}, state, action.settings);
        default:
            return state;
    }
}
