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

export default function authReducer(state = initState, action) {
    switch (action.type) {
        /*
         * Login
         */
        case `${authActions.login}`:
            return {
                ...state,
                login: true,
            };
        case `${authActions.loggedIn}`:
            return {
                ...state,
                data: action.data,
                login: false,
                loginError: null,
            };
        case `${authActions.loginError}`:
            return {
                ...state,
                login: false,
                loginError: action.err,
            };
        /*
         * Signup
         */
        case `${authActions.signup}`:
            return {
                ...state,
                signup: true,
            };
        case `${authActions.signedUp}`:
            return {
                ...state,
                data: action.data,
                signup: false,
                signupError: null,
            };
        case `${authActions.signupError}`:
            return {
                ...state,
                signup: false,
                signupError: action.err,
            };
        /*
         * Loading user data
         */
        case `${authActions.loadUser}`:
            return {
                ...state,
                loading: true,
            };
        case `${authActions.userLoaded}`:
            return {
                ...state,
                data: action.data,
                loading: false,
                loadingError: null,
            };
        case `${authActions.userLoadingError}`:
            return {
                ...state,
                loading: false,
                loadingError: null,
            };
        case `${authActions.resetUser}`:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
