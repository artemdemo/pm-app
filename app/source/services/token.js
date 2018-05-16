const TOKEN_NAME = 'pm-token';

export class Token {
    constructor(token) {
        this.token = token;
    }
}

/**
 * Store given token
 * @param tokenInstance {Token}
 */
export function store(tokenInstance) {
    window.localStorage.setItem(TOKEN_NAME, tokenInstance.token);
}

/**
 * Return token
 * @return {Token}
 */
export function get() {
    const token = window.localStorage.getItem(TOKEN_NAME);
    const tokenInstance = new Token(token);
    return tokenInstance;
}

export function remove() {
    window.localStorage.removeItem(TOKEN_NAME);
}
