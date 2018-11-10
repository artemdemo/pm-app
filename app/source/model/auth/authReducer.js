import { createReducer } from 'redux-act';
import _isError from 'lodash/isError';
import * as authActions from './authActions';

const initState = {
    data: {},
    login: false,
    loginError: null,
    signup: false,
    signupError: null,
    loading: false,
    loadingError: null,
};

/*
 * Login
 */
const loginReducers = {
    [authActions.login]: (state) => ({
        ...state,
        login: true,
    }),
    [authActions.loginResult]: (state, payload) => ({
        ...state,
        login: false,
        data: _isError(payload) ? state.data : payload,
        loginError: _isError(payload) ? payload : null,
    }),
};

/*
 * Signup
 */
const signupReducers = {
    [authActions.signup]: (state) => ({
        ...state,
        signup: true,
    }),
    [authActions.signupResult]: (state, payload) => ({
        ...state,
        signup: false,
        data: _isError(payload) ? state.data : payload,
        signupError: _isError(payload) ? payload : null,
    }),
};

/*
 * User data reducers
 */
const userDataReducers = {
    [authActions.loadUser]: (state) => ({
        ...state,
        loading: true,
    }),
    [authActions.loadUserResult]: (state, payload) => ({
        ...state,
        loading: false,
        data: _isError(payload) ? state.data : payload,
        loadingError: _isError(payload) ? payload : null,
    }),
    [authActions.resetUser]: () => ({
        ...initState,
    }),
};

export default createReducer({
    ...loginReducers,
    ...signupReducers,
    ...userDataReducers,
}, initState);
