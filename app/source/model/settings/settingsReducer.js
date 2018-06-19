import * as settingsActions from './settingsActions';

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
        case `${settingsActions.loadSettings}`:
            return {
                ...state,
                loading: true,
            };
        case `${settingsActions.settingsLoaded}`:
            return {
                ...state,
                data: action.settings,
                loading: false,
                loadingError: null,
            };
        case `${settingsActions.settingsLoadingError}`:
            return {
                ...state,
                loading: false,
                loadingError: action.err,
            };
        /*
         * Updating
         */
        case `${settingsActions.updateSettings}`:
            return {
                ...state,
                updating: true,
            };
        case `${settingsActions.settingsUpdated}`:
            return {
                ...state,
                data: action.settings,
                updating: false,
                updatingError: null,
            };
        case `${settingsActions.settingsUpdatingError}`:
            return {
                ...state,
                updating: false,
                updatingError: action.err,
            };
        /*
         * Reset
         */
        case `${settingsActions.resetSettings}`:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
