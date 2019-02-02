import { createAction } from 'redux-act';

/*
 * Login
 */

export const login = createAction('LOGIN');
export const loginResult = createAction('LOGIN_RESULT');

/*
 * Logout
 */

export const logout = createAction('LOGOUT');

/*
 * User data
 */

export const loadUser = createAction('LOAD_USER');
export const loadUserResult = createAction('LOAD_USER_RESULT');

/*
 * Signup
 */

export const signup = createAction('SIGNUP');
export const signupResult = createAction('SIGNUP_RESULT');

/*
 * Reset
 */

export const resetUser = createAction('RESET_USER');
