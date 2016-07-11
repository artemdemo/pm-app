import * as userConst from '../constants/user';
import { errorMessage, successMessage } from './notification';
import { history } from '../configs';
import { loadTasks } from './tasks';
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
function userAuthenticated(user, token) {
    return {
        type: userConst.USER_AUTHENTICATED,
        user,
        token,
    };
}

function authenticationError() {
    return {
        type: userConst.AUTHENTICATION_ERROR,
    };
}

function goToLoginPage(location) {
    let regex = /login|signup/;
    let redirectAfterLogin = location.pathname;
    let match = regex.exec(redirectAfterLogin);
    if (!match) {
        history.push(`/login?next=${redirectAfterLogin}`);
    }
}

export function checkAuthentication(location) {
    const token = window.localStorage.getItem(userConst.LS_ITEM_NAME);

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
                dispatch(userAuthenticated(userData, token));
                dispatch(loadTasks(token));
            })
            .catch(() => {
                window.localStorage.removeItem(userConst.LS_ITEM_NAME);
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
                if (user.remember) {
                    window.localStorage.setItem(userConst.LS_ITEM_NAME, token);
                }
                dispatch(successMessage('Welcome back!'));
                dispatch(userAuthenticated(userData, token));
            })
            .catch(() => {
                dispatch(errorMessage('Error login'));
            });
    };
}
