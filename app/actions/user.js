import * as userConst from '../constants/user';
import { errorMessage, successMessage } from './notification';
import { history } from '../configs';
import { loadTasks } from './tasks';
import { loadBoards } from './boards';
import { loadProjects } from './projects';
import { storeToken, getStoredToken, removeStoredToken } from '../utils/user';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

/**
 * User authenticated
 * @param user {Object}
 * @param user.username {String}
 * @param user.email {String}
 * @param user.token {String}
 * @param user.added {String}
 * @param user.updated {String}
 * @param token {String}
 */
function userAuthenticated(user) {
    return {
        type: userConst.USER_AUTHENTICATED,
        user,
    };
}

function authenticationError() {
    return {
        type: userConst.AUTHENTICATION_ERROR,
    };
}

function goToLoginPage(location) {
    const regex = /login|signup/;
    const redirectAfterLogin = location && location.pathname;
    const match = regex.exec(redirectAfterLogin);
    let loginPagePath = '/login';
    if (redirectAfterLogin) {
        loginPagePath += `?next=${redirectAfterLogin}`;
    }
    if (!match) {
        history.push(loginPagePath);
    }
}

export function checkAuthentication(location) {
    const token = getStoredToken();

    if (!token) {
        goToLoginPage(location);
        return errorMessage('Please, login');
    }

    return dispatch => {
        fetch('/user', token)
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((userData) => {
                dispatch(successMessage('Welcome back!'));
                dispatch(userAuthenticated(userData));
                dispatch(loadTasks());
                dispatch(loadBoards());
                dispatch(loadProjects());
            })
            .catch(() => {
                removeStoredToken();
                dispatch(errorMessage('Please, login'));
                dispatch(authenticationError());
                goToLoginPage(location);
            });
    };
}

/**
 * Login
 * @param user {Object}
 * @param user.email {String}
 * @param user.password {String}
 * @param user.remember {Boolean}
 */
export function login(user) {
    return dispatch => {
        let token;
        fetch('/login', null, {method: 'PUT', body: user})
            .then(checkResponseStatus)
            .then((response) => {
                token = response.headers.get('authorization');
                return response.json();
            })
            .then((userData) => {
                storeToken(token, user.remember);
                dispatch(successMessage('Welcome back!'));
                dispatch(userAuthenticated(userData, token));
            })
            .catch(() => {
                dispatch(errorMessage('Error login'));
            });
    };
}

export function logout() {
    removeStoredToken();
    goToLoginPage();

    return dispatch => {
        dispatch(successMessage('Logged out'));
    };
}
