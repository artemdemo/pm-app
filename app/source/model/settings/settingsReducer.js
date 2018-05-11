import * as settingsConst from './settingsConst';

const initState = {
    data: {},
    loading: false,
    loadingError: null,
    updating: false,
    updatingError: null,
};

export default function settings(state = initState, action) {
    switch (action.type) {
        /*
         * Loading
         */
        case settingsConst.LOAD_SETTINGS:
            return {
                ...state,
                loading: true,
            };
        case settingsConst.SETTINGS_LOADED:
            return {
                ...state,
                data: action.settings,
                loading: false,
                loadingError: null,
            };
        case settingsConst.SETTINGS_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Updating
         */
        case settingsConst.UPDATE_SETTINGS:
            return {
                ...state,
                updating: true,
            };
        case settingsConst.SETTINGS_UPDATED:
            return {
                ...state,
                data: action.settings,
                updating: false,
                updatingError: null,
            };
        case settingsConst.SETTINGS_UPDATING_ERROR:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        default:
            return state;
    }
}
