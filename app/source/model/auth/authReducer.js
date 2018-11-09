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
    [authActions.loggedIn]: (state, action) => ({
        ...state,
        data: action.data,
        login: false,
        loginError: null,
    }),
    [authActions.loginError]: (state, action) => ({
        ...state,
        login: false,
        loginError: action.err,
    }),
};

/*
 * Signup
 */
const signupReducers = {
    [authActions.signup]: {
        signup: true,
    },
    [authActions.signedUp]: (state, action) => ({
        ...state,
        data: action.data,
        signup: false,
        signupError: null,
    }),
    [authActions.signupError]: (state, action) => ({
        ...state,
        signup: false,
        signupError: action.err,
    }),
};

/*
 * User data reducers
 */
const userDataReducers = {
    [authActions.loadUser]: {
        loading: true,
    },
    [authActions.userLoaded]: (state, action) => ({
        ...state,
        data: action.data,
        loading: false,
        loadingError: null,
    }),
    [authActions.userLoadingError]: (state, action) => ({
        ...state,
        loading: false,
        loadingError: action.err,
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
