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
    [authActions.loginResult]: (state, payload) => {
        if (_isError(payload)) {
            return {
                ...state,
                login: false,
                loginError: payload.err,
            };
        }
        return {
            ...state,
            data: payload,
            login: false,
            loginError: null,
        };
    },
};

/*
 * Signup
 */
const signupReducers = {
    [authActions.signup]: (state) => ({
        ...state,
        signup: true,
    }),
    [authActions.signupResult]: (state, payload) => {
        if (_isError(payload)) {
            return {
                ...state,
                signup: false,
                signupError: payload.err,
            };
        }
        return {
            ...state,
            data: payload,
            signup: false,
            signupError: null,
        };
    },
};

/*
 * User data reducers
 */
const userDataReducers = {
    [authActions.loadUser]: (state) => ({
        ...state,
        loading: true,
    }),
    [authActions.loadUserResult]: (state, payload) => {
        if (_isError(payload)) {
            return {
                ...state,
                loading: false,
                loadingError: payload.err,
            };
        }
        return {
            ...state,
            data: payload,
            loading: false,
            loadingError: null,
        };
    },
    [authActions.resetUser]: () => ({
        ...initState,
    }),
};

export default createReducer({
    ...loginReducers,
    ...signupReducers,
    ...userDataReducers,
}, initState);
