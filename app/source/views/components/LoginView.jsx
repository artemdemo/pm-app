import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import UserAuthForm from '../../components/UserAuthForm/UserAuthForm';
import { login } from '../../model/auth/authActions';
import { errorMessage } from '../../model/notification/notificationActions';
import User from '../../model/auth/User';
import auth from '../../services/auth';
import * as location from '../../services/location';

class LoginView extends React.PureComponent {
    componentDidMount() {
        if (auth.isAuthorized()) {
            location.replace('/')
        }
    }

    submitLogin = ({ email, password }) => {
        const { login } = this.props;
        try {
            const loginUser = new User({
                email,
                password,
            });
            login(loginUser);
        } catch (e) {
            errorMessage('Please fill all fields');
        }
    };

    render() {
        return (
            <div className='container'>
                <UserAuthForm
                    onSubmit={this.submitLogin}
                />
                <Link
                    to='/signup'
                    className='btn btn-link btn-block'
                >
                    Create new account - sign up
                </Link>
            </div>
        );
    }
}

export default connect(
    () => ({}), {
        login,
    }
)(LoginView);
