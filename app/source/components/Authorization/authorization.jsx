import React from 'react';
import auth from '../../services/auth';
import * as location from '../../services/location';

const authorization = (WrappedComponent) => {
    class WithAuthorization extends React.Component {
        static getDerivedStateFromProps() {
            if (auth.isAuthorized()) {
                return {
                    allowed: true,
                }
            }
            WithAuthorization.redirectToLoginPage();
            return null;
        }

        static redirectToLoginPage() {
            auth.removeToken();
            location.push('/login');
        }

        constructor(props) {
            super(props);
            this.state = {
                allowed: false,
            };
        }

        componentDidMount() {
            if (auth.isAuthorized()) {
                this.setState({
                    allowed: true,
                });
            } else {
                WithAuthorization.redirectToLoginPage();
            }
        }

        render() {
            if (this.state.allowed) {
                return (
                    <WrappedComponent {...this.props} />
                );
            }
            return null;
        }
    }

    return WithAuthorization;
};


export default authorization;
