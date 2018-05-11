import * as userConst from './userConst';

const initState = (() => {
    const token = window.localStorage.getItem(userConst.LS_ITEM_NAME);
    if (token) {
        return {
            token,
        };
    }
    return {};
})();

export default function user(state = initState, action) {
    switch (action.type) {
        case userConst.USER_AUTHENTICATED:
            return {
                username: action.user.username,
                email: action.user.email,
                added: action.user.added,
                updated: action.user.updated,
            };
        case userConst.AUTHENTICATION_ERROR:
            return {};
        default:
            return state;
    }
}
