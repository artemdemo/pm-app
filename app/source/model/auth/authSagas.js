import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as authConst from './authConst';
import {
    loggedIn,
    loginError,
    signedUp,
    signupError,
} from './authActions';
import auth, { Token } from '../../services/auth';
import * as location from '../../services/location';

function* userSaga() {
    while (true) {
        try {
            yield take(authConst.LOAD_USER);
            const result = yield request
                .get('/api/user')
                .promise();
            yield put(loggedIn({
                email: result.body.email,
                username: result.body.username,
            }));
        } catch (err) {
            yield put(loginError(err));
        }
    }
}

function* loginSaga() {
    while (true) {
        try {
            const { data } = yield take(authConst.LOGIN);
            const result = yield request
                .put('/api/user/login')
                .send(data)
                .promise();
            const expires = (new Date()).getTime() + (result.body.expiration * 1000);
            const tokenInstance = new Token(
                result.headers.authorization,
                expires
            );
            auth.saveToken(tokenInstance);
            location.replace('/');
            yield put(loggedIn({
                email: result.body.email,
                username: result.body.username,
            }));
        } catch (err) {
            yield put(loginError(err));
        }
    }
}

function* signupSaga() {
    while (true) {
        try {
            const { data } = yield take(authConst.SIGNUP);
            const result = yield request
                .post('/api/user/signup')
                .send(data)
                .promise();
            const expires = (new Date()).getTime() + (result.body.expiration * 1000);
            const tokenInstance = new Token(
                result.headers.authorization,
                expires
            );
            auth.saveToken(tokenInstance);
            location.replace('/');
            yield put(signedUp({
                email: result.body.email,
                username: result.body.username,
            }));
        } catch (err) {
            yield put(signupError(err));
        }
    }
}

function* logoutSaga() {
    while (true) {
        yield take(authConst.LOGOUT);
        auth.removeToken();
        location.replace('/login');
    }
}

export default function* authSagas() {
    yield [
        userSaga(),
        loginSaga(),
        logoutSaga(),
        signupSaga(),
    ];
}
