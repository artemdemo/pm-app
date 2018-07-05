import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

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
        const title = signup ? 'sign-up' : 'please-sign-in';
        return (
            <h2 className='user-auth-form-title'>
                <Translate id={title} />
            </h2>
        );
    };

    renderUsername() {
        const { signup } = this.props;
        if (signup) {
            return (
                <Translate>
                    {({ translate }) => (
                        <React.Fragment>
                            <label htmlFor='inputUsername' className='sr-only'>
                                {translate('username')}
                            </label>
                            <input
                                type='text'
                                name='username'
                                id='inputUsername'
                                ref={this.usernameRef}
                                className='form-control'
                                placeholder={translate('username')}
                                required=''
                                autoComplete='off'
                            />
                        </React.Fragment>
                    )}
                </Translate>
            );
        }
        return null;
    }

    render() {
        return (
            <Translate>
                {({ translate }) => (
                    <form
                        className='user-auth-form'
                        onSubmit={this.handleSubmit}
                    >
                        {this.renderTitle()}
                        {this.renderUsername()}
                        <label htmlFor='inputEmail' className='sr-only'>
                            {translate('email-address')}
                        </label>
                        <input
                            type='email'
                            id='inputEmail'
                            ref={this.emailRef}
                            className='form-control'
                            placeholder={translate('email-address')}
                            required=''
                            autoComplete='off'
                        />
                        <label htmlFor='inputPassword' className='sr-only'>
                            {translate('password')}
                        </label>
                        <input
                            type='password'
                            id='inputPassword'
                            ref={this.passwordRef}
                            className='form-control'
                            placeholder={translate('password')}
                            required=''
                            autoComplete='off'
                        />
                        <button
                            className='btn btn-lg btn-primary btn-block'
                            type='submit'
                        >
                            {translate('login')}
                        </button>
                        {this.props.children}
                    </form>
                )}
            </Translate>
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
