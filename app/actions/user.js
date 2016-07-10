import * as userConst from '../constants/user';
import { errorMessage, successMessage } from './notification';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

const LS_ITEM_NAME = 'pm-token';

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

export function checkAuthentication() {
    const token = window.localStorage.getItem(LS_ITEM_NAME);

    if (!token) {
        return errorMessage('Please, login');
    }

    return dispatch => {
        fetch('/user', token)
            .then((response) => {
                if (response.status >= 400) {
                    window.localStorage.removeItem(LS_ITEM_NAME);
                    dispatch(errorMessage('Please, login'));
                    dispatch(authenticationError());
                } else {
                    dispatch(successMessage('Welcome back!'));
                    dispatch(userAuthenticated(response.json()));
                }
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
                    window.localStorage.setItem(LS_ITEM_NAME, token);
                }
                dispatch(successMessage('Welcome back!'));
                dispatch(userAuthenticated(userData, token));
            });
    };
}
