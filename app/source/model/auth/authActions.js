import { createAction } from '../../services/actionCreator';

/*
 * Login
 */

export const login = createAction('LOGIN', data => ({ data }));
export const loggedIn = createAction('LOGGED_IN', data => ({ data }));
export const loginError = createAction('LOGIN_ERROR', (err = true) => ({ err }));

/*
 * Logout
 */

export const logout = createAction('LOGOUT');

/*
 * User data
 */
export const loadUser = createAction('LOAD_USER');
export const userLoaded = createAction('USER_LOADED', data => ({ data }));
export const userLoadingError = createAction('USER_LOADING_ERROR', (err = true) => ({ err }));

/*
 * Signup
 */

export const signup = createAction('SIGNUP', data => ({ data }));
export const signedUp = createAction('SIGNED_UP', data => ({ data }));
export const signupError = createAction('SIGNUP_ERROR', (err = true) => ({ err }));

/*
 * Reset
 */

export const resetUser = createAction('RESET_USER');
