import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import UserAuthForm from '../../components/UserAuthForm/UserAuthForm';
import { signup } from '../../model/auth/authActions';
import { errorMessage } from '../../model/notification/notificationActions';
import User from '../../model/auth/User';
import auth from '../../services/auth';
import * as location from '../../services/location';

class SignupView extends React.PureComponent {
    componentDidMount() {
        if (auth.isAuthorized()) {
            location.replace('/')
        }
    }

    submitSignup = ({ email, password, username }) => {
        const { signup, errorMessage } = this.props;
        try {
            const signupUser = new User({
                username,
                email,
                password,
            });
            signup(signupUser);
        } catch (e) {
            errorMessage('Please fill all fields');
        }
    };

    render() {
        return (
            <UserAuthForm
                onSubmit={this.submitSignup}
                signup
            >
                <Link
                    to='/login'
                    className='btn btn-link btn-block'
                    data-qa='link-to-login'
                >
                    I have an account - login
                </Link>
            </UserAuthForm>
        );
    }
}

export default connect(
    () => ({}), {
        signup,
        errorMessage,
    }
)(SignupView);
