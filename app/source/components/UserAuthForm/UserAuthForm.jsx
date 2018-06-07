import React from 'react';
import PropTypes from 'prop-types';

import './UserAuthForm.less';

class UserAuthForm extends React.PureComponent {
    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.usernameRef = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { onSubmit, signup } = this.props;
        const data = {
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value,
        };
        if (signup) {
            data.username = this.usernameRef.current.value;
        }
        onSubmit && onSubmit(data);
    };

    renderTitle() {
        const { signup } = this.props;
        const title = signup ? 'Sign up' : 'Please sign in';
        return (
            <h2 className='user-auth-form-title'>{title}</h2>
        );
    };

    renderUsername() {
        const { signup } = this.props;
        if (signup) {
            return (
                <React.Fragment>
                    <label htmlFor='inputUsername' className='sr-only'>
                        Username
                    </label>
                    <input
                        type='text'
                        name='username'
                        id='inputUsername'
                        ref={this.usernameRef}
                        className='form-control'
                        placeholder='Username'
                        required=''
                        autoComplete='off'
                    />
                </React.Fragment>
            );
        }
        return null;
    }

    render() {
        return (
            <form
                className='user-auth-form'
                onSubmit={this.handleSubmit}
            >
                {this.renderTitle()}
                {this.renderUsername()}
                <label htmlFor='inputEmail' className='sr-only'>
                    Email address
                </label>
                <input
                    type='email'
                    id='inputEmail'
                    ref={this.emailRef}
                    className='form-control'
                    placeholder='Email address'
                    required=''
                    autoComplete='off'
                />
                <label htmlFor='inputPassword' className='sr-only'>
                    Password
                </label>
                <input
                    type='password'
                    id='inputPassword'
                    ref={this.passwordRef}
                    className='form-control'
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
                {this.props.children}
            </form>
        );
    }
}

UserAuthForm.propTypes = {
    onSubmit: PropTypes.func,
    signup: PropTypes.bool,
};

UserAuthForm.defaultProps = {
    onSubmit: null,
    signup: false,
};

export default UserAuthForm;
