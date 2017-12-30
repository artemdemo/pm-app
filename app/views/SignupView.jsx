import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signup, checkAuthentication } from '../model/actions/user';
import { errorMessage } from '../model/actions/notification';

import './form-signin.less';

class SignupView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.usernameRef = null;
        this.emailRef = null;
        this.passwordRef = null;
        this.rememberRef = null;
    }

    componentWillMount() {
        const { checkAuthentication, location } = this.props;
        checkAuthentication(location);
    }

    submitSignup(e) {
        e.preventDefault();
        const { signup, errorMessage } = this.props;
        const username = this.usernameRef.value;
        const email = this.emailRef.value;
        const password = this.passwordRef.value;
        const remember = this.rememberRef.checked;
        if (username !== '' &&
            email !== '' &&
            password !== '') {
            signup({
                username,
                email,
                password,
                remember,
            });
        } else {
            errorMessage('Please fill all fields');
        }
    }

    render() {
        return (
            <div className='container'>
                <form
                    className='form-signin'
                    onSubmit={this.submitSignup.bind(this)}
                >
                    <h2 className='form-signin-heading'>Sign up</h2>
                    <label htmlFor='inputUsername' className='sr-only'>
                        Username
                    </label>
                    <input
                        type='text'
                        name='username'
                        ref={ref => this.usernameRef = ref}
                        className='form-control form-signin__first-input'
                        placeholder='Username'
                        required=''
                        autoComplete='off'
                    />
                    <label htmlFor='inputEmail' className='sr-only'>
                        Email address
                    </label>
                    <input
                        type='email'
                        name='email'
                        ref={ref => this.emailRef = ref}
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
                        Sign up
                    </button>
                    <Link
                        to='/login'
                        className='btn btn-link btn-block'
                        data-qa='link-to-login'
                    >
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
