import { createAction } from '../../services/actionCreator';

/*
 * Load
 */
export const loadSettings = createAction('LOAD_SETTINGS');
export const settingsLoaded = createAction('SETTINGS_LOADED', settings => ({ settings }));
export const settingsLoadingError = createAction('SETTINGS_LOADING_ERROR', (err = true) => ({ err }));

/*
 * Update
 */
export const updateSettings = createAction('UPDATE_SETTINGS', settings => ({ settings }));
export const settingsUpdated = createAction('SETTINGS_UPDATED', settings => ({ settings }));
export const settingsUpdatingError = createAction('SETTINGS_UPDATING_ERROR', (err = true) => ({ err }));

/*
 * Reset
 */
export const resetSettings = createAction('RESET_SETTINGS');
