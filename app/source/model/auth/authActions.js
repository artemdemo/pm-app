import { createAction } from 'redux-act';

/*
 * Login
 */

export const login = createAction('LOGIN');
export const loggedIn = createAction('LOGGED_IN');
export const loginError = createAction('LOGIN_ERROR', (err = true) => ({ err }));

/*
 * Logout
 */

export const logout = createAction('LOGOUT');

/*
 * User data
 */
export const loadUser = createAction('LOAD_USER');
export const userLoaded = createAction('USER_LOADED');
export const userLoadingError = createAction('USER_LOADING_ERROR', (err = true) => ({ err }));

/*
 * Signup
 */

export const signup = createAction('SIGNUP');
export const signedUp = createAction('SIGNED_UP');
export const signupError = createAction('SIGNUP_ERROR', (err = true) => ({ err }));

/*
 * Reset
 */

export const resetUser = createAction('RESET_USER');
