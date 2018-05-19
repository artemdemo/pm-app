import * as authConst from './authConst';

/*
 * Login
 */

/**
 * @param loginUser {LoginUser}
 */
export function login(loginUser) {
    return {
        type: authConst.LOGIN,
        loginUser,
    }
}

export function loggedIn(data) {
    return {
        type: authConst.LOGGED_IN,
        data,
    }
}

export function loginError(err = true) {
    return {
        type: authConst.LOGIN_ERROR,
        err,
    }
}

/*
 * Logout
 */

export function logout() {
    return {
        type: authConst.LOGOUT,
    }
}

/*
 * User data
 */

export function loadUser() {
    return {
        type: authConst.LOAD_USER,
    };
}

export function userLoaded(data) {
    return {
        type: authConst.USER_LOADED,
        data,
    };
}

export function userLoadingError(err = true) {
    return {
        type: authConst.USER_LOADING_ERROR,
        err,
    };
}
