import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as authConst from './authConst';
import {
    loggedIn,
    loginError,
} from './authAction';

function* loginSaga() {
    while (true) {
        try {
            const { loginUser } = yield take(authConst.LOGIN);
            const result = yield request
                .put('/api/login')
                .send(loginUser)
                .promise();
            yield put(loggedIn(result.body));
        } catch (err) {
            yield put(loginError(err));
        }
    }
}

export default function* authSagas() {
    yield [
        loginSaga(),
    ];
}
