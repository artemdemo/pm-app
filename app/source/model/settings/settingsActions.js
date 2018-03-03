import * as settingsConst from './settingsConst';
import { getStoredToken } from '../../utils/user';
import { errorMessage, successMessage } from '../notification/notificationActions';
import fetch from '../../utils/fetch';
import checkResponseStatus from '../../utils/checkResponseStatus';

function settingsLoaded(settings) {
    return {
        type: settingsConst.SETTINGS_LOADED,
        settings,
    };
}

function settingsUpdated(settings) {
    return {
        type: settingsConst.SETTINGS_UPDATED,
        settings,
    };
}

export function loadSettings() {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/api/settings', token)
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((settings) => {
                dispatch(settingsLoaded(settings));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while settings loading'));
            });
    };
}

/**
 * Update settings
 *
 * @param settingsUpdate {Object}
 */
export function updateSettings(settingsUpdate) {
    const token = getStoredToken();

    return (dispatch) => {
        fetch('/api/settings', token, {method: 'PUT', body: settingsUpdate})
            .then(checkResponseStatus)
            .then(response => response.json())
            .then((setting) => {
                dispatch(settingsUpdated(Object.assign({}, settingsUpdate, setting)));
                dispatch(successMessage('Project updated'));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while adding setting'));
            });
    };
}
