import * as authConst from './authConst';

const initState = {
    login: false,
    loginError: null,
};

export default function authReducer(state = initState, action) {
    switch (action.type) {
        case authConst.LOGIN:
            return {
                ...initState,
                login: true,
            };
        case authConst.LOGGED_IN:
            return {
                ...initState,
                login: false,
                loginError: null,
            };
        case authConst.LOGIN_ERROR:
            return {
                ...initState,
                login: false,
                loginError: action.err,
            };
        default:
        return state;
    }
}
