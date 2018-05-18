import React from 'react';

const authorization = (WrappedComponent) => {
    class WithAuthorization extends React.Component {
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

        updateState() {
            this.setState({
                allowed: false,
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