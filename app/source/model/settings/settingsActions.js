import * as settingsConst from './settingsConst';

/*
 * Load
 */

export function loadSettings() {
    return {
        type: settingsConst.LOAD_SETTINGS,
    };
}

export function settingsLoaded(settings) {
    return {
        type: settingsConst.SETTINGS_LOADED,
        settings,
    };
}

export function settingsLoadingError(err = true) {
    return {
        type: settingsConst.SETTINGS_LOADING_ERROR,
        err,
    };
}

/*
 * Update
 */

export function updateSettings(settings) {
    return {
        type: settingsConst.UPDATE_SETTINGS,
        settings,
    };
}

export function settingsUpdated(settings) {
    return {
        type: settingsConst.SETTINGS_UPDATED,
        settings,
    };
}

export function settingsUpdatingError(err = true) {
    return {
        type: settingsConst.SETTINGS_UPDATING_ERROR,
        err,
    };
}

/*
 * Reset
 */

export function resetSettings() {
    return {
        type: settingsConst.RESET_SETTINGS,
    }
}
