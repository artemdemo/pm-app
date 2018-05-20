import * as authConst from './authConst';

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
        case authConst.LOGIN:
            return {
                ...state,
                login: true,
            };
        case authConst.LOGGED_IN:
            return {
                ...state,
                data: action.data,
                login: false,
                loginError: null,
            };
        case authConst.LOGIN_ERROR:
            return {
                ...state,
                login: false,
                loginError: action.err,
            };
        /*
         * Signup
         */
        case authConst.SIGNUP:
            return {
                ...state,
                signup: true,
            };
        case authConst.SIGNED_UP:
            return {
                ...state,
                data: action.data,
                signup: false,
                signupError: null,
            };
        case authConst.SIGNUP_ERROR:
            return {
                ...state,
                signup: false,
                signupError: action.err,
            };
        /*
         * Loading user data
         */
        case authConst.LOAD_USER:
            return {
                ...state,
                loading: true,
            };
        case authConst.USER_LOADED:
            return {
                ...state,
                data: action.data,
                loading: false,
                loadingError: null,
            };
        case authConst.USER_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: null,
            };
        case authConst.RESET_USER:
            return {
                ...initState,
            };
        default:
            return state;
    }
}
