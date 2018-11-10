import * as actions from '../authActions';

describe('authActions', () => {
    describe('Login', () => {
        it('login', () => {
            const data = {
                message: 'some data',
            };
            const result = actions.login(data);
            expect(Object.keys(result).sort()).toEqual(['type', 'data'].sort());
            expect(result).toHaveProperty('data', data);
        });
        it('logged in', () => {
            const data = {
                message: 'some data',
            };
            const result = actions.loggedIn(data);
            expect(Object.keys(result).sort()).toEqual(['type', 'data'].sort());
            expect(result).toHaveProperty('data', data);
        });
        it('login error', () => {
            const err = {
                message: 'some error',
            };
            expect(actions.loginError()).toHaveProperty('err', true);
            const result = actions.loginError(err);
            expect(Object.keys(result).sort()).toEqual(['type', 'err'].sort());
            expect(result).toHaveProperty('err', err);
        });
    });
    describe('Logout', () => {
        it('logout', () => {
            const result = actions.logout();
            expect(Object.keys(result).sort()).toEqual(['type'].sort());
        });
    });
    describe('User data', () => {
        it('load user', () => {
            const result = actions.loadUser();
            expect(Object.keys(result).sort()).toEqual(['type'].sort());
        });
        it('user loaded', () => {
            const data = {
                message: 'some data',
            };
            const result = actions.userLoaded(data);
            expect(Object.keys(result).sort()).toEqual(['type', 'data'].sort());
            expect(result).toHaveProperty('data', data);
        });
        it('loading user error', () => {
            const err = {
                message: 'some error',
            };
            expect(actions.userLoadingError()).toHaveProperty('err', true);
            const result = actions.userLoadingError(err);
            expect(Object.keys(result).sort()).toEqual(['type', 'err'].sort());
            expect(result).toHaveProperty('err', err);
        });
    });
    describe('Signup', () => {
        it('signup user', () => {
            const data = {
                message: 'some data',
            };
            const result = actions.signup(data);
            expect(Object.keys(result).sort()).toEqual(['type', 'data'].sort());
        });
        it('user signed up', () => {
            const data = {
                message: 'some data',
            };
            const result = actions.signedUp(data);
            expect(Object.keys(result).sort()).toEqual(['type', 'data'].sort());
            expect(result).toHaveProperty('data', data);
        });
        it('signing up user error', () => {
            const err = {
                message: 'some error',
            };
            expect(actions.signupError()).toHaveProperty('err', true);
            const result = actions.signupError(err);
            expect(Object.keys(result).sort()).toEqual(['type', 'err'].sort());
            expect(result).toHaveProperty('err', err);
        });
    });
    describe('Reset', () => {
        it('reset user', () => {
            const result = actions.resetUser();
            expect(Object.keys(result).sort()).toEqual(['type'].sort());
        });
    });
});
