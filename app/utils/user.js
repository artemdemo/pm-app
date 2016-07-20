import * as userConst from '../constants/user';

if (!('localStorage' in window)) {
    window.localStorage = {
        _data: {},
        setItem: (id, val) => this._data[id] = String(val),
        getItem: (id) => this._data.hasOwnProperty(id) ? this._data[id] : null,
        removeItem: (id) => delete this._data[id],
        clear: () => this._data = {},
    };
}

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
