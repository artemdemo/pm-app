import React from 'react';
import auth from '../../services/auth';
import * as location from '../../services/location';

const authorization = (WrappedComponent) => {
    class WithAuthorization extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                allowed: true,
            };
        }

        componentWillMount() {
            this.updateState(this.props);
        }

        componentWillReceiveProps(nextProps) {
            this.updateState(nextProps);
        }

        updateState() {
            if (auth.isAuthorized()) {
                this.setState({
                    allowed: true,
                });
            } else {
                auth.removeToken();
                location.push('/login');
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
