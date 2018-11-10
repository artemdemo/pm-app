import * as authActions from './authActions';
import { createReducer } from '../../services/reducerCreator';

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
    [authActions.login]: {
        login: true,
    },
    [authActions.loggedIn]: (state, payload) => ({
        ...state,
        data: payload.data,
        login: false,
        loginError: null,
    }),
    [authActions.loginError]: (state, payload) => ({
        ...state,
        login: false,
        loginError: payload.err,
    }),
};

/*
 * Signup
 */
const signupReducers = {
    [authActions.signup]: {
        signup: true,
    },
    [authActions.signedUp]: (state, payload) => ({
        ...state,
        data: payload.data,
        signup: false,
        signupError: null,
    }),
    [authActions.signupError]: (state, payload) => ({
        ...state,
        signup: false,
        signupError: payload.err,
    }),
};

/*
 * User data reducers
 */
const userDataReducers = {
    [authActions.loadUser]: {
        loading: true,
    },
    [authActions.userLoaded]: (state, payload) => ({
        ...state,
        data: payload.data,
        loading: false,
        loadingError: null,
    }),
    [authActions.userLoadingError]: (state, payload) => ({
        ...state,
        loading: false,
        loadingError: payload.err,
    }),
    [authActions.resetUser]: () => ({
        ...initState,
    }),
};

export default createReducer(initState, {
    ...loginReducers,
    ...signupReducers,
    ...userDataReducers,
});
