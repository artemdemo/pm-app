import { take, put, all } from 'redux-saga/effects';
import request, { clearDefaultHeaders } from '../../services/request';
import * as authActions from './authActions';
import auth, { Token } from '../../services/auth';
import * as location from '../../services/location';

function* userSaga() {
    while (true) {
        try {
            yield take(`${authActions.loadUser}`);
            const result = yield request
                .get('/api/user')
                .promise();
            yield put(authActions.loggedIn({
                email: result.body.email,
                username: result.body.username,
            }));
        } catch (err) {
            yield put(authActions.loginError(err));
        }
    }
}

function* loginSaga() {
    while (true) {
        try {
            const { data } = yield take(`${authActions.login}`);
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
            yield put(authActions.loggedIn({
                email: result.body.email,
                username: result.body.username,
            }));
        } catch (err) {
            yield put(authActions.loginError(err));
        }
    }
}

function* signupSaga() {
    while (true) {
        try {
            const { data } = yield take(`${authActions.signup}`);
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
            yield put(authActions.signedUp({
                email: result.body.email,
                username: result.body.username,
            }));
        } catch (err) {
            yield put(authActions.signupError(err));
        }
    }
}

function* logoutSaga() {
    while (true) {
        yield take(`${authActions.logout}`);
        auth.removeToken();
        clearDefaultHeaders();
        location.replace('/login');
    }
}

export default function* authSagas() {
    yield all([
        userSaga(),
        loginSaga(),
        logoutSaga(),
        signupSaga(),
    ]);
}
