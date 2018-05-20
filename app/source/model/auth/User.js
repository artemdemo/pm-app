/**
 * Business object of `User`
 */
export default class User {
    constructor({
        username,
        email,
        password,
    }) {
        // I'm using `==` in order to catch both `null` and `undefined`
        if (email == null || email === '') {
            throw new Error('"email" should be defined and not empty');
        }
        if (password == null || password === '') {
            throw new Error('"password" should be defined and not empty');
        }
        this.email = email;
        this.password = password;
        if (username != null) {
            if (username === '') {
                throw new Error('"username" can\'t be empty string');
            }
            this.username = username;
        }
    }
}
