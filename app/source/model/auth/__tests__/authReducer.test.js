import * as authActions from '../authActions';
import authReducer from '../authReducer';

const initState = {
    data: {},
    login: false,
    loginError: null,
    signup: false,
    signupError: null,
    loading: false,
    loadingError: null,
};

describe('authReducer', () => {
    it('should return initState', () => {
        expect(authReducer()).toEqual(initState);
    });
    describe('loginReducers', () => {
        it('login', () => {
            expect(authReducer(initState, authActions.login()))
                .toEqual({
                    ...initState,
                    login: true,
                });
        });
        describe('loginResult', () => {
            const data = {
                message: 'Some data',
            };
            const state = {
                ...initState,
                login: true,
            };

            it('data', () => {
                const payload = authActions.loginResult(data);
                expect(authReducer(state, payload))
                    .toEqual({
                        ...initState,
                        data,
                        login: false,
                        loginError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = authActions.loginResult(err);
                expect(authReducer(state, payload))
                    .toEqual({
                        ...initState,
                        login: false,
                        loginError: err,
                    });
            });
        });
    });
    describe('signupReducers', () => {
        it('signup', () => {
            expect(authReducer(initState, authActions.signup()))
                .toEqual({
                    ...initState,
                    signup: true,
                });
        });
        describe('signupResult', () => {
            const data = {
                message: 'Some data',
            };
            const state = {
                ...initState,
                signup: true,
            };

            it('data', () => {
                const payload = authActions.signupResult(data);
                expect(authReducer(state, payload))
                    .toEqual({
                        ...initState,
                        data,
                        signup: false,
                        signupError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = authActions.signupResult(err);
                expect(authReducer(state, payload))
                    .toEqual({
                        ...initState,
                        signup: false,
                        signupError: err,
                    });
            });
        });
    });
    describe('userDataReducers', () => {
        it('userData', () => {
            expect(authReducer(initState, authActions.loadUser()))
                .toEqual({
                    ...initState,
                    loading: true,
                });
        });
        describe('userDataResult', () => {
            const data = {
                message: 'Some data',
            };
            const state = {
                ...initState,
                loading: true,
            };

            it('data', () => {
                const payload = authActions.loadUserResult(data);
                expect(authReducer(state, payload))
                    .toEqual({
                        ...initState,
                        data,
                        loading: false,
                        loadingError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = authActions.loadUserResult(err);
                expect(authReducer(state, payload))
                    .toEqual({
                        ...initState,
                        loading: false,
                        loadingError: err,
                    });
            });
        });
        it('should reset user', () => {
            const state = {
                ...initState,
                data: { message: 'Prev data' },
                loading: true,
            };
            expect(authReducer(state, authActions.resetUser()))
                .toEqual({
                    ...initState,
                });
        });
    });
});
