import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from '../configs';

export function requireAuthentication(NComponent) {

    class AuthenticatedComponent extends Component {

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps() {
            this.checkAuth();
        }

        checkAuth() {
            if (!this.props.token) {
                const redirectAfterLogin = this.props.location.pathname;
                history.push(`/login?next=${redirectAfterLogin}`);
            }
        }

        render() {
            return (
                <div>
                    {!!this.props.token ?
                        <NComponent {...this.props} /> :
                        null
                    }
                </div>
            );

        }
    }

    return connect(
        state => {
            return {
                token: state.user.token,
            };
        }
    )(AuthenticatedComponent);

}
