import * as userConst from '../constants/user';

export default function user(state = [], action) {
    switch (action.type) {
        case userConst.IS_AUTHENTICATED:
            return {
                token: action.token
            }
        default:
            return state;
    }
}
