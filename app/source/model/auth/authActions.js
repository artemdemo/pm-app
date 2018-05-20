import * as authConst from './authConst';

/*
 * Login
 */

/**
 * @param data {LoginUser}
 */
export function login(data) {
    return {
        type: authConst.LOGIN,
        data,
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

/*
 * Signup
 */

export function signup(data) {
    return {
        type: authConst.SIGNUP,
        data
    };
}

export function signedUp(data) {
    return {
        type: authConst.SIGNED_UP,
        data,
    };
}

export function signupError(err = true) {
    return {
        type: authConst.SIGNUP_ERROR,
        err,
    };
}
