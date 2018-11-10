import * as actions from '../authActions';
import reducer from '../authReducer';

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
        expect(reducer()).toEqual(initState);
    });
    describe('loginReducers', () => {
        it('login', () => {
            expect(reducer(initState, actions.login()))
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
                const payload = actions.loginResult(data);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data,
                        login: false,
                        loginError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = actions.loginResult(err);
                expect(reducer(state, payload))
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
            expect(reducer(initState, actions.signup()))
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
                const payload = actions.signupResult(data);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data,
                        signup: false,
                        signupError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = actions.signupResult(err);
                expect(reducer(state, payload))
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
            expect(reducer(initState, actions.loadUser()))
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
                const payload = actions.loadUserResult(data);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data,
                        loading: false,
                        loadingError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = actions.loadUserResult(err);
                expect(reducer(state, payload))
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
            expect(reducer(state, actions.resetUser()))
                .toEqual({
                    ...initState,
                });
        });
    });
});
