import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as authConst from './authConst';
import {
    loggedIn,
    loginError,
} from './authAction';
import auth, { Token } from '../../services/auth';
import * as location from '../../services/location';

function* loginSaga() {
    while (true) {
        try {
            const { loginUser } = yield take(authConst.LOGIN);
            const result = yield request
                .put('/api/login')
                .send(loginUser)
                .promise();
            const expires = (new Date()).getTime() + (result.body.expiration * 1000);
            const tokenInstance = new Token(
                result.headers.authorization,
                expires
            );
            auth.saveToken(tokenInstance);
            location.replace('/');
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
