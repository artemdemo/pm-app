import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, checkAuthentication } from '../model/user/userActions';
import { history } from '../store';

import './form-signin.less';

class LoginView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.emailRef = null;
        this.passwordRef = null;
        this.rememberRef = null;
    }

    componentWillMount() {
        const { checkAuthentication, location } = this.props;
        checkAuthentication(location);
    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user.token) {
            history.push('/tasks');
        }
    }

    submitLogin(e) {
        e.preventDefault();
        const { login } = this.props;
        login({
            email: this.emailRef.value,
            password: this.passwordRef.value,
            remember: this.rememberRef.checked,
        });
    }

    render() {
        return (
            <div className='container'>
                <form
                    className='form-signin'
                    onSubmit={this.submitLogin.bind(this)}
                >
                    <h2 className='form-signin-heading'>Please sign in</h2>
                    <label htmlFor='inputEmail' className='sr-only'>
                        Email address
                    </label>
                    <input
                        type='email'
                        name='email'
                        ref={ref => this.emailRef = ref}
                        className='form-control form-signin__first-input'
                        placeholder='Email address'
                        required=''
                        autoComplete='off'
                    />
                    <label htmlFor='inputPassword' className='sr-only'>
                        Password
                    </label>
                    <input
                        type='password'
                        name='password'
                        ref={ref => this.passwordRef = ref}
                        className='form-control form-signin__last-input'
                        placeholder='Password'
                        required=''
                        autoComplete='off'
                    />
                    <div className='checkbox'>
                        <label>
                            <input
                                type='checkbox'
                                name='remember'
                                ref={ref => this.rememberRef = ref}
                                value='remember-me'
                            /> Remember me
                        </label>
                    </div>
                    <button
                        className='btn btn-lg btn-primary btn-block'
                        type='submit'
                    >
                        Login
                    </button>
                    <Link to='/signup' className='btn btn-link btn-block' data-qa='link-to-signup'>
                        Create new account - sign up
                    </Link>
                </form>
            </div>
        );
    }
}

export default connect(
    state => ({
        user: state.user,
    }), {
        login,
        checkAuthentication,
    }
)(LoginView);
