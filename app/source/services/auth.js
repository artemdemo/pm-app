const PM_TOKEN_ID = 'PM_TOKEN_ID';
const PM_TOKEN_EXP = 'PM_TOKEN_EXP';

export class Token {
    constructor(token, expires) {
        this.token = token;
        this.expires = Number(expires);
    }
}

/**
 *
 * @param tokenInstance {Token}
 */
const saveToken = (tokenInstance) => {
    localStorage.setItem(PM_TOKEN_ID, tokenInstance.token);
    localStorage.setItem(PM_TOKEN_EXP, tokenInstance.expires);
};

/**
 *
 * @return {Token|null}
 */
const getToken = () => {
    const token = localStorage.getItem(PM_TOKEN_ID);
    const expires = localStorage.getItem(PM_TOKEN_EXP);
    if (token && expires) {
        return new Token(token, expires)
    }
    return null;
};

const removeToken = () => {
    localStorage.removeItem(PM_TOKEN_ID);
    localStorage.removeItem(PM_TOKEN_EXP);
};

/**
 *
 * @return {boolean}
 */
const isAuthorized = () => {
    const tokenInstance = getToken();
    if (tokenInstance) {
        const nowTimestamp = (new Date()).getTime();
        return nowTimestamp < tokenInstance.expires;
    }
    return false;
};

export default {
    saveToken,
    getToken,
    removeToken,
    isAuthorized,
};
