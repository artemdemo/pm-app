import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signup, checkAuthentication } from '../model/actions/user';
import { errorMessage } from '../model/actions/notification';

import './form-signin.less';

class SignupView extends Component {
    constructor(props) {
        super(props);

        this.submitSignup = (e) => {
            e.preventDefault();
            const { signup, errorMessage } = this.props;
            const username = this.refs.username;
            const email = this.refs.email;
            const password = this.refs.password;
            const remember = this.refs.remember;
            if (username.value !== '' &&
                email.value !== '' &&
                password.value !== '') {
                signup({
                    username: username.value,
                    email: email.value,
                    password: password.value,
                    remember: remember.checked,
                });
            } else {
                errorMessage('Please fill all fields');
            }
        };
    }

    componentWillMount() {
        const { checkAuthentication, location } = this.props;
        checkAuthentication(location);
    }

    render() {
        return (
            <div className='container'>
                <form className='form-signin' onSubmit={this.submitSignup}>
                    <h2 className='form-signin-heading'>Sign up</h2>
                    <label htmlFor='inputUsername' className='sr-only'>
                        Username
                    </label>
                    <input
                        type='text'
                        name='username'
                        ref='username'
                        className='form-control form-signin__first-input'
                        placeholder='Username'
                        required=''
                        autoFocus=''
                        autoComplete='off'
                    />
                    <label htmlFor='inputEmail' className='sr-only'>
                        Email address
                    </label>
                    <input
                        type='email'
                        name='email'
                        ref='email'
                        className='form-control form-signin__input'
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
                    <button className='btn btn-lg btn-primary btn-block'
                        type='submit'>
                        Sign up
                    </button>
                    <Link to='/login' className='btn btn-link btn-block' data-qa='link-to-login'>
                        I have an account - login
                    </Link>
                </form>
            </div>
        );
    }
}

export default connect(
    () => ({}), {
        signup,
        checkAuthentication,
        errorMessage,
    }
)(SignupView);
