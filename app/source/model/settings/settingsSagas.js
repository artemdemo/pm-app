import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as settingsActions from './settingsActions';

function* loadSettingsSaga() {
    while (true) {
        try {
            yield take(settingsActions.loadSettings);
            const result = yield request
                .get('/api/settings')
                .promise();
            yield put(settingsActions.settingsLoaded(result.body));
        } catch (err) {
            yield put(settingsActions.settingsLoadingError(err));
        }
    }
}

function* updateSettingsSaga() {
    while (true) {
        try {
            const { settings } = yield take(settingsActions.updateSettings);
            const result = yield request
                .put('/api/settings')
                .send(settings)
                .promise();
            yield put(settingsActions.settingsUpdated(result.body));
        } catch (err) {
            yield put(settingsActions.settingsUpdatingError(err));
        }
    }
}


export default function* settingsSagas() {
    yield [
        loadSettingsSaga(),
        updateSettingsSaga(),
    ];
}
