import React, { Component } from 'react';

const authorization = (WrappedComponent) => {
    class WithAuthorization extends Component {
        constructor(props) {
            super(props);
            this.state = {
                isLoadingUserData: true,
                allowed: true,
            };
        }

        componentWillMount() {
            this.updateState(this.props);
        }

        componentWillReceiveProps(nextProps) {
            this.updateState(nextProps);
        }

        updateState(props) {
            const { user, location } = props;
            const permission = checkUrlPermission(location.pathname, user.data.permissions.views, publicPath);
            this.setState({
                allowed: permission,
                isLoadingUserData: this.state.isLoadingUserData === true ? user.loading : false,
            });
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
