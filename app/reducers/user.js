import * as userConst from '../constants/user';

export default function user(state = {}, action) {
    switch (action.type) {
        case userConst.USER_AUTHENTICATED:
            return {
                token: action.token,
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
