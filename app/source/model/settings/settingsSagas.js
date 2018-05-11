import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as projectsConst from './settingsConst';
import {
    settingsLoaded,
    settingsLoadingError,
    settingsUpdated,
    settingsUpdatingError,
} from './settingsActions';

function* loadSettingsSaga() {
    while (true) {
        try {
            yield take(projectsConst.LOAD_SETTINGS);
            const result = yield request
                .get('/api/settings')
                .promise();
            yield put(settingsLoaded(result.body));
        } catch (err) {
            yield put(settingsLoadingError(err));
        }
    }
}

function* updateSettingsSaga() {
    while (true) {
        try {
            const { settings } = yield take(projectsConst.UPDATE_SETTINGS);
            const result = yield request
                .put('/api/settings')
                .send(settings)
                .promise();
            yield put(settingsUpdated(result.body));
        } catch (err) {
            yield put(settingsUpdatingError(err));
        }
    }
}


export default function* settingsSagas() {
    yield [
        loadSettingsSaga(),
        updateSettingsSaga(),
    ];
}
