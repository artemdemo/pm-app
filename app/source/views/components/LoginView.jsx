import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import UserAuthForm from '../../components/UserAuthForm/UserAuthForm';
import { errorMsg } from '../../components/Notificator/Notificator';
import { login } from '../../model/auth/authActions';
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
            errorMsg(e.toString());
        }
    };

    render() {
        return (
            <UserAuthForm
                onSubmit={this.submitLogin}
            >
                <Link
                    to='/signup'
                    className='btn btn-link btn-block'
                >
                    <Translate id='create-new-account' />
                </Link>
            </UserAuthForm>
        );
    }
}

export default connect(
    () => ({}), {
        login,
    }
)(LoginView);
