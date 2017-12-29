import * as userConst from '../model/constants/user';

let storedToken = null;

export function storeToken(token, saveInStorage) {
    if (saveInStorage) {
        window.localStorage.setItem(userConst.LS_ITEM_NAME, token);
    }
    storedToken = token;
}

export function getStoredToken() {
    const token = window.localStorage.getItem(userConst.LS_ITEM_NAME);
    return token || storedToken;
}

export function removeStoredToken() {
    window.localStorage.removeItem(userConst.LS_ITEM_NAME);
    storedToken = null;
}
