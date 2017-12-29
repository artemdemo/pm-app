import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { login, checkAuthentication } from '../model/actions/user';
import { history } from '../configs';

import './form-signin.less';

class LoginView extends Component {
    constructor(props) {
        super(props);

        this.submitLogin = (e) => {
            e.preventDefault();
            const { login } = this.props;
            login({
                email: this.refs.email.value,
                password: this.refs.password.value,
                remember: this.refs.remember.checked,
            });
        };
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

    render() {
        return (
            <div className='container'>
                <form className='form-signin' onSubmit={this.submitLogin}>
                    <h2 className='form-signin-heading'>Please sign in</h2>
                    <label htmlFor='inputEmail' className='sr-only'>
                        Email address
                    </label>
                    <input
                        type='email'
                        name='email'
                        ref='email'
                        className='form-control form-signin__first-input'
                        placeholder='Email address'
                        required=''
                        autoFocus=''
                        autoComplete='off'
                    />
                    <label htmlFor='inputPassword' className='sr-only'>
                        Password
                    </label>
                    <input
                        type='password'
                        name='password'
                        ref='password'
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
                                ref='remember'
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
