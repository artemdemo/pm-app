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
});
