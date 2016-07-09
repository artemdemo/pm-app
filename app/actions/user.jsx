import * as userConst from '../constants/user';

export function updateToken(token) {
    return {
        type: userConst.UPDATE_TOKEN,
        token
    }
}

export function checkIfHasToken() {
    const token = window.localStorage.getItem('pm-token');

    return updateToken(token);
}
