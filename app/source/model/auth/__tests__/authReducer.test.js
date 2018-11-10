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
        it('loggedIn', () => {
            const data = {
                message: 'Some data',
            };
            const action = authActions.loggedIn(data);
            expect(authReducer(initState, action))
                .toEqual({
                    ...initState,
                    data,
                    login: false,
                    loginError: null,
                });
        });
        it('loginError', () => {
            const err = {
                message: 'Some error',
            };
            expect(authReducer(initState, authActions.loginError(err)))
                .toEqual({
                    ...initState,
                    login: false,
                    loginError: err,
                });
        });
    });
});
