import * as authConst from './authConst';

/**
 * @param loginUser {LoginUser}
 */
export function login(loginUser) {
    return {
        type: authConst.LOGIN,
        loginUser,
    }
}

export function loggedIn() {
    return {
        type: authConst.LOGGED_IN,
    }
}

export function loginError(err = true) {
    return {
        type: authConst.LOGIN_ERROR,
        err,
    }
}
