import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { login } from '../../model/auth/authActions';
import User from '../../model/auth/User';
import auth from '../../services/auth';
import * as location from '../../services/location';

import '../form-signin.less';

class LoginView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.emailRef = null;
        this.passwordRef = null;
    }

    componentDidMount() {
        if (auth.isAuthorized()) {
            location.replace('/')
        }
    }

    submitLogin(e) {
        e.preventDefault();
        const { login } = this.props;
        const loginUser = new User({
            email: this.emailRef.value,
            password: this.passwordRef.value,
        });
        login(loginUser);
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
    () => ({}), {
        login,
    }
)(LoginView);
